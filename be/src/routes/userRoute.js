import express from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import User from '../models/user.model.js';

const router = express.Router();

// Tất cả routes trong này đều cần authentication
router.use(authenticateToken);

// Lấy thông tin profile của user hiện tại
router.get('/profile', async (req, res) => {
    try {
        // req.user đã được set bởi authenticateToken middleware
        const user = await User.findById(req.userId).select('-password -refreshToken');
        
        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get profile error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống'
        });
    }
});

// Cập nhật thông tin profile
router.put('/profile', async (req, res) => {
    try {
        const { username, phoneNumber, birthDate, address, gender } = req.body;
        
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User không tồn tại'
            });
        }
        
        // Cập nhật các trường được phép
        if (username && username !== user.username) {
            // Kiểm tra username đã tồn tại chưa
            const existsUser = await User.findOne({ username });
            if (existsUser) {
                return res.status(409).json({
                    success: false,
                    message: 'Username đã tồn tại'
                });
            }
            user.username = username;
        }
        
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (birthDate) user.birthDate = birthDate;
        if (address !== undefined) user.address = address;
        if (gender) user.gender = gender;
        
        await user.save();
        
        const updatedUser = await User.findById(req.userId).select('-password -refreshToken');
        
        return res.status(200).json({
            success: true,
            message: 'Cập nhật profile thành công',
            data: updatedUser
        });
    } catch (error) {
        console.error('Update profile error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống'
        });
    }
});

// Đổi mật khẩu
router.put('/change-password', async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập đầy đủ mật khẩu cũ và mới'
            });
        }
        
        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Mật khẩu mới phải có ít nhất 8 ký tự'
            });
        }
        
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User không tồn tại'
            });
        }
        
        // Kiểm tra mật khẩu cũ
        const bcrypt = (await import('bcrypt')).default;
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Mật khẩu cũ không chính xác'
            });
        }
        
        // Mã hóa mật khẩu mới
        const hashPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashPassword;
        await user.save();
        
        return res.status(200).json({
            success: true,
            message: 'Đổi mật khẩu thành công'
        });
    } catch (error) {
        console.error('Change password error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống'
        });
    }
});

export default router;
