import express from 'express';
import { authenticateToken, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Tất cả routes trong này đều cần authentication và admin role
router.use(authenticateToken);
router.use(isAdmin);

// Ví dụ: Route để lấy danh sách tất cả users (chỉ admin)
router.get('/users', async (req, res) => {
    try {
        // req.user đã được set bởi authenticateToken middleware
        // req.user.role đã được verify là 'admin' bởi isAdmin middleware
        
        const User = (await import('../models/user.model.js')).default;
        const users = await User.find({}).select('-password -refreshToken');
        
        return res.status(200).json({
            success: true,
            message: 'Lấy danh sách users thành công',
            data: users
        });
    } catch (error) {
        console.error('Get users error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống'
        });
    }
});

// Ví dụ: Route để xóa user (chỉ admin)
router.delete('/users/:id', async (req, res) => {
    try {
        const User = (await import('../models/user.model.js')).default;
        const { id } = req.params;
        
        // Không cho phép admin xóa chính mình
        if (id === req.userId.toString()) {
            return res.status(400).json({
                success: false,
                message: 'Không thể xóa chính mình'
            });
        }
        
        const user = await User.findByIdAndDelete(id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User không tồn tại'
            });
        }
        
        return res.status(200).json({
            success: true,
            message: 'Xóa user thành công'
        });
    } catch (error) {
        console.error('Delete user error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống'
        });
    }
});

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
