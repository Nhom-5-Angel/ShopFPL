import Product from '../models/product.model.js';
import Category from '../models/category.model.js';

// Lấy danh sách sản phẩm (có thể filter theo category, search, pagination)
export const getProducts = async (req, res) => {
    try {
        const { categoryId, search, page = 1, limit = 20, sort = 'createdAt', order = 'desc' } = req.query;

        // Xây dựng query
        const query = { isActive: true };

        if (categoryId) {
            query.categoryId = categoryId;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Tính toán pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const sortOrder = order === 'asc' ? 1 : -1;
        const sortObj = { [sort]: sortOrder };

        // Lấy danh sách sản phẩm
        const products = await Product.find(query)
            .populate('categoryId', 'name')
            .sort(sortObj)
            .skip(skip)
            .limit(parseInt(limit))
            .select('-__v');

        // Đếm tổng số sản phẩm
        const total = await Product.countDocuments(query);

        return res.status(200).json({
            success: true,
            data: products,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / parseInt(limit))
            }
        });

    } catch (error) {
        console.error("GetProducts error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống"
        });
    }
};

// Lấy chi tiết một sản phẩm
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id)
            .populate('categoryId', 'name description')
            .select('-__v');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Sản phẩm không tồn tại"
            });
        }

        if (!product.isActive) {
            return res.status(404).json({
                success: false,
                message: "Sản phẩm không tồn tại"
            });
        }

        return res.status(200).json({
            success: true,
            data: product
        });

    } catch (error) {
        console.error("GetProductById error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống"
        });
    }
};
