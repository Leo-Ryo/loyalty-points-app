const transactionService = require('../services/transaction.service');
const ApiResponse = require('../utils/response.util');
const { Parser } = require('json2csv');

class TransactionController {
  async getAll(req, res, next) {
    try {
      const { type, customerId, employeeId, status, startDate, endDate } = req.query;
      return ApiResponse.success(res, await transactionService.getAllTransactions({ type, customerId, employeeId, status, startDate, endDate }));
    } catch (e) { next(e); }
  }

  async getByCustomer(req, res, next) {
    try { return ApiResponse.success(res, await transactionService.getCustomerTransactions(req.params.customerId)); }
    catch (e) { next(e); }
  }

  // Kiosk: customer requests trade → pending
  async requestRedeem(req, res, next) {
    try {
      const { customerId, rewardId, inventoryId } = req.body;
      const txn = await transactionService.requestRedeem(customerId, rewardId, inventoryId);
      return ApiResponse.success(res, txn, 'Trade request created — awaiting employee approval', 201);
    } catch (e) { next(e); }
  }

  // Employee: directly complete a trade at counter
  async employeeRedeem(req, res, next) {
    try {
      const { customerId, rewardId } = req.body;
      const employeeId = req.user?.id;
      const txn = await transactionService.employeeRedeem(customerId, rewardId, employeeId);
      return ApiResponse.success(res, txn, 'Trade completed', 201);
    } catch (e) { next(e); }
  }

  // Employee: approve a pending kiosk request
  async approveRedeem(req, res, next) {
    try {
      const employeeId = req.user?.id;
      const txn = await transactionService.approveRedeem(req.params.id, employeeId);
      return ApiResponse.success(res, txn, 'Trade approved');
    } catch (e) { next(e); }
  }

  // Employee: reject a pending kiosk request
  async rejectRedeem(req, res, next) {
    try {
      const employeeId = req.user?.id;
      const txn = await transactionService.rejectRedeem(req.params.id, employeeId);
      return ApiResponse.success(res, txn, 'Trade rejected');
    } catch (e) { next(e); }
  }

  // Employee: add points from bill amount
  async earnFromBill(req, res, next) {
    try {
      const { customerId, billAmount, description } = req.body;
      const employeeId = req.user?.id;
      const txn = await transactionService.earnFromBill(customerId, parseFloat(billAmount), employeeId, description);
      return ApiResponse.success(res, txn, 'Points added', 201);
    } catch (e) { next(e); }
  }

  // Admin: manual point adjustment
  async manualAdjust(req, res, next) {
    try {
      const { customerId, points, description } = req.body;
      const employeeId = req.user?.id;
      const txn = await transactionService.manualAdjust(customerId, parseInt(points), employeeId, description);
      return ApiResponse.success(res, txn, 'Points adjusted', 201);
    } catch (e) { next(e); }
  }

  // Pending redemptions list (for employee approval screen)
  async getPending(req, res, next) {
    try { return ApiResponse.success(res, await transactionService.getPendingRedemptions()); }
    catch (e) { next(e); }
  }

  async exportCsv(req, res, next) {
    try {
      const { type, customerId, startDate, endDate } = req.query;
      const transactions = await transactionService.exportCsv({ type, customerId, startDate, endDate });
      const fields = [
        { label: 'ID', value: 'id' },
        { label: 'Customer', value: 'customer.name' },
        { label: 'Employee', value: 'employee.name' },
        { label: 'Type', value: 'type' },
        { label: 'Points', value: 'points' },
        { label: 'Bill Amount', value: 'billAmount' },
        { label: 'Status', value: 'status' },
        { label: 'Description', value: 'description' },
        { label: 'Date', value: 'createdAt' },
      ];
      const csv = new Parser({ fields }).parse(transactions);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="transactions.csv"');
      return res.status(200).send(csv);
    } catch (e) { next(e); }
  }
}

module.exports = new TransactionController();