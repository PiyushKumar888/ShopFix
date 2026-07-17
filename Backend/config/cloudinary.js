import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import {ApiError} from "../utils/ApiError.js";

export const uploadToCloudinary = async (localpath) =>{
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    })

    if (!localpath) return null;
    try{
        const response =  await cloudinary.uploader.upload(localpath,{
            resource_type:'auto',
        })

        try{
            fs.unlinkSync(localpath)

        }catch(err){
            console.log("error deleting file")
        }

        return response
    }catch(error){
        console.log(error)
        try{
            fs.unlinkSync(localpath)
        }catch(error){
            console.log("error deleting file")
        }

        throw new ApiError("failed to upload Cloudinary", 500, error);
    }
}

