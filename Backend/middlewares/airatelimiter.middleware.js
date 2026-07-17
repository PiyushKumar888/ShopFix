import {rateLimit} from "express-rate-limit";

export const aiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    limit: 20,
    standardHeaders: "draft-7",
    legacyHeaders: false,

    handler: (req, res) => {
        return res.status(429).json({
            success: false,
            message:
                "AI request limit exceeded. Please wait a minute before trying again.",
        });
    },
});