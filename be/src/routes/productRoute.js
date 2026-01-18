import express from 'express';
import {
    getProducts,
    getProductById,
} from '../controllers/product.controller.js';

const router = express.Router();

// Public routes - User có thể xem
router.get('/', getProducts);
router.get('/:id', getProductById);

export default router;
