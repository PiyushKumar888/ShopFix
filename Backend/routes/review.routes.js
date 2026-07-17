import express from 'express';
import authMiddleware from "../middlewares/auth.middleware.js";
import {deleteReview, getReviews, giveReview, updateReview} from "../controllers/review.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import {apiLimiter} from "../middlewares/ratelimiter.middleware.js";
const router = express.Router();


router.use(apiLimiter)
router.route('/').post(authMiddleware,upload.array('reviewImages',5),giveReview).put(authMiddleware,upload.array('reviewImages',5),updateReview);
router.route('/:productId').delete(authMiddleware,deleteReview).get(authMiddleware,getReviews);

export default router;