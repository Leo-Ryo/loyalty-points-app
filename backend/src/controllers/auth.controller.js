const authService = require('../services/auth.service');
const customerService = require('../services/customer.service');
const settingsService = require('../services/settings.service');
const ApiResponse = require('../utils/response.util');

class AuthController {
  async adminLogin(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.adminLogin(email, password);
      return ApiResponse.success(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  async employeeLogin(req, res, next) {
    try {
      const { phone, pin } = req.body;
      const result = await authService.employeeLogin(phone, pin);
      return ApiResponse.success(res, result, 'Employee login successful');
    } catch (error) { next(error); }
  }

  async customerLookup(req, res, next) {
    try {
      const { identifier } = req.body; // phone OR email
      const customer = await authService.customerLookup(identifier);
      // Always return 200 — frontend checks if data is null to show "not found"
      return ApiResponse.success(res, customer ?? null, customer ? 'Customer found' : 'Customer not found');
    } catch (error) {
      next(error);
    }
  }
  async customerRegister(req, res, next) {
    try {
      const { name, phone, email } = req.body;
      // Apply welcome points from settings
      const settings = await settingsService.getSettings();
      const welcomePoints = settings?.defaultWelcomePoints ?? 0;
      const customer = await customerService.createCustomer({ name, phone, email, points: welcomePoints });
      return ApiResponse.success(res, customer, 'Customer registered', 201);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
