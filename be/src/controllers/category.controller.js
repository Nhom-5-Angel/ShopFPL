import Category from '../models/category.model.js';

// Lấy danh sách danh mục
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true })
            .select('-__v')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: categories
        });

    } catch (error) {
        console.error("GetCategories error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống"
        });
    }
};
