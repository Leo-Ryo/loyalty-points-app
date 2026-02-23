const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', settingsController.get);                               // public (frontend reads nav position on boot)
router.put('/', authMiddleware, settingsController.update);

module.exports = router;
