import express from 'express';
import authMiddleware from "../middlewares/auth.middleware.js";
import {addWishlist, getWishlist, removeWishlist} from "../controllers/wishlist.controller.js";
import {apiLimiter} from "../middlewares/ratelimiter.middleware.js";
const router = express.Router();


router.use(apiLimiter)
router.route('/').get(authMiddleware,getWishlist).post(authMiddleware, addWishlist);
router.route('/:productId').delete(authMiddleware,removeWishlist);

export default router;