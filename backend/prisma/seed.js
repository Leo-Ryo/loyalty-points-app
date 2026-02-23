const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
    },
  });
  console.log('✅ Admin created');

  // Sample customer
  await prisma.customer.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '0812345678',
      points: 500,
    },
  });
  console.log('✅ Sample customer created');

  // Sample reward
  await prisma.reward.create({
    data: {
      rewardName: 'Free Wine Glass',
      rewardDescription: 'A complimentary wine glass of your choice.',
      pointsRequired: 200,
      isActive: true,
    },
  });
  console.log('✅ Sample reward created');

  // Sample inventory item
  await prisma.inventory.create({
    data: {
      name: 'Château Margaux 2018',
      description: 'A premier grand cru classé from Bordeaux.',
      price: 599.99,
      stockQuantity: 24,
      isPromoted: true,
    },
  });
  console.log('✅ Sample inventory item created');

  // Default app settings
  await prisma.appSettings.create({
    data: {
      navigationPosition: 'left',
      adsEnabled: true,
      defaultWelcomePoints: 50,
      businessName: 'The Wine Cellar',
    },
  });
  console.log('✅ Default app settings created');

  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });