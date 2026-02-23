const customerService = require('../services/customer.service');
const ApiResponse = require('../utils/response.util');

class CustomerController {
  async getAll(req, res, next) {
    try {
      const { search } = req.query;
      const customers = await customerService.getAllCustomers({ search });
      return ApiResponse.success(res, customers);
    } catch (error) { next(error); }
  }

  async getById(req, res, next) {
    try {
      const customer = await customerService.getCustomerById(req.params.id);
      return ApiResponse.success(res, customer);
    } catch (error) { next(error); }
  }

  async create(req, res, next) {
    try {
      const customer = await customerService.createCustomer(req.body);
      return ApiResponse.success(res, customer, 'Customer created', 201);
    } catch (error) { next(error); }
  }

  async update(req, res, next) {
    try {
      const customer = await customerService.updateCustomer(req.params.id, req.body);
      return ApiResponse.success(res, customer, 'Customer updated');
    } catch (error) { next(error); }
  }

  async delete(req, res, next) {
    try {
      await customerService.deleteCustomer(req.params.id);
      return ApiResponse.success(res, null, 'Customer deleted');
    } catch (error) { next(error); }
  }

  async adjustPoints(req, res, next) {
    try {
      const { points, description } = req.body;
      const customer = await customerService.adjustPoints(req.params.id, points, description);
      return ApiResponse.success(res, customer, 'Points adjusted');
    } catch (error) { next(error); }
  }
}

module.exports = new CustomerController();