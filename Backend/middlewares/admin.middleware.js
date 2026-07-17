import asyncHandler from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";


const adminMiddleware = asyncHandler(async (req, res,next) => {

    if (!req.user||req.user.role!=='admin'){
        throw new ApiError("only Admin route",403)
    }
    next()
})

export default adminMiddleware;