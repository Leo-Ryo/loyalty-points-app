const settingsRepository = require('../repositories/settings.repository');

class SettingsService {
    async getSettings() {
        return await settingsRepository.get();
    }

    async updateSettings(data) {
        const allowed = ['navigationPosition', 'adsEnabled', 'defaultWelcomePoints', 'businessName', 'logoUrl'];
        const filtered = Object.fromEntries(Object.entries(data).filter(([k]) => allowed.includes(k)));
        return await settingsRepository.update(filtered);
    }
}

module.exports = new SettingsService();
