const inventoryService = require('../services/inventory.service');
const ApiResponse = require('../utils/response.util');

class InventoryController {
    async getAll(req, res, next) {
        try {
            const items = await inventoryService.getAllItems();
            return ApiResponse.success(res, items);
        } catch (error) { next(error); }
    }

    async getById(req, res, next) {
        try {
            const item = await inventoryService.getItemById(req.params.id);
            return ApiResponse.success(res, item);
        } catch (error) { next(error); }
    }

    async create(req, res, next) {
        try {
            const item = await inventoryService.createItem(req.body);
            return ApiResponse.success(res, item, 'Item created', 201);
        } catch (error) { next(error); }
    }

    async update(req, res, next) {
        try {
            const item = await inventoryService.updateItem(req.params.id, req.body);
            return ApiResponse.success(res, item, 'Item updated');
        } catch (error) { next(error); }
    }

    async delete(req, res, next) {
        try {
            await inventoryService.deleteItem(req.params.id);
            return ApiResponse.success(res, null, 'Item deleted');
        } catch (error) { next(error); }
    }

    async getLowStock(req, res, next) {
        try {
            const threshold = parseInt(req.query.threshold) || 5;
            const items = await inventoryService.getLowStockAlerts(threshold);
            return ApiResponse.success(res, items);
        } catch (error) { next(error); }
    }
}

module.exports = new InventoryController();
