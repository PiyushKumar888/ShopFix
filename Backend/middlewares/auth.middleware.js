import jwt from 'jsonwebtoken';
import asyncHandler from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";


const authMiddleware = asyncHandler(async (req, res,next) => {

    const token = req.cookies?.accessToken||req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        throw new ApiError("Please Login first",401)
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded._id).select("-password -refreshToken")
        if (!user) {
            next(new ApiError("User is not found", 401))
        }
        req.user = user;
        next()
    }catch(err){
        throw new ApiError("Unauthorized",401,err);
    }

})

export default authMiddleware;