const prisma = require('../config/database.config');

class InventoryRepository {
  async findAll() {
    return await prisma.inventory.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findById(id) {
    return await prisma.inventory.findUnique({ where: { id } });
  }

  async create(data) {
    return await prisma.inventory.create({ data });
  }

  async update(id, data) {
    return await prisma.inventory.update({ where: { id }, data });
  }

  async delete(id) {
    return await prisma.inventory.delete({ where: { id } });
  }

  async decrementStock(id, amount = 1) {
    return await prisma.inventory.update({
      where: { id },
      data: { stockQuantity: { decrement: amount } }
    });
  }

  async incrementStock(id, amount = 1) {
    return await prisma.inventory.update({
      where: { id },
      data: { stockQuantity: { increment: amount } }
    });
  }

  async findLowStock(threshold = 5) {
    return await prisma.inventory.findMany({
      where: { stockQuantity: { lte: threshold } },
      orderBy: { stockQuantity: 'asc' },
    });
  }
}

module.exports = new InventoryRepository();