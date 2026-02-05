import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

/**
 * Lấy giỏ hàng của user
 * GET /api/cart
 */
export const getCart = async (req, res) => {
    try {
        const userId = req.user._id;

        let cart = await Cart.findOne({ userId })
            .populate('items.productId', 'name price images discount stock')
            .select('-__v');

        // Nếu chưa có cart, tạo cart mới
        if (!cart) {
            cart = await Cart.create({
                userId,
                items: [],
            });
        }

        // Filter out items với product đã bị xóa hoặc inactive
        const validItems = cart.items.filter(item => {
            return item.productId && item.productId.isActive !== false;
        });

        // Update cart nếu có items không hợp lệ
        if (validItems.length !== cart.items.length) {
            cart.items = validItems;
            await cart.save();
        }

        return res.status(200).json({
            success: true,
            data: cart.items || [],
        });
    } catch (error) {
        console.error("GetCart error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống"
        });
    }
};

/**
 * Thêm sản phẩm vào giỏ hàng hoặc cập nhật số lượng
 * POST /api/cart/items
 * Body: { productId, quantity }
 */
export const addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity = 1 } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "productId là bắt buộc"
            });
        }

        // Kiểm tra product tồn tại và active
        const product = await Product.findById(productId);
        if (!product || !product.isActive) {
            return res.status(404).json({
                success: false,
                message: "Sản phẩm không tồn tại"
            });
        }

        // Kiểm tra stock
        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: `Số lượng không đủ. Chỉ còn ${product.stock} sản phẩm`
            });
        }

        // Tìm hoặc tạo cart
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = await Cart.create({
                userId,
                items: [],
            });
        }

        // Tìm item trong cart
        const existingItemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );

        if (existingItemIndex >= 0) {
            // Cập nhật quantity
            const newQuantity = cart.items[existingItemIndex].quantity + quantity;
            
            // Kiểm tra stock
            if (product.stock < newQuantity) {
                return res.status(400).json({
                    success: false,
                    message: `Số lượng không đủ. Chỉ còn ${product.stock} sản phẩm`
                });
            }

            cart.items[existingItemIndex].quantity = newQuantity;
        } else {
            // Thêm item mới
            cart.items.push({
                productId,
                quantity,
            });
        }

        await cart.save();

        // Populate và trả về
        await cart.populate('items.productId', 'name price images discount stock');
        
        return res.status(200).json({
            success: true,
            data: cart.items,
            message: "Đã thêm vào giỏ hàng"
        });
    } catch (error) {
        console.error("AddToCart error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống"
        });
    }
};

/**
 * Cập nhật số lượng sản phẩm trong giỏ hàng
 * PUT /api/cart/items/:productId
 * Body: { quantity }
 */
export const updateCartItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Số lượng phải lớn hơn 0"
            });
        }

        // Kiểm tra product tồn tại và stock
        const product = await Product.findById(productId);
        if (!product || !product.isActive) {
            return res.status(404).json({
                success: false,
                message: "Sản phẩm không tồn tại"
            });
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: `Số lượng không đủ. Chỉ còn ${product.stock} sản phẩm`
            });
        }

        // Tìm cart
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Giỏ hàng không tồn tại"
            });
        }

        // Tìm item
        const itemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );

        if (itemIndex < 0) {
            return res.status(404).json({
                success: false,
                message: "Sản phẩm không có trong giỏ hàng"
            });
        }

        // Cập nhật quantity
        cart.items[itemIndex].quantity = quantity;
        await cart.save();

        // Populate và trả về
        await cart.populate('items.productId', 'name price images discount stock');

        return res.status(200).json({
            success: true,
            data: cart.items,
            message: "Đã cập nhật số lượng"
        });
    } catch (error) {
        console.error("UpdateCartItem error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống"
        });
    }
};

/**
 * Xóa sản phẩm khỏi giỏ hàng
 * DELETE /api/cart/items/:productId
 */
export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.params;

        // Tìm cart
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Giỏ hàng không tồn tại"
            });
        }

        // Xóa item
        cart.items = cart.items.filter(
            item => item.productId.toString() !== productId
        );

        await cart.save();

        // Populate và trả về
        await cart.populate('items.productId', 'name price images discount stock');

        return res.status(200).json({
            success: true,
            data: cart.items,
            message: "Đã xóa sản phẩm khỏi giỏ hàng"
        });
    } catch (error) {
        console.error("RemoveFromCart error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống"
        });
    }
};

/**
 * Xóa toàn bộ giỏ hàng
 * DELETE /api/cart
 */
export const clearCart = async (req, res) => {
    try {
        const userId = req.user._id;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Giỏ hàng không tồn tại"
            });
        }

        cart.items = [];
        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Đã xóa toàn bộ giỏ hàng"
        });
    } catch (error) {
        console.error("ClearCart error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống"
        });
    }
};
