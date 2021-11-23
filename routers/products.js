// importing modules
import express from 'express';
const router = express.Router();

// fetch methods from product_controller (destructing)
import {
    getAllProducts,
    getAllProductsStatic
} from '../controllers/products';

// direct to particular method (depends on what fired from client side)
router.route('/').get(getAllProducts);
router.route('/static').get(getAllProductsStatic);

// export globally
export default router;