const prisma = require('../config/database.config');

class SettingsRepository {
    async get() {
        // Singleton — always return first (or create default)
        let settings = await prisma.appSettings.findFirst();
        if (!settings) {
            settings = await prisma.appSettings.create({
                data: {
                    navigationPosition: 'left',
                    adsEnabled: true,
                    defaultWelcomePoints: 0,
                },
            });
        }
        return settings;
    }

    async update(data) {
        const settings = await this.get();
        return await prisma.appSettings.update({ where: { id: settings.id }, data });
    }
}

module.exports = new SettingsRepository();
