const promotionRepository = require('../repositories/promotion.repository');
const { ValidationError, NotFoundError } = require('../utils/error.util');

class PromotionService {
    async getAllPromotions({ activeOnly = false } = {}) {
        return await promotionRepository.findAll({ activeOnly });
    }

    async getActivePromotions() {
        return await promotionRepository.findAll({ activeOnly: true });
    }

    async getPromotionById(id) {
        const promo = await promotionRepository.findById(id);
        if (!promo) throw new NotFoundError('Promotion not found');
        return promo;
    }

    async createPromotion(data) {
        if (!data.title) throw new ValidationError('Promotion title is required');
        return await promotionRepository.create(data);
    }

    async updatePromotion(id, data) {
        await this.getPromotionById(id);
        return await promotionRepository.update(id, data);
    }

    async deletePromotion(id) {
        await this.getPromotionById(id);
        return await promotionRepository.delete(id);
    }

    async toggleActive(id) {
        const promo = await this.getPromotionById(id);
        return await promotionRepository.update(id, { isActive: !promo.isActive });
    }
}

module.exports = new PromotionService();
