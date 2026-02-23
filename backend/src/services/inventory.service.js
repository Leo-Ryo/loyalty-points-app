const inventoryRepository = require('../repositories/inventory.repository');
const { ValidationError, NotFoundError } = require('../utils/error.util');

class InventoryService {
    async getAllItems() {
        return await inventoryRepository.findAll();
    }

    async getItemById(id) {
        const item = await inventoryRepository.findById(id);
        if (!item) throw new NotFoundError('Inventory item not found');
        return item;
    }

    async createItem(data) {
        const { name, stockQuantity, price } = data;
        if (!name) throw new ValidationError('Item name is required');
        if (stockQuantity !== undefined && stockQuantity < 0) throw new ValidationError('Stock quantity cannot be negative');
        return await inventoryRepository.create({ ...data, stockQuantity: stockQuantity ?? 0 });
    }

    async updateItem(id, data) {
        await this.getItemById(id);
        return await inventoryRepository.update(id, data);
    }

    async deleteItem(id) {
        await this.getItemById(id);
        return await inventoryRepository.delete(id);
    }

    async getLowStockAlerts(threshold = 5) {
        return await inventoryRepository.findLowStock(threshold);
    }
}

module.exports = new InventoryService();
