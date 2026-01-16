import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Middleware xác thực JWT token
 * Thêm thông tin user vào req.user nếu token hợp lệ
 */
export const authenticateToken = async (req, res, next) => {
    try {
        // Lấy token từ header Authorization
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Không có token xác thực'
            });
        }

        // Verify token
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: 'Token không hợp lệ hoặc đã hết hạn'
                });
            }

            // Lấy thông tin user từ database
            const user = await User.findById(decoded.userId).select('-password -refreshToken');
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Người dùng không tồn tại'
                });
            }

            // Thêm thông tin user vào request
            req.user = user;
            req.userId = decoded.userId;
            next();
        });

    } catch (error) {
        console.error('AuthenticateToken error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Lỗi xác thực'
        });
    }
};

/**
 * Middleware kiểm tra quyền admin
 * Phải được sử dụng sau authenticateToken
 */
export const isAdmin = (req, res, next) => {
    try {
        // Kiểm tra xem đã có authenticateToken chưa
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Vui lòng đăng nhập trước'
            });
        }

        // Kiểm tra role
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Không có quyền truy cập. Chỉ admin mới có quyền này.'
            });
        }

        next();
    } catch (error) {
        console.error('IsAdmin error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Lỗi kiểm tra quyền'
        });
    }
};

/**
 * Middleware xác thực tùy chọn (optional)
 * Nếu có token thì verify và thêm user vào req, nếu không thì tiếp tục
 * Dùng cho các route public nhưng có thể có thông tin user
 */
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return next(); // Không có token thì tiếp tục
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                return next(); // Token không hợp lệ thì tiếp tục
            }

            const user = await User.findById(decoded.userId).select('-password -refreshToken');
            if (user) {
                req.user = user;
                req.userId = decoded.userId;
            }
            next();
        });

    } catch (error) {
        // Lỗi thì vẫn tiếp tục (optional)
        next();
    }
};
