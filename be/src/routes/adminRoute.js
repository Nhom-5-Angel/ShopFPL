import express from 'express';
import { authenticateToken, isAdmin } from '../middlewares/auth.middleware.js';
import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    updateUserRole,
    resetUserPassword,
    toggleUserLock
} from '../controllers/admin.controller.js';
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../controllers/adminProduct.controller.js';
import {
    getAllCarts,
    getCartByUserId,
} from '../controllers/adminCart.controller.js';

const router = express.Router();

// Debug middleware để log requests
router.use((req, res, next) => {
    console.log(`[AdminRoute] ${req.method} ${req.path} - Before auth`);
    next();
});

// Tất cả routes trong này đều cần authentication và admin role
router.use(authenticateToken);
router.use(isAdmin);

// Debug middleware sau auth
router.use((req, res, next) => {
    console.log(`[AdminRoute] ${req.method} ${req.path} - After auth, user:`, req.user?.username);
    next();
});

// User management routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/role', updateUserRole);
router.post('/users/:id/reset-password', resetUserPassword);
router.patch('/users/:id/lock', toggleUserLock);

// Product management routes
router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Cart management routes (admin view)
router.get('/carts', getAllCarts);
router.get('/carts/:userId', getCartByUserId);

// Route test để kiểm tra middleware hoạt động
router.get('/test', (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'Bạn đã có quyền admin!',
        user: {
            id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role
        }
    });
});

export default router;
