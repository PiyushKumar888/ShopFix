import express from "express";
import {createPayment,verifyPayment} from "../controllers/payment.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js";
import {apiLimiter} from "../middlewares/ratelimiter.middleware.js";
const router = express.Router();


router.use(apiLimiter)
router.route("/createOrder").post(authMiddleware,createPayment)
router.route("/verifyPayment").post(authMiddleware,verifyPayment)

export default router;