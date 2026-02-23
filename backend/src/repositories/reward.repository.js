const prisma = require('../config/database.config');

class RewardRepository {
  async findAll({ includeInactive = false } = {}) {
    return await prisma.reward.findMany({
      where: includeInactive ? undefined : { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id) {
    return await prisma.reward.findUnique({ where: { id } });
  }

  async create(data) {
    return await prisma.reward.create({ data });
  }

  async update(id, data) {
    return await prisma.reward.update({ where: { id }, data });
  }

  async delete(id) {
    return await prisma.reward.delete({ where: { id } });
  }
}

module.exports = new RewardRepository();