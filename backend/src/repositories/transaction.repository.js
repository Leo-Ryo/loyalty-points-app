const prisma = require('../config/database.config');

class TransactionRepository {
  async findAll({ type, customerId, employeeId, status, startDate, endDate } = {}) {
    const where = {};
    if (type) where.type = type;
    if (customerId) where.customerId = customerId;
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }
    return await prisma.transaction.findMany({
      where,
      include: { customer: true, reward: true, inventory: true, employee: { select: { id: true, name: true, phone: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id) {
    return await prisma.transaction.findUnique({
      where: { id },
      include: { customer: true, reward: true, inventory: true, employee: { select: { id: true, name: true } } },
    });
  }

  async findByCustomerId(customerId) {
    return await prisma.transaction.findMany({
      where: { customerId },
      include: { reward: true, inventory: true, employee: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data) {
    return await prisma.transaction.create({
      data,
      include: { customer: true, reward: true, inventory: true, employee: { select: { id: true, name: true } } },
    });
  }
}

module.exports = new TransactionRepository();