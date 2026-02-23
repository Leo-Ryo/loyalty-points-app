const express = require('express');
const router = express.Router();
const promotionController = require('../controllers/promotion.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', promotionController.getAll);                          // public (customer kiosk reads active promos)
router.get('/:id', authMiddleware, promotionController.getById);
router.post('/', authMiddleware, promotionController.create);
router.put('/:id', authMiddleware, promotionController.update);
router.delete('/:id', authMiddleware, promotionController.delete);
router.patch('/:id/toggle', authMiddleware, promotionController.toggleActive);

module.exports = router;
