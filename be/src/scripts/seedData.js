import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../configs/db.js';
import Category from '../models/category.model.js';
import Product from '../models/product.model.js';

dotenv.config();

const seedCategories = [
    {
        name: 'Áo',
        description: 'Áo thời trang nam nữ',
        isActive: true,
    },
    {
        name: 'Quần',
        description: 'Quần áo thời trang',
        isActive: true,
    },
    {
        name: 'Váy',
        description: 'Váy đầm thời trang',
        isActive: true,
    },
    {
        name: 'Giày',
        description: 'Giày dép thời trang',
        isActive: true,
    },
    {
        name: 'Phụ kiện',
        description: 'Túi xách, ví, thắt lưng',
        isActive: true,
    },
];

const seedProducts = [
    // Áo
    {
        name: 'Áo Thun Nam Cổ Tròn Basic',
        description: 'Áo thun nam chất liệu cotton cao cấp, thoáng mát, co giãn tốt',
        price: 299000,
        stock: 50,
        discount: 20,
        rating: 4.5,
        reviewsCount: 128,
        sold: 450,
        images: [{
            url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop',
        }],
    },
    {
        name: 'Áo Sơ Mi Nam Dài Tay',
        description: 'Áo sơ mi nam công sở, form đứng, chất liệu vải cao cấp',
        price: 599000,
        stock: 30,
        discount: 15,
        rating: 4.7,
        reviewsCount: 89,
        sold: 320,
        images: [{
            url: 'https://images.unsplash.com/photo-1594938291221-94f18cbb708e?w=800&h=800&fit=crop',
        }],
    },
    {
        name: 'Áo Khoác Denim Nam',
        description: 'Áo khoác denim nam phong cách trẻ trung, chất liệu bền đẹp',
        price: 899000,
        stock: 25,
        discount: 30,
        rating: 4.8,
        reviewsCount: 156,
        sold: 280,
        images: [{
            url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=800&fit=crop',
        }],
    },
    {
        name: 'Áo Thun Nữ Cổ Tròn',
        description: 'Áo thun nữ form rộng, chất liệu mềm mại, nhiều màu sắc',
        price: 249000,
        stock: 60,
        discount: 25,
        rating: 4.6,
        reviewsCount: 203,
        sold: 580,
        images: [{
            url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop',
        }],
    },
    {
        name: 'Áo Blazer Nữ Công Sở',
        description: 'Áo blazer nữ thanh lịch, phù hợp công sở và dự tiệc',
        price: 1299000,
        stock: 20,
        discount: 10,
        rating: 4.9,
        reviewsCount: 95,
        sold: 180,
        images: [{
            url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=800&fit=crop',
        }],
    },
    
    // Quần
    {
        name: 'Quần Jeans Nam Ống Đứng',
        description: 'Quần jeans nam form slim fit, chất liệu denim cao cấp',
        price: 799000,
        stock: 40,
        discount: 20,
        rating: 4.7,
        reviewsCount: 234,
        sold: 520,
        images: [{
            url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop',
        }],
    },
    {
        name: 'Quần Kaki Nam Công Sở',
        description: 'Quần kaki nam form đứng, chất liệu không nhăn',
        price: 699000,
        stock: 35,
        discount: 15,
        rating: 4.6,
        reviewsCount: 167,
        sold: 410,
        images: [{
            url: 'https://images.unsplash.com/photo-1506629905607-5e0b5b5b5e0b?w=800&h=800&fit=crop',
        }],
    },
    {
        name: 'Quần Short Nam Thể Thao',
        description: 'Quần short nam thể thao, thoáng mát, co giãn tốt',
        price: 349000,
        stock: 55,
        discount: 30,
        rating: 4.5,
        reviewsCount: 189,
        sold: 650,
        images: [{
            url: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&h=800&fit=crop',
        }],
    },
    {
        name: 'Quần Jeans Nữ Ống Rộng',
        description: 'Quần jeans nữ form rộng phong cách Hàn Quốc',
        price: 749000,
        stock: 45,
        discount: 25,
        rating: 4.8,
        reviewsCount: 312,
        sold: 720,
        images: [{
            url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&h=800&fit=crop',
        }],
    },
    {
        name: 'Quần Legging Nữ Thể Thao',
        description: 'Quần legging nữ tập gym, co giãn tốt, thấm hút mồ hôi',
        price: 399000,
        stock: 70,
        discount: 20,
        rating: 4.7,
        reviewsCount: 445,
        sold: 890,
        images: [{
            url: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&h=800&fit=crop',
        }],
    },
    
    // Váy
    {
        name: 'Váy Đầm Dạo Phố Nữ',
        description: 'Váy đầm nữ dạo phố phong cách trẻ trung, nhiều màu sắc',
        price: 599000,
        stock: 30,
        discount: 30,
        rating: 4.8,
        reviewsCount: 278,
        sold: 560,
        images: [{
            url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=800&fit=crop',
        }],
    },
    {
        name: 'Váy Công Sở Nữ Thanh Lịch',
        description: 'Váy công sở nữ thanh lịch, form đẹp, chất liệu cao cấp',
        price: 899000,
        stock: 25,
        discount: 15,
        rating: 4.9,
        reviewsCount: 156,
        sold: 340,
        images: [{
            url: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&h=800&fit=crop',
        }],
    },
    {
        name: 'Váy Maxi Nữ Dự Tiệc',
        description: 'Váy maxi nữ dự tiệc sang trọng, thiết kế đẹp mắt',
        price: 1499000,
        stock: 15,
        discount: 20,
        rating: 4.7,
        reviewsCount: 89,
        sold: 120,
        images: [{
            url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=800&fit=crop',
        }],
    },
    {
        name: 'Chân Váy Xếp Ly Nữ',
        description: 'Chân váy xếp ly nữ công sở, thanh lịch, dễ phối đồ',
        price: 499000,
        stock: 40,
        discount: 25,
        rating: 4.6,
        reviewsCount: 201,
        sold: 480,
        images: [{
            url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop',
        }],
    },
    
    // Giày
    {
        name: 'Giày Sneaker Nam Thể Thao',
        description: 'Giày sneaker nam thể thao, đế cao su chống trơn trượt',
        price: 1299000,
        stock: 50,
        discount: 20,
        rating: 4.8,
        reviewsCount: 567,
        sold: 1200,
        images: [{
            url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
        }],
    },
    {
        name: 'Giày Lười Nam Da Thật',
        description: 'Giày lười nam da thật, phong cách công sở',
        price: 899000,
        stock: 35,
        discount: 15,
        rating: 4.7,
        reviewsCount: 234,
        sold: 560,
        images: [{
            url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=800&fit=crop',
        }],
    },
    {
        name: 'Giày Cao Gót Nữ',
        description: 'Giày cao gót nữ công sở, cao 7cm, đế chắc chắn',
        price: 699000,
        stock: 60,
        discount: 30,
        rating: 4.6,
        reviewsCount: 389,
        sold: 780,
        images: [{
            url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=800&fit=crop',
        }],
    },
    {
        name: 'Giày Búp Bê Nữ',
        description: 'Giày búp bê nữ dạo phố, đế bằng, đi lại thoải mái',
        price: 549000,
        stock: 70,
        discount: 25,
        rating: 4.7,
        reviewsCount: 456,
        sold: 950,
        images: [{
            url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=800&fit=crop',
        }],
    },
    {
        name: 'Giày Boot Nam',
        description: 'Giày boot nam phong cách, chống nước, bền đẹp',
        price: 1599000,
        stock: 25,
        discount: 10,
        rating: 4.9,
        reviewsCount: 178,
        sold: 320,
        images: [{
            url: 'https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=800&h=800&fit=crop',
        }],
    },
    
    // Phụ kiện
    {
        name: 'Túi Xách Nữ Da Thật',
        description: 'Túi xách nữ da thật, thiết kế sang trọng, nhiều ngăn',
        price: 1299000,
        stock: 20,
        discount: 20,
        rating: 4.8,
        reviewsCount: 234,
        sold: 450,
        images: [{
            url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&h=800&fit=crop',
        }],
    },
    {
        name: 'Ví Nam Da Thật',
        description: 'Ví nam da thật, nhiều ngăn, thiết kế tinh tế',
        price: 499000,
        stock: 45,
        discount: 15,
        rating: 4.6,
        reviewsCount: 167,
        sold: 380,
        images: [{
            url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&h=800&fit=crop',
        }],
    },
    {
        name: 'Thắt Lưng Nam Da Thật',
        description: 'Thắt lưng nam da thật, khóa kim loại cao cấp',
        price: 399000,
        stock: 60,
        discount: 25,
        rating: 4.7,
        reviewsCount: 289,
        sold: 620,
        images: [{
            url: 'https://images.unsplash.com/photo-1624378515192-6e7c0c0c0c0c?w=800&h=800&fit=crop',
        }],
    },
    {
        name: 'Túi Đeo Chéo Nữ',
        description: 'Túi đeo chéo nữ phong cách trẻ trung, nhiều màu sắc',
        price: 449000,
        stock: 55,
        discount: 30,
        rating: 4.5,
        reviewsCount: 312,
        sold: 680,
        images: [{
            url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&h=800&fit=crop',
        }],
    },
];

const seedDatabase = async () => {
    try {
        await connectDB();
        
        console.log('🗑️  Xóa dữ liệu cũ...');
        await Category.deleteMany({});
        await Product.deleteMany({});
        
        console.log('📦 Tạo categories...');
        const categories = await Category.insertMany(seedCategories);
        console.log(`✅ Đã tạo ${categories.length} categories`);
        
        // Map category names to IDs
        const categoryMap = {};
        categories.forEach(cat => {
            categoryMap[cat.name] = cat._id;
        });
        
        console.log('👕 Tạo products...');
        const productsWithCategories = seedProducts.map((product, index) => {
            let categoryId;
            
            // Phân loại sản phẩm theo tên
            if (product.name.includes('Áo')) {
                categoryId = categoryMap['Áo'];
            } else if (product.name.includes('Quần')) {
                categoryId = categoryMap['Quần'];
            } else if (product.name.includes('Váy') || product.name.includes('Chân Váy')) {
                categoryId = categoryMap['Váy'];
            } else if (product.name.includes('Giày')) {
                categoryId = categoryMap['Giày'];
            } else {
                categoryId = categoryMap['Phụ kiện'];
            }
            
            return {
                ...product,
                categoryId,
            };
        });
        
        const products = await Product.insertMany(productsWithCategories);
        console.log(`✅ Đã tạo ${products.length} products`);
        
        console.log('\n🎉 Seed data thành công!');
        console.log(`📊 Tổng số: ${categories.length} categories, ${products.length} products`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi khi seed data:', error);
        process.exit(1);
    }
};

seedDatabase();
