import asyncHandler from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {Review} from "../models/review.model.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {uploadToCloudinary} from "../config/cloudinary.js";
import {Product} from "../models/product.model.js";



export const giveReview = asyncHandler(async (req, res) => {
    const {productId,description,rating} = req.body;
    if (!productId || !rating || !description) {
        throw new ApiError("All fields are required in review controller",405);
    }
    const existingreview = await Review.findOne(
        {user:req.user._id, product:productId}
    );
    if (existingreview) {
        throw new ApiError("User can give only one review", 401);
    }
    const imageUrls=[]
    if (req.files){
        for (let file of req.files){
            const response = await uploadToCloudinary(file.path);
            imageUrls.push( response.secure_url)
        }


    }
    const review = await Review.create({
        user:req.user._id,
        product: productId,
        rating: Number(rating),
        description: description,
        images: imageUrls

    })
    const product = await Product.findByIdAndUpdate(
        productId,
        {$push:{reviews:review._id}},
        {new:true}
    ).populate("reviews");

    if (!product) {
        throw new ApiError("Product not found to get the review", 401);
    }

    await review.populate("product user")
    if (!review) {
        throw new ApiError("Review not found for review",400);
    }
    return res.status(200).json(new ApiResponse("Review the product successfully",200,review));
})

export const updateReview = asyncHandler(async (req, res) => {
    const {productId,description,rating} = req.body;
    if (!productId || !rating || !description) {
        throw new ApiError("All fields are required in review controller",405);
    }
    const imageUrls=[]
    if (req.files){
        for (let file of req.files){
            const response = await uploadToCloudinary(file.path);
            imageUrls.push( response.secure_url)
        }


    }
    const updatedReview = await Review.findOneAndUpdate(
        {user:req.user._id,
              product:productId,},
        {
            rating: Number(rating),
            description: description,
            images: imageUrls

        }
        ,{new:true}).populate("product")

    if (!updatedReview) {
        throw new ApiError("Review not found for review",400);

    }
    return res.status(200).json(new ApiResponse("Review updated of  the product successfully",200,updatedReview));
})

export const deleteReview = asyncHandler(async (req, res) => {
    const {productId} = req.params;
    if (!productId) {
        throw new ApiError("All fields are required in review controller",405);
    }
    const deletereview = await Review.findOneAndDelete({
        user:req.user._id,
        product:productId,
    })
    if (!deletereview) {
        throw new ApiError("Reviews is not found", 401);
    }
    const product = await Product.findByIdAndUpdate(
        productId,
        {$pull:{reviews:deletereview._id}},
        {new:true}
    ).populate("reviews");
    if (!product) {
        throw new ApiError("Product not found to get the review", 401);
    }
    if (!deletereview) {
        throw new ApiError("failed to delete the review",400);
    }
    return res.status(200).json(new ApiResponse("Review deleted successfully",200,deletereview));
})

export const getReviews = asyncHandler(async (req, res) => {
    const {productId} = req.params;
    if (!productId) {
        throw new ApiError("All fields are required in review controller",405);
    }
    const review = await Review.
    findOne({
        user:req.user._id,
        product:productId}
    ).populate("product user");

    if (!review) {
        throw new ApiError("Review not found for review",400);
    }
    return res.status(200).json(new ApiResponse("successfully get the review",200,review));
})
