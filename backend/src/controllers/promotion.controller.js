const promotionService = require('../services/promotion.service');
const ApiResponse = require('../utils/response.util');

class PromotionController {
    async getAll(req, res, next) {
        try {
            const activeOnly = req.query.activeOnly === 'true';
            const promotions = await promotionService.getAllPromotions({ activeOnly });
            return ApiResponse.success(res, promotions);
        } catch (error) { next(error); }
    }

    async getById(req, res, next) {
        try {
            const promo = await promotionService.getPromotionById(req.params.id);
            return ApiResponse.success(res, promo);
        } catch (error) { next(error); }
    }

    async create(req, res, next) {
        try {
            const promo = await promotionService.createPromotion(req.body);
            return ApiResponse.success(res, promo, 'Promotion created', 201);
        } catch (error) { next(error); }
    }

    async update(req, res, next) {
        try {
            const promo = await promotionService.updatePromotion(req.params.id, req.body);
            return ApiResponse.success(res, promo, 'Promotion updated');
        } catch (error) { next(error); }
    }

    async delete(req, res, next) {
        try {
            await promotionService.deletePromotion(req.params.id);
            return ApiResponse.success(res, null, 'Promotion deleted');
        } catch (error) { next(error); }
    }

    async toggleActive(req, res, next) {
        try {
            const promo = await promotionService.toggleActive(req.params.id);
            return ApiResponse.success(res, promo, `Promotion ${promo.isActive ? 'activated' : 'deactivated'}`);
        } catch (error) { next(error); }
    }
}

module.exports = new PromotionController();
