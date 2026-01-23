/**
 * User Controller
 * Handles user profile operations
 */

import User from '../models/user.model.js';
import bcrypt from 'bcrypt';

/**
 * Get user profile
 * GET /api/users/profile
 */
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password -refreshToken');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User không tồn tại'
            });
        }

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
};

/**
 * Update user profile
 * PUT /api/users/profile
 */
export const updateProfile = async (req, res) => {
    try {
        const { username, phoneNumber, birthDate, address, gender, avatarUrl } = req.body;
        
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
        
        if (phoneNumber && phoneNumber !== user.phoneNumber) {
            // Kiểm tra phoneNumber đã tồn tại chưa
            const existsPhone = await User.findOne({ phoneNumber });
            if (existsPhone) {
                return res.status(409).json({
                    success: false,
                    message: 'Số điện thoại đã được sử dụng'
                });
            }
            user.phoneNumber = phoneNumber;
        }
        
        if (birthDate) user.birthDate = birthDate;
        if (address !== undefined) user.address = address;
        if (gender) user.gender = gender;
        if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
        
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
};

/**
 * Change password
 * PUT /api/users/change-password
 */
export const changePassword = async (req, res) => {
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
};
