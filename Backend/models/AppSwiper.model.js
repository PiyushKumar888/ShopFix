import mongoose from "mongoose";

const appSwiperSchema = new mongoose.Schema({
    images:[String]
},{timestamps:true})

export const AppSwiper = mongoose.model("AppSwiper", appSwiperSchema);