import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
    sku:{
        type: String,
    },
    price:{
        type: Number,
        required: true,
    },
    stock:{
        type: Number,
        min:[0,'stock can never be -ve']
    },
    variantName:{
        type: String,
    },
    images:[String]
})


const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    specification: {
        type:Map,
        of:String,

    },
    reviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    hasVariants:{
        type: Boolean,
        default: false
    },
    variants:[variantSchema],
    product_embedding:{
        type:[Number],
        required:false
    }
},{timestamps: true})


export const Product = mongoose.model("Product", ProductSchema)