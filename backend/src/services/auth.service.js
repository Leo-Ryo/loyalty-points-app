const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const adminRepository = require('../repositories/admin.repository');
const customerRepository = require('../repositories/customer.repository');
const employeeService = require('../services/employee.service');
const config = require('../config/app.config');
const { UnauthorizedError } = require('../utils/error.util');

class AuthService {
  async adminLogin(email, password) {
    const admin = await adminRepository.findByEmail(email);
    if (!admin) throw new UnauthorizedError('Invalid credentials');
    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) throw new UnauthorizedError('Invalid credentials');
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: 'admin' },
      config.jwtSecret,
      { expiresIn: config.jwtExpiry }
    );
    return { token, admin: { id: admin.id, email: admin.email, firstName: admin.firstName, lastName: admin.lastName } };
  }

  async employeeLogin(phone, pin) {
    const employee = await employeeService.login(phone, pin);
    const token = jwt.sign(
      { id: employee.id, phone: employee.phone, role: 'employee' },
      config.jwtSecret,
      { expiresIn: '12h' }
    );
    return { token, employee };
  }

  // Customer kiosk: lookup by phone OR email — no password
  async customerLookup(identifier) {
    return await customerRepository.findByPhoneOrEmail(identifier) || null;
  }
}

module.exports = new AuthService();