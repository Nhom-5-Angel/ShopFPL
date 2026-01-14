import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './configs/db.js';
import authRoute from './routes/authRoute.js';

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

app.use('/api/auth', authRoute);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server đang lắng nghe cổng ${PORT}`);
    });
});
