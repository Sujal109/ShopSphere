import express from "express";
const router = express.Router();
import {
    createProduct,
    getProductId,
    getProducts,
    updateProduct,
    deleteProduct,
    createProductReview,
    getTopProducts
} from "../controllers/productController.js";
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.get('/top', getTopProducts);
router.route('/:id')
    .get(getProductId)
    .put(protect, admin, updateProduct)
    .delete(protect, admin, deleteProduct);
router.route('/:id/reviews').post(protect, createProductReview);

export default router;
