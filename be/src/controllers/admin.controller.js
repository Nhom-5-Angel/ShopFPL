/**
 * Admin Controller
 * Handles admin operations for user management
 */

import User from '../models/user.model.js';
import bcrypt from 'bcrypt';

/**
 * Get all users with pagination and filters
 * GET /api/admin/users
 * Query params: page, limit, search, role, sortBy, sortOrder
 */
export const getAllUsers = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            role = '',
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build query
        const query = {};

        // Search filter
        if (search) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phoneNumber: { $regex: search, $options: 'i' } }
            ];
        }

        // Role filter
        if (role) {
            query.role = role;
        }

        // Sort options
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get users (include isLocked field)
        const users = await User.find(query)
            .select('-password -refreshToken')
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count
        const total = await User.countDocuments(query);

        return res.status(200).json({
            success: true,
            data: {
                data: users,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    totalPages: Math.ceil(total / parseInt(limit))
                }
            }
        });
    } catch (error) {
        console.error('Get all users error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống'
        });
    }
};

/**
 * Get user by ID
 * GET /api/admin/users/:id
 */
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).select('-password -refreshToken');
        // Note: isLocked field is included by default

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
        console.error('Get user by ID error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống'
        });
    }
};

/**
 * Update user (admin)
 * PUT /api/admin/users/:id
 */
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, phoneNumber, role, birthDate, address, gender, avatarUrl } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User không tồn tại'
            });
        }

        // Không cho phép admin cập nhật chính mình thành user
        if (id === req.user._id.toString() && role === 'user') {
            return res.status(400).json({
                success: false,
                message: 'Không thể tự hạ quyền của chính mình'
            });
        }

        // Update fields
        if (username && username !== user.username) {
            const existsUser = await User.findOne({ username });
            if (existsUser) {
                return res.status(409).json({
                    success: false,
                    message: 'Username đã tồn tại'
                });
            }
            user.username = username;
        }

        if (email && email !== user.email) {
            const existsEmail = await User.findOne({ email });
            if (existsEmail) {
                return res.status(409).json({
                    success: false,
                    message: 'Email đã được sử dụng'
                });
            }
            user.email = email;
        }

        if (phoneNumber && phoneNumber !== user.phoneNumber) {
            const existsPhone = await User.findOne({ phoneNumber });
            if (existsPhone) {
                return res.status(409).json({
                    success: false,
                    message: 'Số điện thoại đã được sử dụng'
                });
            }
            user.phoneNumber = phoneNumber;
        }

        if (role && ['user', 'admin'].includes(role)) {
            user.role = role;
        }

        if (birthDate !== undefined) user.birthDate = birthDate;
        if (address !== undefined) user.address = address;
        if (gender) user.gender = gender;
        if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

        await user.save();

        const updatedUser = await User.findById(id).select('-password -refreshToken');

        return res.status(200).json({
            success: true,
            message: 'Cập nhật user thành công',
            data: updatedUser
        });
    } catch (error) {
        console.error('Update user error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống'
        });
    }
};

/**
 * Delete user
 * DELETE /api/admin/users/:id
 */
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Không cho phép admin xóa chính mình
        if (id === req.user._id.toString()) {
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
};

/**
 * Update user role
 * PATCH /api/admin/users/:id/role
 */
export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!role || !['user', 'admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Role không hợp lệ'
            });
        }

        // Không cho phép admin tự hạ quyền của chính mình
        if (id === req.user._id.toString() && role === 'user') {
            return res.status(400).json({
                success: false,
                message: 'Không thể tự hạ quyền của chính mình'
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User không tồn tại'
            });
        }

        user.role = role;
        await user.save();

        const updatedUser = await User.findById(id).select('-password -refreshToken');

        return res.status(200).json({
            success: true,
            message: 'Cập nhật role thành công',
            data: updatedUser
        });
    } catch (error) {
        console.error('Update user role error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống'
        });
    }
};

/**
 * Reset user password (admin)
 * POST /api/admin/users/:id/reset-password
 */
export const resetUserPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;

        if (!newPassword || newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Mật khẩu mới phải có ít nhất 8 ký tự'
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User không tồn tại'
            });
        }

        const hashPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Đặt lại mật khẩu thành công'
        });
    } catch (error) {
        console.error('Reset user password error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống'
        });
    }
};

/**
 * Toggle user lock status (khóa/mở khóa tài khoản)
 * PATCH /api/admin/users/:id/lock
 */
export const toggleUserLock = async (req, res) => {
    try {
        const { id } = req.params;
        const { isLocked } = req.body;

        // Không cho phép admin khóa chính mình
        if (id === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'Không thể khóa chính mình'
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User không tồn tại'
            });
        }

        if (typeof isLocked !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'Giá trị isLocked không hợp lệ'
            });
        }

        user.isLocked = isLocked;
        await user.save();

        const updatedUser = await User.findById(id).select('-password -refreshToken');

        return res.status(200).json({
            success: true,
            message: isLocked ? 'Khóa tài khoản thành công' : 'Mở khóa tài khoản thành công',
            data: updatedUser
        });
    } catch (error) {
        console.error('Toggle user lock error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống'
        });
    }
};
