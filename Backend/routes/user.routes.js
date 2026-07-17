import express from "express"
import {
    register,
    login,
    getUsers,
    verifyUser,
    resendOTP,
    getMe,
    refreshUser,
    logout
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js"
import adminMiddleware from "../middlewares/admin.middleware.js"
import {authLimiter} from "../middlewares/authratelimiter.middleware.js";


const router = express.Router();



router.post('/register',authLimiter,register)
router.post('/login',login)
router.get('/getusers',authMiddleware,adminMiddleware,getUsers)
router.put('/verify/:email',authLimiter,verifyUser)
router.get('/resendOTP/:email',authLimiter,resendOTP)
router.get('/getMe',authMiddleware, getMe)
router.put('/refresh',refreshUser)
router.put('/logout',authMiddleware,logout)

export default router;