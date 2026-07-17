import asyncHandler from "../utils/asyncHandler.js";
import {uploadToCloudinary} from "../config/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {AppSwiper} from "../models/AppSwiper.model.js";
import {ApiError} from "../utils/ApiError.js";

export const addImages = asyncHandler(async (req, res) => {
    const images =[]
    if (req.files   && req.files.length>5){
        throw new ApiError("send only 5 images",403);
    }
    if (!req.files || req.files.length === 0) {
        throw new ApiError("Please upload at least one image", 400);
    }
    if (req.files) {
        for (let file of req.files) {
            const response = await uploadToCloudinary(file.path);

            images.push(response.secure_url);
        }

    }
    const uploadedimages = await AppSwiper.create({
        images:images
    })
    return res.status(200).json(new ApiResponse("Images uploaded successfully",200, uploadedimages));
})

export const updateImages = asyncHandler(async (req, res) => {
    const images =[]
    if (req.files   && req.files.length>5) {
        throw new ApiError("send only 5 images",403);
    }
    if (!req.files || req.files.length === 0) {
        throw new ApiError("Please upload at least one image", 400);
    }
    if (req.files) {
        for (let file of req.files) {
            const response = await uploadToCloudinary(file.path);

            images.push(response.secure_url);

        }
    }
    const updatedImages =await AppSwiper.findOneAndUpdate(
        {},
        {$set:{images:images}},
        {new:true,
        upsert:true,
        }
    )
    return res.status(200).json(new ApiResponse("Images uploaded successfully",200, updatedImages));
})

export const getImages = asyncHandler(async (req, res) => {


    const response = await AppSwiper.find({});

    if (!response.length) {
        throw new ApiError("No images found",403);
    }
    const images = response[0];
    return res.status(200).json(new ApiResponse("Images fetched successfully",200,images));
})
