import express from 'express';
import {
    createProduct,
    deleteProduct,
    getProduct,
    getProductById, recommendProducts, searchProductsAI,
    updateProduct
} from "../controllers/product.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import {upload} from "../middlewares/multer.middleware.js";
import {apiLimiter} from "../middlewares/ratelimiter.middleware.js";
import {aiLimiter} from "../middlewares/airatelimiter.middleware.js";

const router = express.Router();

router.use(apiLimiter)

const variantImageUpload = upload.fields([
    { name: "variant_images_0", maxCount: 5 },
    { name: "variant_images_1", maxCount: 5 },
    { name: "variant_images_2", maxCount: 5 },
    { name: "variant_images_3", maxCount: 5 },
    { name: "variant_images_4", maxCount: 5 }
]);
router.route('/').get(getProduct).post(authMiddleware,adminMiddleware,variantImageUpload,createProduct);
router.route('/ai-search').get(aiLimiter,searchProductsAI)
router.route('/recommend/:productId').get(aiLimiter,authMiddleware,recommendProducts)
router.route('/:id').get(getProductById)
    .delete(authMiddleware,adminMiddleware,deleteProduct)
    .put(authMiddleware,adminMiddleware,variantImageUpload,updateProduct);



export default router;