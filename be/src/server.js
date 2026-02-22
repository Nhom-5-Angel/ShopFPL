import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './configs/db.js';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import adminRoute from './routes/adminRoute.js';
import productRoute from './routes/productRoute.js';
import categoryRoute from './routes/categoryRoute.js';
import cartRoute from './routes/cartRoute.js';
import orderRoute from './routes/orderRoute.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
/**
 * Server port number
 * @type {number}
 * @default 3000
 * @description Gets the port from environment variable PORT, or defaults to 3000 if not set
 */
const PORT = process.env.PORT || 3000;

dotenv.config();

app.use(cors());
app.use(express.json());

// API Routes - phải đặt trước static files
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/admin', adminRoute);
app.use('/api/products', productRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/cart', cartRoute);
app.use('/api/orders', orderRoute);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve admin web static files
const adminPath = path.join(__dirname, '../public/admin');
// Cấu hình để /admin hoặc /admin/ tự load login.html
app.use('/admin', express.static(adminPath, { index: 'login.html' }));

// Root redirect to admin
app.get('/', (req, res) => {
    res.redirect('/admin');
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server đang lắng nghe cổng ${PORT}`);
        console.log(`Admin web: http://localhost:${PORT}/admin`);
    });
});
