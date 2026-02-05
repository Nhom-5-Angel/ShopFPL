import express from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
} from '../controllers/cart.controller.js';

const router = express.Router();

// Tất cả routes đều cần authentication
router.use(authenticateToken);

// Cart routes
router.get('/', getCart);
router.post('/items', addToCart);
router.put('/items/:productId', updateCartItem);
router.delete('/items/:productId', removeFromCart);
router.delete('/', clearCart);

export default router;
