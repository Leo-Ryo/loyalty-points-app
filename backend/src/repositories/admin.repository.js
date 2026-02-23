const prisma = require('../config/database.config');

class AdminRepository {
  async findByEmail(email) {
    return await prisma.admin.findUnique({
      where: { email },
    });
  }

  async findById(id) {
    return await prisma.admin.findUnique({
      where: { id },
    });
  }

  async create(data) {
    return await prisma.admin.create({
      data,
    });
  }
}

module.exports = new AdminRepository();