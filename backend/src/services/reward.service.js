const rewardRepository = require('../repositories/reward.repository');
const { ValidationError, NotFoundError } = require('../utils/error.util');

class RewardService {
  async getAllRewards({ includeInactive = false } = {}) {
    return await rewardRepository.findAll({ includeInactive });
  }

  async getRewardById(id) {
    const reward = await rewardRepository.findById(id);
    if (!reward) throw new NotFoundError('Reward not found');
    return reward;
  }

  async createReward(data) {
    const { rewardName, rewardDescription, imageUrl, pointsRequired } = data;
    if (!rewardName) throw new ValidationError('Reward name is required');
    if (!pointsRequired || pointsRequired <= 0) throw new ValidationError('Points required must be greater than 0');
    return await rewardRepository.create({ rewardName, rewardDescription, imageUrl, pointsRequired, isActive: true });
  }

  async updateReward(id, data) {
    await this.getRewardById(id);
    return await rewardRepository.update(id, data);
  }

  async deleteReward(id) {
    await this.getRewardById(id);
    return await rewardRepository.delete(id);
  }

  async toggleActive(id) {
    const reward = await this.getRewardById(id);
    return await rewardRepository.update(id, { isActive: !reward.isActive });
  }
}

module.exports = new RewardService();