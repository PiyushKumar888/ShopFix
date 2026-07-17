import express from "express";
import {addToCart, getCart, removefromCart, updateCart} from "../controllers/cart.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import {apiLimiter} from "../middlewares/ratelimiter.middleware.js";


const router = express.Router();
router.use(apiLimiter)
router.route('/').get(authMiddleware,getCart).post(authMiddleware,addToCart).put(authMiddleware,updateCart);
router.route('/:productId/:variantId').delete(authMiddleware,removefromCart)
export default router;
