const rewardService = require('../services/reward.service');
const ApiResponse = require('../utils/response.util');

class RewardController {
  async getAll(req, res, next) {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      const rewards = await rewardService.getAllRewards({ includeInactive });
      return ApiResponse.success(res, rewards);
    } catch (error) { next(error); }
  }

  async getById(req, res, next) {
    try {
      const reward = await rewardService.getRewardById(req.params.id);
      return ApiResponse.success(res, reward);
    } catch (error) { next(error); }
  }

  async create(req, res, next) {
    try {
      const reward = await rewardService.createReward(req.body);
      return ApiResponse.success(res, reward, 'Reward created', 201);
    } catch (error) { next(error); }
  }

  async update(req, res, next) {
    try {
      const reward = await rewardService.updateReward(req.params.id, req.body);
      return ApiResponse.success(res, reward, 'Reward updated');
    } catch (error) { next(error); }
  }

  async delete(req, res, next) {
    try {
      await rewardService.deleteReward(req.params.id);
      return ApiResponse.success(res, null, 'Reward deleted');
    } catch (error) { next(error); }
  }

  async toggleActive(req, res, next) {
    try {
      const reward = await rewardService.toggleActive(req.params.id);
      return ApiResponse.success(res, reward, `Reward ${reward.isActive ? 'activated' : 'deactivated'}`);
    } catch (error) { next(error); }
  }
}

module.exports = new RewardController();