import express from "express";
import {addImages, getImages, updateImages} from "../controllers/AppSwiper.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import {upload} from "../middlewares/multer.middleware.js";
import {apiLimiter} from "../middlewares/ratelimiter.middleware.js";

const router = express.Router();
router.use(apiLimiter)
router
    .post("/",authMiddleware,adminMiddleware,upload.array("swiper",5),addImages)
    .put("/",authMiddleware,adminMiddleware,upload.array("swiper",5),updateImages)
    .get("/",getImages)
export default router;