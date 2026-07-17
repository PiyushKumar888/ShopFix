import express from "express";
import {chatWithAI} from "../controllers/ai.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import {aiLimiter} from "../middlewares/airatelimiter.middleware.js";


const router = express.Router();

router.post("/chat",aiLimiter,authMiddleware,chatWithAI);

export default router;