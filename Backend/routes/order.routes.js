import express from 'express';
import authMiddleware from "../middlewares/auth.middleware.js";
import {createOrder, getAllOrders, getOrders, searchOrder, updateOrderStatus} from "../controllers/order.controller.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import {apiLimiter} from "../middlewares/ratelimiter.middleware.js";

const router = express.Router();

router.use(apiLimiter)

router.route('/').post(authMiddleware,createOrder).get(authMiddleware,getOrders)
router.route('/admin').get(authMiddleware,adminMiddleware, getAllOrders);
router.route('/:orderId/:status').put(authMiddleware,adminMiddleware,updateOrderStatus)
router.route('/search').put(authMiddleware,adminMiddleware,searchOrder);

export default router;