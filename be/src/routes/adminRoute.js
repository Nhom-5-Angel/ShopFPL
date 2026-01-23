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

const router = express.Router();

// Tất cả routes trong này đều cần authentication và admin role
router.use(authenticateToken);
router.use(isAdmin);

// User management routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/role', updateUserRole);
router.post('/users/:id/reset-password', resetUserPassword);
router.patch('/users/:id/lock', toggleUserLock);

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
