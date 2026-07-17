import asyncHandler from "../utils/asyncHandler.js";
import {Wishlist} from "../models/wishlist.model.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js";


export const getWishlist = asyncHandler(async (req, res) => {
    const wishlist =await Wishlist.findOne({user:req.user._id})
        .populate("user products")
    if (!wishlist) {

        return res.status(200).json(new ApiResponse(200, { products: [] }, "Wishlist is empty"));
    }
    return res.status(200).json(new ApiResponse("wishlist fetched successfully",200,wishlist));
})

export const addWishlist = asyncHandler(async (req, res) => {
    const {productId} = req.body;
    if (!productId) {
        throw new ApiError("please provide a product id.");
    }
    const addedProduct = await Wishlist.findOneAndUpdate(
        {user:req.user._id,},
      {$addToSet:{products:productId}},
     {new:true,upsert:true}
    ).populate("user products")

    return res.status(200).json(new ApiResponse("wishlist added successfully",200,addedProduct));

})

export const removeWishlist = asyncHandler(async (req, res) => {
    const {productId} = req.params;
    if (!productId) {
        throw new ApiError("please provide the product id")
    }
    const removedProduct = await Wishlist.findOneAndUpdate(
        {user:req.user._id,},
        {$pull:{products:productId}},
    {new : true}
    ) .populate("user products");
    return res.status(200).json(new ApiResponse("wishlist removed successfully",200,removedProduct));
})