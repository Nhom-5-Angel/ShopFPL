import express from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { getProfile, updateProfile, changePassword } from '../controllers/user.controller.js';

const router = express.Router();

// Tất cả routes trong này đều cần authentication
router.use(authenticateToken);

// Get user profile
router.get('/profile', getProfile);

// Update user profile
router.put('/profile', updateProfile);

// Change password
router.put('/change-password', changePassword);

export default router;
