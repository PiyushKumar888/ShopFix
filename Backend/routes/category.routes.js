import express from "express";
import {createCategory, deleteCategory, getAllCategory, updateCategory} from "../controllers/category.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import {apiLimiter} from "../middlewares/ratelimiter.middleware.js";
const router = express.Router();

router.use(apiLimiter)
router.route("/").get(getAllCategory).post(authMiddleware,adminMiddleware,createCategory);
router.route("/:categoryId").delete(authMiddleware,adminMiddleware,deleteCategory).put(authMiddleware,adminMiddleware,updateCategory);

export default router;