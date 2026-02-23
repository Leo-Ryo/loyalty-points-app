const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');
const adminAuth = require('../middlewares/auth.middleware');
// Employee self-service PIN change uses employee JWT (set up in auth middleware later)
// For now all management is admin-only; changePin is separate

router.get('/', adminAuth, employeeController.getAll);
router.get('/:id', adminAuth, employeeController.getById);
router.post('/', adminAuth, employeeController.create);
router.put('/:id', adminAuth, employeeController.update);
router.post('/:id/reset-pin', adminAuth, employeeController.resetPin);       // Admin resets
router.post('/:id/change-pin', employeeController.changePin);                 // Employee self-service (no admin token needed — verifies current PIN)
router.delete('/:id', adminAuth, employeeController.delete);

module.exports = router;
