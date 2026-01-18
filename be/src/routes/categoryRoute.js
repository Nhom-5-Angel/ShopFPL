import express from 'express';
import {
    getCategories,
} from '../controllers/category.controller.js';

const router = express.Router();

// Public routes - User có thể xem
router.get('/', getCategories);

export default router;
