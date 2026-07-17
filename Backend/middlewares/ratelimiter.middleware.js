import { rateLimit } from 'express-rate-limit';


export const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 60,
    standardHeaders: 'draft-7',
    legacyHeaders: false,


    handler: (req, res) => {
        return res.status(429).json({
            success: false,
            message: "Too many requests. Please slow down and try again in a minute."
        });
    }
});