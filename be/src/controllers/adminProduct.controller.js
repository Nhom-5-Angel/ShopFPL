import Product from '../models/product.model.js';
import Category from '../models/category.model.js';

/**
 * Lấy danh sách tất cả sản phẩm (admin - bao gồm cả inactive)
 * GET /api/admin/products
 */
export const getAllProducts = async (req, res) => {
    try {
        console.log('[getAllProducts] Called with query:', req.query);
        const { categoryId, search, page = 1, limit = 20, sort = 'createdAt', order = 'desc', isActive } = req.query;

        // Xây dựng query - không filter isActive mặc định, nhưng có thể filter nếu có
        const query = {};

        if (categoryId) {
            query.categoryId = categoryId;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by isActive if provided
        if (isActive !== undefined && isActive !== '') {
            query.isActive = isActive === 'true' || isActive === true;
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
        console.error("GetAllProducts (Admin) error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống"
        });
    }
};

/**
 * Lấy chi tiết một sản phẩm (admin - bao gồm cả inactive)
 * GET /api/admin/products/:id
 */
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

        return res.status(200).json({
            success: true,
            data: product
        });

    } catch (error) {
        console.error("GetProductById (Admin) error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống"
        });
    }
};

/**
 * Tạo sản phẩm mới
 * POST /api/admin/products
 */
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, categoryId, images, stock = 0, discount = 0, isActive = true } = req.body;

        // Validate required fields
        if (!name || !price || !categoryId) {
            return res.status(400).json({
                success: false,
                message: "Tên, giá và danh mục là bắt buộc"
            });
        }

        // Validate price
        if (price < 0) {
            return res.status(400).json({
                success: false,
                message: "Giá không được âm"
            });
        }

        // Validate discount
        if (discount < 0 || discount > 100) {
            return res.status(400).json({
                success: false,
                message: "Giảm giá phải từ 0 đến 100"
            });
        }

        // Validate category exists
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Danh mục không tồn tại"
            });
        }

        // Validate stock
        if (stock < 0) {
            return res.status(400).json({
                success: false,
                message: "Số lượng tồn kho không được âm"
            });
        }

        // Tạo sản phẩm mới
        const product = await Product.create({
            name,
            description,
            price,
            categoryId,
            images: images || [],
            stock,
            discount,
            isActive,
        });

        // Populate và trả về
        await product.populate('categoryId', 'name');

        return res.status(201).json({
            success: true,
            data: product,
            message: "Đã tạo sản phẩm thành công"
        });

    } catch (error) {
        console.error("CreateProduct error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống"
        });
    }
};

/**
 * Cập nhật sản phẩm
 * PUT /api/admin/products/:id
 */
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, categoryId, images, stock, discount, isActive } = req.body;

        // Tìm sản phẩm
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Sản phẩm không tồn tại"
            });
        }

        // Validate price nếu có
        if (price !== undefined && price < 0) {
            return res.status(400).json({
                success: false,
                message: "Giá không được âm"
            });
        }

        // Validate discount nếu có
        if (discount !== undefined && (discount < 0 || discount > 100)) {
            return res.status(400).json({
                success: false,
                message: "Giảm giá phải từ 0 đến 100"
            });
        }

        // Validate category nếu có
        if (categoryId) {
            const category = await Category.findById(categoryId);
            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: "Danh mục không tồn tại"
                });
            }
        }

        // Validate stock nếu có
        if (stock !== undefined && stock < 0) {
            return res.status(400).json({
                success: false,
                message: "Số lượng tồn kho không được âm"
            });
        }

        // Cập nhật các trường
        if (name !== undefined) product.name = name;
        if (description !== undefined) product.description = description;
        if (price !== undefined) product.price = price;
        if (categoryId !== undefined) product.categoryId = categoryId;
        if (images !== undefined) product.images = images;
        if (stock !== undefined) product.stock = stock;
        if (discount !== undefined) product.discount = discount;
        if (isActive !== undefined) product.isActive = isActive;

        await product.save();

        // Populate và trả về
        await product.populate('categoryId', 'name');

        return res.status(200).json({
            success: true,
            data: product,
            message: "Đã cập nhật sản phẩm thành công"
        });

    } catch (error) {
        console.error("UpdateProduct error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống"
        });
    }
};

/**
 * Xóa sản phẩm
 * DELETE /api/admin/products/:id
 */
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Sản phẩm không tồn tại"
            });
        }

        // Xóa sản phẩm
        await Product.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Đã xóa sản phẩm thành công"
        });

    } catch (error) {
        console.error("DeleteProduct error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống"
        });
    }
};
