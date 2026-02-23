const employeeService = require('../services/employee.service');
const ApiResponse = require('../utils/response.util');

class EmployeeController {
    async getAll(req, res, next) {
        try { return ApiResponse.success(res, await employeeService.getAll()) } catch (e) { next(e) }
    }
    async getById(req, res, next) {
        try { return ApiResponse.success(res, await employeeService.getById(req.params.id)) } catch (e) { next(e) }
    }
    async create(req, res, next) {
        try { return ApiResponse.success(res, await employeeService.create(req.body), 'Employee created', 201) } catch (e) { next(e) }
    }
    async update(req, res, next) {
        try { return ApiResponse.success(res, await employeeService.update(req.params.id, req.body)) } catch (e) { next(e) }
    }
    async changePin(req, res, next) {
        try { return ApiResponse.success(res, await employeeService.changePin(req.params.id, req.body)) } catch (e) { next(e) }
    }
    async resetPin(req, res, next) {
        try { return ApiResponse.success(res, await employeeService.resetPin(req.params.id, req.body)) } catch (e) { next(e) }
    }
    async delete(req, res, next) {
        try { await employeeService.delete(req.params.id); return ApiResponse.success(res, null, 'Deleted') } catch (e) { next(e) }
    }
}
module.exports = new EmployeeController();
