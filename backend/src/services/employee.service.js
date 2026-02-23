const bcrypt = require('bcrypt');
const employeeRepository = require('../repositories/employee.repository');
const { ValidationError, NotFoundError, UnauthorizedError } = require('../utils/error.util');

const DEFAULT_PIN = '1234';

class EmployeeService {
    async getAll() {
        const employees = await employeeRepository.findAll();
        // Never return raw PIN hashes to frontend
        return employees.map(({ pin, ...e }) => e);
    }

    async getById(id) {
        const emp = await employeeRepository.findById(id);
        if (!emp) throw new NotFoundError('Employee not found');
        const { pin, ...safe } = emp;
        return safe;
    }

    async create({ name, phone, pin }) {
        if (!name) throw new ValidationError('Name is required');
        if (!phone) throw new ValidationError('Phone is required');
        const rawPin = pin || DEFAULT_PIN;
        if (!/^\d{4,8}$/.test(rawPin)) throw new ValidationError('PIN must be 4–8 digits');
        const hashed = await bcrypt.hash(rawPin, 10);
        const emp = await employeeRepository.create({ name, phone, pin: hashed });
        const { pin: _, ...safe } = emp;
        return safe;
    }

    async update(id, { name, phone, isActive }) {
        await this.getById(id);
        const emp = await employeeRepository.update(id, { name, phone, isActive });
        const { pin, ...safe } = emp;
        return safe;
    }

    // Employee changes their own PIN (must provide current PIN)
    async changePin(id, { currentPin, newPin }) {
        if (!/^\d{4,8}$/.test(newPin)) throw new ValidationError('New PIN must be 4–8 digits');
        const emp = await employeeRepository.findById(id);
        if (!emp) throw new NotFoundError('Employee not found');
        const match = await bcrypt.compare(currentPin, emp.pin);
        if (!match) throw new UnauthorizedError('Current PIN is incorrect');
        const hashed = await bcrypt.hash(newPin, 10);
        await employeeRepository.update(id, { pin: hashed });
        return { success: true };
    }

    // Admin resets PIN to default (or a supplied reset value)
    async resetPin(id, { newPin } = {}) {
        const rawPin = newPin || DEFAULT_PIN;
        if (!/^\d{4,8}$/.test(rawPin)) throw new ValidationError('PIN must be 4–8 digits');
        const hashed = await bcrypt.hash(rawPin, 10);
        await employeeRepository.update(id, { pin: hashed });
        return { resetTo: rawPin };
    }

    async delete(id) {
        await this.getById(id);
        return employeeRepository.delete(id);
    }

    // Auth — returns employee (without pin) if credentials match
    async login(phone, pin) {
        const emp = await employeeRepository.findByPhone(phone);
        if (!emp) throw new UnauthorizedError('Invalid phone or PIN');
        if (!emp.isActive) throw new UnauthorizedError('Account is deactivated');
        const match = await bcrypt.compare(pin, emp.pin);
        if (!match) throw new UnauthorizedError('Invalid phone or PIN');
        const { pin: _, ...safe } = emp;
        return safe;
    }
}

module.exports = new EmployeeService();
