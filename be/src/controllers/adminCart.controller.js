import Cart from '../models/cart.model.js';
import User from '../models/user.model.js';

/**
 * Lấy tất cả giỏ hàng của khách hàng (admin)
 * GET /api/admin/carts
 */
export const getAllCarts = async (req, res) => {
    try {
        // Lấy tất cả carts với thông tin user và products
        const carts = await Cart.find({})
            .populate('userId', 'username email phoneNumber')
            .populate('items.productId', 'name price images discount stock')
            .select('-__v')
            .sort({ updatedAt: -1 });

        return res.status(200).json({
            success: true,
            data: carts,
        });
    } catch (error) {
        console.error("GetAllCarts (Admin) error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống"
        });
    }
};

/**
 * Lấy giỏ hàng của một user cụ thể (admin)
 * GET /api/admin/carts/:userId
 */
export const getCartByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const cart = await Cart.findOne({ userId })
            .populate('userId', 'username email phoneNumber')
            .populate('items.productId', 'name price images discount stock')
            .select('-__v');

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Giỏ hàng không tồn tại"
            });
        }

        return res.status(200).json({
            success: true,
            data: cart,
        });
    } catch (error) {
        console.error("GetCartByUserId (Admin) error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống"
        });
    }
};
