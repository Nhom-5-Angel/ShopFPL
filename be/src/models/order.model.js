import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
}, { _id: false });

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [orderItemSchema],
    total: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'paid', 'shipping', 'delivered', 'cancelled'],
        default: 'pending',
    },
    shippingAddress: {
        fullName: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
        },
        district: {
            type: String,
        },
        ward: {
            type: String,
        },
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'bank_transfer', 'credit_card', 'e_wallet'],
        default: 'cod',
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending',
    },
    notes: {
        type: String,
    },
}, { timestamps: true });

// Index để tìm kiếm nhanh
orderSchema.index({ userId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model("Order", orderSchema);

export default Order;
