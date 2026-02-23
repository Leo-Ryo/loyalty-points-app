const express = require('express');
const router = express.Router();
const rewardController = require('../controllers/reward.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', rewardController.getAll);                               // public (customer can browse)
router.get('/:id', rewardController.getById);
router.post('/', authMiddleware, rewardController.create);
router.put('/:id', authMiddleware, rewardController.update);
router.delete('/:id', authMiddleware, rewardController.delete);
router.patch('/:id/toggle', authMiddleware, rewardController.toggleActive);

module.exports = router;