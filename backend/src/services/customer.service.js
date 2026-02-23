const customerRepository = require('../repositories/customer.repository');
const { ValidationError, NotFoundError } = require('../utils/error.util');

class CustomerService {
  async getAllCustomers({ search } = {}) {
    return await customerRepository.findAll({ search });
  }

  async getCustomerById(id) {
    const customer = await customerRepository.findById(id);
    if (!customer) throw new NotFoundError('Customer not found');
    return customer;
  }

  async createCustomer(data) {
    const { name, phone, email, points } = data;
    if (!name) throw new ValidationError('Customer name is required');
    if (!phone && !email) throw new ValidationError('Phone or email is required');
    return await customerRepository.create({ name, phone, email, points: points ?? 0 });
  }

  async updateCustomer(id, data) {
    await this.getCustomerById(id);
    const { name, phone, email } = data;
    return await customerRepository.update(id, { name, phone, email });
  }

  async deleteCustomer(id) {
    await this.getCustomerById(id);
    return await customerRepository.delete(id);
  }

  async adjustPoints(id, pointsDelta, description = 'Manual adjustment') {
    const customer = await this.getCustomerById(id);
    const newPoints = customer.points + pointsDelta;
    if (newPoints < 0) throw new ValidationError('Points cannot go below 0');
    await customerRepository.updatePoints(id, newPoints);
    return await customerRepository.findById(id);
  }
}

module.exports = new CustomerService();