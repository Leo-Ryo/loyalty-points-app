const settingsService = require('../services/settings.service');
const ApiResponse = require('../utils/response.util');

class SettingsController {
    async get(req, res, next) {
        try {
            const settings = await settingsService.getSettings();
            return ApiResponse.success(res, settings);
        } catch (error) { next(error); }
    }

    async update(req, res, next) {
        try {
            const settings = await settingsService.updateSettings(req.body);
            return ApiResponse.success(res, settings, 'Settings updated');
        } catch (error) { next(error); }
    }
}

module.exports = new SettingsController();
