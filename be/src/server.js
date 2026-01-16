import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './configs/db.js';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import adminRoute from './routes/adminRoute.js';

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

// Routes
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/admin', adminRoute);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server đang lắng nghe cổng ${PORT}`);
    });
});
