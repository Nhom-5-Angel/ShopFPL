import express from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
} from '../controllers/order.controller.js';

const router = express.Router();

// Tất cả routes đều cần authentication
router.use(authenticateToken);

// Order routes
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:orderId', getOrderById);
router.put('/:orderId/status', updateOrderStatus);
router.put('/:orderId/cancel', cancelOrder);

export default router;
