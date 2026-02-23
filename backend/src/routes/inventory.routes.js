const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

router.get('/', inventoryController.getAll);
router.get('/low-stock', authMiddleware, inventoryController.getLowStock);
router.get('/:id', inventoryController.getById);
router.post('/upload', authMiddleware, upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    res.json({ success: true, data: { imageUrl: req.file.path.replace(/\\/g, '/').split('uploads/')[1] ? 'uploads/' + req.file.path.replace(/\\/g, '/').split('uploads/')[1] : req.file.filename } });
});
router.post('/', authMiddleware, inventoryController.create);
router.put('/:id', authMiddleware, inventoryController.update);
router.delete('/:id', authMiddleware, inventoryController.delete);

module.exports = router;
