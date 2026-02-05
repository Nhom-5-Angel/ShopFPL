import Order from '../models/order.model.js';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

/**
 * Tạo đơn hàng từ giỏ hàng
 * POST /api/orders
 * Body: { shippingAddress, paymentMethod, notes }
 */
export const createOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const { shippingAddress, paymentMethod = 'cod', notes } = req.body;

        // Validate shipping address
        if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address) {
            return res.status(400).json({
                success: false,
                message: "Thông tin địa chỉ giao hàng không đầy đủ"
            });
        }

        // Lấy giỏ hàng của user
        const cart = await Cart.findOne({ userId })
            .populate('items.productId', 'name price discount stock');

        if (!cart || !cart.items || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Giỏ hàng trống"
            });
        }

        // Validate và tính toán order items
        const orderItems = [];
        let total = 0;

        for (const cartItem of cart.items) {
            const product = cartItem.productId;
            
            if (!product || !product.isActive) {
                return res.status(400).json({
                    success: false,
                    message: `Sản phẩm ${product?.name || 'không xác định'} không còn hoạt động`
                });
            }

            // Kiểm tra stock
            if (product.stock < cartItem.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Sản phẩm ${product.name} chỉ còn ${product.stock} sản phẩm`
                });
            }

            // Tính giá sau discount
            const discount = product.discount || 0;
            const finalPrice = product.price * (1 - discount / 100);
            const itemTotal = finalPrice * cartItem.quantity;

            orderItems.push({
                productId: product._id,
                quantity: cartItem.quantity,
                price: product.price,
                discount: discount,
            });

            total += itemTotal;
        }

        // Tạo đơn hàng
        const order = await Order.create({
            userId,
            items: orderItems,
            total,
            shippingAddress,
            paymentMethod,
            paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
            status: 'pending',
            notes,
        });

        // Cập nhật stock và sold của sản phẩm
        for (const item of orderItems) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: {
                    stock: -item.quantity,
                    sold: item.quantity,
                }
            });
        }

        // Xóa giỏ hàng sau khi tạo đơn hàng
        cart.items = [];
        await cart.save();

        // Populate và trả về
        await order.populate('items.productId', 'name price images discount');

        return res.status(201).json({
            success: true,
            data: order,
            message: "Đã tạo đơn hàng thành công"
        });
    } catch (error) {
        console.error("CreateOrder error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống"
        });
    }
};

/**
 * Lấy danh sách đơn hàng của user
 * GET /api/orders
 * Query: status, page, limit
 */
export const getOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const { status, paymentStatus, page = 1, limit = 20 } = req.query;

        // Xây dựng query
        const query = { userId };
        if (status) {
            query.status = status;
        }
        if (paymentStatus) {
            query.paymentStatus = paymentStatus;
        }

        // Tính toán pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Lấy danh sách đơn hàng
        const orders = await Order.find(query)
            .populate('items.productId', 'name price images discount')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .select('-__v');

        // Đếm tổng số đơn hàng
        const total = await Order.countDocuments(query);

        return res.status(200).json({
            success: true,
            data: orders,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error("GetOrders error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống"
        });
    }
};

/**
 * Lấy chi tiết một đơn hàng
 * GET /api/orders/:orderId
 */
export const getOrderById = async (req, res) => {
    try {
        const userId = req.user._id;
        const { orderId } = req.params;

        const order = await Order.findOne({ _id: orderId, userId })
            .populate('items.productId', 'name price images discount stock')
            .select('-__v');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Đơn hàng không tồn tại"
            });
        }

        return res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        console.error("GetOrderById error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống"
        });
    }
};

/**
 * Cập nhật trạng thái đơn hàng (đặc biệt là đánh dấu đã thanh toán)
 * PUT /api/orders/:orderId/status
 * Body: { status, paymentStatus }
 */
export const updateOrderStatus = async (req, res) => {
    try {
        const userId = req.user._id;
        const { orderId } = req.params;
        const { status, paymentStatus } = req.body;

        const order = await Order.findOne({ _id: orderId, userId });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Đơn hàng không tồn tại"
            });
        }

        // Cập nhật status nếu có
        if (status) {
            const validStatuses = ['pending', 'confirmed', 'paid', 'shipping', 'delivered', 'cancelled'];
            if (validStatuses.includes(status)) {
                order.status = status;
            }
        }

        // Cập nhật paymentStatus nếu có
        if (paymentStatus) {
            const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
            if (validPaymentStatuses.includes(paymentStatus)) {
                order.paymentStatus = paymentStatus;
                
                // Nếu đánh dấu đã thanh toán, tự động cập nhật status thành 'paid'
                if (paymentStatus === 'paid') {
                    order.status = 'paid';
                }
            }
        }

        await order.save();

        // Populate và trả về
        await order.populate('items.productId', 'name price images discount');

        return res.status(200).json({
            success: true,
            data: order,
            message: "Đã cập nhật trạng thái đơn hàng"
        });
    } catch (error) {
        console.error("UpdateOrderStatus error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống"
        });
    }
};

/**
 * Hủy đơn hàng
 * PUT /api/orders/:orderId/cancel
 */
export const cancelOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const { orderId } = req.params;

        const order = await Order.findOne({ _id: orderId, userId })
            .populate('items.productId', 'stock');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Đơn hàng không tồn tại"
            });
        }

        // Chỉ cho phép hủy nếu đơn hàng chưa được giao hoặc đã thanh toán
        if (order.status === 'delivered') {
            return res.status(400).json({
                success: false,
                message: "Không thể hủy đơn hàng đã được giao"
            });
        }

        if (order.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: "Đơn hàng đã được hủy"
            });
        }

        // Hoàn trả stock
        for (const item of order.items) {
            const product = item.productId;
            if (product) {
                await Product.findByIdAndUpdate(product._id, {
                    $inc: {
                        stock: item.quantity,
                        sold: -item.quantity,
                    }
                });
            }
        }

        // Cập nhật trạng thái
        order.status = 'cancelled';
        if (order.paymentStatus === 'paid') {
            order.paymentStatus = 'refunded';
        }
        await order.save();

        // Populate và trả về
        await order.populate('items.productId', 'name price images discount');

        return res.status(200).json({
            success: true,
            data: order,
            message: "Đã hủy đơn hàng"
        });
    } catch (error) {
        console.error("CancelOrder error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống"
        });
    }
};
