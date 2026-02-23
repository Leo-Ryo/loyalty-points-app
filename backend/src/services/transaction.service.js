const transactionRepository = require('../repositories/transaction.repository');
const customerRepository = require('../repositories/customer.repository');
const rewardRepository = require('../repositories/reward.repository');
const settingsRepository = require('../repositories/settings.repository');
const prisma = require('../config/database.config');
const { ValidationError, NotFoundError } = require('../utils/error.util');

class TransactionService {
  async getAllTransactions({ type, customerId, employeeId, status, startDate, endDate } = {}) {
    return await transactionRepository.findAll({ type, customerId, employeeId, status, startDate, endDate });
  }

  async getCustomerTransactions(customerId) {
    return await transactionRepository.findByCustomerId(customerId);
  }

  async getPendingRedemptions() {
    return await transactionRepository.findAll({ status: 'pending' });
  }

  // Employee adds points from a bill: calculates pts = floor(billAmount * rate%)
  async earnFromBill(customerId, billAmount, employeeId, description) {
    const customer = await customerRepository.findById(customerId);
    if (!customer) throw new NotFoundError('Customer not found');
    if (!billAmount || billAmount <= 0) throw new ValidationError('Bill amount must be positive');

    const settings = await settingsRepository.get();
    const rate = settings?.pointsRatePercent ?? 5.0;
    const points = Math.floor(billAmount * (rate / 100));
    if (points <= 0) throw new ValidationError('Bill amount too small to earn points at current rate');

    const newPoints = customer.points + points;
    await customerRepository.updatePoints(customerId, newPoints);

    return await transactionRepository.create({
      customerId,
      employeeId: employeeId || null,
      type: 'earn',
      points,
      billAmount,
      status: 'completed',
      description: description || `Bill $${Number(billAmount).toFixed(2)} — ${rate}% = ${points} pts`,
    });
  }

  // Legacy manual earn (e.g., admin manually awards points)
  async earnPoints(customerId, points, employeeId, description = 'Points earned') {
    const customer = await customerRepository.findById(customerId);
    if (!customer) throw new NotFoundError('Customer not found');
    if (points <= 0) throw new ValidationError('Points must be greater than 0');
    const newPoints = customer.points + points;
    await customerRepository.updatePoints(customerId, newPoints);
    return await transactionRepository.create({
      customerId, employeeId: employeeId || null, type: 'earn', points,
      status: 'completed', description,
    });
  }

  // Kiosk: customer requests a trade → deducts points & stock immediately, creates PENDING transaction
  async requestRedeem(customerId, rewardId, inventoryId = null) {
    return await prisma.$transaction(async (tx) => {
      const customer = await tx.customer.findUnique({ where: { id: customerId } });
      if (!customer) throw new NotFoundError('Customer not found');

      let itemCost = 0;
      let title = '';

      if (rewardId) {
        const reward = await tx.reward.findUnique({ where: { id: rewardId } });
        if (!reward || !reward.isActive) throw new NotFoundError('Reward not available');
        itemCost = reward.pointsRequired;
        title = reward.rewardName;
      } else if (inventoryId) {
        const item = await tx.inventory.findUnique({ where: { id: inventoryId } });
        if (!item) throw new NotFoundError('Inventory item not found');
        if (item.stockQuantity <= 0) throw new ValidationError('Item out of stock');
        itemCost = item.price ? Math.floor(item.price) : 10;
        title = item.name;
        // Immediate Stock Deduction
        await tx.inventory.update({ where: { id: inventoryId }, data: { stockQuantity: { decrement: 1 } } });
      } else {
        throw new ValidationError('Must provide rewardId or inventoryId');
      }

      if (customer.points < itemCost) throw new ValidationError(`Insufficient points. Need ${itemCost} pts.`);

      // Immediate Point Deduction
      await tx.customer.update({ where: { id: customerId }, data: { points: { decrement: itemCost } } });

      return await tx.transaction.create({
        data: {
          customerId, rewardId, inventoryId, type: 'redeem',
          points: -itemCost,
          status: 'pending',
          description: `Pending Trade: ${title}`,
        }
      });
    });
  }

  // Employee approves a pending trade
  async approveRedeem(transactionId, employeeId) {
    const txn = await transactionRepository.findById(transactionId);
    if (!txn) throw new NotFoundError('Transaction not found');
    if (txn.status !== 'pending') throw new ValidationError('Transaction is not pending');
    // Points & Stock are already deducted, just mark approved
    return await prisma.transaction.update({
      where: { id: transactionId },
      data: { status: 'approved', employeeId, description: txn.description.replace('Pending Trade:', 'Approved:') },
      include: { customer: true, reward: true, inventory: true, employee: true },
    });
  }

  // Employee rejects a pending trade → refund points and stock
  async rejectRedeem(transactionId, employeeId, autoReject = false) {
    return await prisma.$transaction(async (tx) => {
      const txn = await tx.transaction.findUnique({ where: { id: transactionId }, include: { reward: true, inventory: true } });
      if (!txn) throw new NotFoundError('Transaction not found');
      if (txn.status !== 'pending') throw new ValidationError('Transaction is not pending');

      // Refund points
      await tx.customer.update({ where: { id: txn.customerId }, data: { points: { increment: Math.abs(txn.points) } } });

      // Refund stock if inventory item
      if (txn.inventoryId) {
        await tx.inventory.update({ where: { id: txn.inventoryId }, data: { stockQuantity: { increment: 1 } } });
      }

      const prefix = autoReject ? 'Expired' : 'Rejected';
      const title = txn.reward?.rewardName || txn.inventory?.name || 'Trade';
      return await tx.transaction.update({
        where: { id: transactionId },
        data: { status: 'rejected', employeeId, description: `${prefix}: ${title}` },
      });
    });
  }

  // Auto-reject old pending trades
  async revertExpiredTrades() {
    const settings = await settingsRepository.get();
    const hours = settings?.tradeExpiryHours ?? 24;
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);

    const expired = await prisma.transaction.findMany({
      where: { status: 'pending', createdAt: { lt: cutoff } }
    });

    let count = 0;
    for (const txn of expired) {
      await this.rejectRedeem(txn.id, null, true);
      count++;
    }
    return count;
  }

  // Employee directly completes a trade at the counter (no kiosk)
  async employeeRedeem(customerId, rewardId, employeeId) {
    return await prisma.$transaction(async (tx) => {
      const customer = await tx.customer.findUnique({ where: { id: customerId } });
      if (!customer) throw new NotFoundError('Customer not found');
      const reward = await tx.reward.findUnique({ where: { id: rewardId } });
      if (!reward || !reward.isActive) throw new NotFoundError('Reward not available');
      if (customer.points < reward.pointsRequired) throw new ValidationError('Insufficient points');
      const newPoints = customer.points - reward.pointsRequired;
      await tx.customer.update({ where: { id: customerId }, data: { points: newPoints } });
      return await tx.transaction.create({
        data: {
          customerId, rewardId, employeeId, type: 'redeem',
          points: -reward.pointsRequired, status: 'completed',
          description: `Employee trade: ${reward.rewardName}`,
        },
        include: { customer: true, reward: true, employee: true },
      });
    });
  }

  async manualAdjust(customerId, points, employeeId, description = 'Manual adjustment') {
    const customer = await customerRepository.findById(customerId);
    if (!customer) throw new NotFoundError('Customer not found');
    const newPoints = customer.points + points;
    if (newPoints < 0) throw new ValidationError('Points cannot go below 0');
    await customerRepository.updatePoints(customerId, newPoints);
    return await transactionRepository.create({
      customerId, employeeId: employeeId || null, type: 'manual_adjust',
      points, status: 'completed', description,
    });
  }

  async exportCsv(filters = {}) {
    return await transactionRepository.findAll(filters);
  }
}

module.exports = new TransactionService();