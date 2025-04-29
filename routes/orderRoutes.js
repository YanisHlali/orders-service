const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/orders', authenticateToken, orderController.getUserOrders);
router.get('/orders/:id', authenticateToken, orderController.getOrderById);
router.post('/orders', authenticateToken, orderController.createOrder);
router.post('/orders/close/:id', authenticateToken, orderController.closeOrder);
router.put('/orders/:orderId/status', authenticateToken, orderController.updateOrderStatus);
router.delete('/orders/delete/:id', authenticateToken, orderController.deleteOrder);

module.exports = router;
