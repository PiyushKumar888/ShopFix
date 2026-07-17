import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    item:[
        {
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            variantId:{
                type: mongoose.Schema.Types.ObjectId,
                required: true,
            },
            variantName:{
                type: String,
            },
            quantity:{
                type:Number,
                min:1
            },
            price:{
                type:Number,
                required:true
            }
        },

    ],
    address:{
        street:{
            type:String,
        },
        city:{
            type:String,
        },
        postalCode:{
            type:String,
        },
        state:{
            type:String,
        }
    },
    phone:{
        type:String,
        required:true
    },

    totalAmount:{
        type:Number,
        required:true
    },
    paymentStatus:{
        type:String,
        enum:[
            "Pending",
            "Completed",
            "Failed",
        ],
        default:"Pending"
    },
    status:{
        type:String,
        enum:[
            "Pending",
            "Shipped",
            "Delivered",
            "Cancelled"
        ],
        default:"Pending"
    },
    razorpayPaymentId: {
        type: String,
    },
    razorpayOrderId:{
        type:String,
    },
    ordered_Date:{
        type:Date,
        default:Date.now
    },
    delivered:{
        type:Date
    }
},{timestamps: true});

export const Order = mongoose.model("Order", orderSchema)