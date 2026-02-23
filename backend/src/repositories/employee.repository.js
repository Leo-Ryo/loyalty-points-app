const prisma = require('../config/database.config');

class EmployeeRepository {
    async findAll() {
        return prisma.employee.findMany({ orderBy: { createdAt: 'desc' } });
    }
    async findById(id) {
        return prisma.employee.findUnique({ where: { id } });
    }
    async findByPhone(phone) {
        return prisma.employee.findUnique({ where: { phone } });
    }
    async create(data) {
        return prisma.employee.create({ data });
    }
    async update(id, data) {
        return prisma.employee.update({ where: { id }, data });
    }
    async delete(id) {
        return prisma.employee.delete({ where: { id } });
    }
}
module.exports = new EmployeeRepository();
