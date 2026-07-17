import express from 'express';
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import {adminAnalytics, getMonglyAnalytics} from "../controllers/analytics.controller.js";
import {apiLimiter} from "../middlewares/ratelimiter.middleware.js";

const router = express.Router();

router.use(apiLimiter)

router.route('/').get(authMiddleware,adminMiddleware,adminAnalytics)
router.route("/montly-analytics").get(authMiddleware,adminMiddleware,getMonglyAnalytics)

export default router;