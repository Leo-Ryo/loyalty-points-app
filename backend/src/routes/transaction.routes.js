const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Reads — admin/employee
router.get('/', authMiddleware, transactionController.getAll);
router.get('/export', authMiddleware, transactionController.exportCsv);
router.get('/pending', authMiddleware, transactionController.getPending);
router.get('/customer/:customerId', transactionController.getByCustomer);

// Writes
router.post('/earn-bill', authMiddleware, transactionController.earnFromBill);   // employee + bill %
router.post('/redeem', transactionController.requestRedeem);   // kiosk (no token) — creates PENDING
router.post('/redeem/employee', authMiddleware, transactionController.employeeRedeem); // employee direct trade
router.post('/adjust', authMiddleware, transactionController.manualAdjust);   // admin manual adj

// Approval
router.post('/:id/approve', authMiddleware, transactionController.approveRedeem);
router.post('/:id/reject', authMiddleware, transactionController.rejectRedeem);

module.exports = router;