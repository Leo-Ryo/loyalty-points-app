const prisma = require('../config/database.config');

// Convert bare date strings "YYYY-MM-DD" → Date objects for Prisma DateTime fields
function parseDates(data) {
    const out = { ...data };
    ['startDate', 'endDate'].forEach(key => {
        if (typeof out[key] === 'string' && out[key]) {
            // Append time if only a date is provided (avoids premature end of input)
            const iso = out[key].includes('T') ? out[key] : `${out[key]}T00:00:00.000Z`;
            out[key] = new Date(iso);
        }
        if (out[key] === '' || out[key] === null) delete out[key]; // omit blank dates
    });
    return out;
}

class PromotionRepository {
    async findAll({ activeOnly = false } = {}) {
        const now = new Date();
        return await prisma.promotion.findMany({
            where: activeOnly
                ? {
                    isActive: true,
                    OR: [
                        { startDate: null },
                        { startDate: { lte: now } },
                    ],
                    AND: [
                        {
                            OR: [
                                { endDate: null },
                                { endDate: { gte: now } },
                            ],
                        },
                    ],
                }
                : undefined,
            orderBy: { createdAt: 'desc' },
        });
    }

    async findById(id) {
        return await prisma.promotion.findUnique({ where: { id } });
    }

    async create(data) {
        return await prisma.promotion.create({ data: parseDates(data) });
    }

    async update(id, data) {
        return await prisma.promotion.update({ where: { id }, data: parseDates(data) });
    }

    async delete(id) {
        return await prisma.promotion.delete({ where: { id } });
    }
}

module.exports = new PromotionRepository();

