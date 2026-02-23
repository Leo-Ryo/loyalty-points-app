const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/admin/login', authController.adminLogin);
router.post('/employee/login', authController.employeeLogin);   // phone + PIN → JWT
router.post('/customer/lookup', authController.customerLookup);
router.post('/customer/register', authController.customerRegister);

module.exports = router;
