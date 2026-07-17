import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    item:[{
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product',
            required:true
        },
        variantId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true
        },
        variantName:{
            type:String,
            required:true
        },
        quantity:{
            type:Number,
            required:true,
            min:1
        },
        price:{
            type:Number,
            required:true
        }
    }]
})

export const Cart = mongoose.model('Cart',cartSchema);