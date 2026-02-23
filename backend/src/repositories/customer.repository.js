const prisma = require('../config/database.config');

class CustomerRepository {
  async findAll({ search } = {}) {
    return await prisma.customer.findMany({
      where: search
        ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search, mode: 'insensitive' } },
          ],
        }
        : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id) {
    return await prisma.customer.findUnique({
      where: { id },
      include: {
        transactions: {
          include: { reward: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async findByEmail(email) {
    return await prisma.customer.findUnique({ where: { email } });
  }

  async findByPhone(phone) {
    return await prisma.customer.findUnique({ where: { phone } });
  }

  async findByPhoneOrEmail(identifier) {
    return await prisma.customer.findFirst({
      where: {
        OR: [{ email: identifier }, { phone: identifier }],
      },
    });
  }

  async create(data) {
    return await prisma.customer.create({ data });
  }

  async update(id, data) {
    return await prisma.customer.update({ where: { id }, data });
  }

  async delete(id) {
    return await prisma.customer.delete({ where: { id } });
  }

  async updatePoints(id, points) {
    return await prisma.customer.update({ where: { id }, data: { points } });
  }
}

module.exports = new CustomerRepository();