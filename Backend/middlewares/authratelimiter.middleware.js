import {rateLimit} from "express-rate-limit";

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false,

    handler: (req, res) => {
        return res.status(429).json({
            success: false,
            message:
                "Too many authentication attempts. Please try again after 15 minutes.",
        });
    },
});