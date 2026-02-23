const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const customerRoutes = require('./customer.routes');
const rewardRoutes = require('./reward.routes');
const transactionRoutes = require('./transaction.routes');
const inventoryRoutes = require('./inventory.routes');
const promotionRoutes = require('./promotion.routes');
const settingsRoutes = require('./settings.routes');
const employeeRoutes = require('./employee.routes');

router.use('/auth', authRoutes);
router.use('/customers', customerRoutes);
router.use('/rewards', rewardRoutes);
router.use('/transactions', transactionRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/promotions', promotionRoutes);
router.use('/settings', settingsRoutes);
router.use('/employees', employeeRoutes);

module.exports = router;
