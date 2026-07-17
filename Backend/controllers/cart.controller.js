import {Cart} from "../models/Cart.model.js"
import {Product} from "../models/product.model.js"
import asyncHandler from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js";
import mongoose from "mongoose";



export const addToCart = asyncHandler(async (req, res) => {
    const {productId,variantId, quantity} = req.body;
    const product = await Product.findById(productId)
    if (!product) {
        throw new ApiError("Product not found",404);
    }
    if (!quantity || quantity <= 0) {
        throw new ApiError("quantity is required",401);
    }
    if (!variantId){
        throw new ApiError("VariantId is required",403);
    }

    const targetVariant = product.variants.find((it)=>it._id.toString()===variantId)
    if (!targetVariant) {
        throw new ApiError("Variant does not exist for this product.",404);
    }
    if (quantity > targetVariant.stock) {
        throw new ApiError(`Only ${targetVariant.stock} units available in stock for this variant`, 400);
    }
    let cart = await Cart.findOne({user:req.user._id});
    if (!cart) {
       cart = await Cart.create({
            user:req.user._id,
            item:[
                {
                    product:productId,
                    variantId:variantId,
                    variantName:targetVariant.variantName,
                    price: targetVariant.price,
                    quantity,

                }
            ]
        })
    }else{
        const existingItem = cart.item.find(
            (it)=>it.product.toString()===productId  && it.variantId.toString()===variantId);
        if (!existingItem) {

            cart.item.push({
                product:productId,
                variantId:variantId,
                variantName:targetVariant.variantName,
                price:targetVariant.price,
                quantity
            })
        }else{
            if (existingItem.quantity + quantity > targetVariant.stock) {
                throw new ApiError(`Cannot add more. You already have ${existingItem.quantity} items in cart, and total stock is ${targetVariant.stock}`, 400);
            }
            existingItem.quantity += quantity;
        }
        await cart.save();
    }
    await cart.populate("item.product")
    return res.status(201).json(new ApiResponse("item successfully added to cart",200, cart))
})

export const getCart = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new ApiError("User not found please login first",403);
    }
    let cart = await Cart.findOne({user:user._id}).populate("item.product");
    if (!cart) {
       const emptyCart = { user: user._id, item: [] };
        return res.status(200).json(new ApiResponse("cart fetched successfully", 200, emptyCart));
    }

    return res.status(200).json(new ApiResponse("cart fetched successfully",200, cart));
})

export const updateCart = asyncHandler(async (req, res) => {
    const {productId,variantId,quantity} = req.body;
    const product = await Product.findById(productId)
    if (!product) {
        throw new ApiError("Product not found",404);
    }

    if (!quantity || quantity <= 0) {
        throw new ApiError("quantity is required",401);
    }

    if (!variantId) {
        throw new ApiError("VariantId is required",403);
    }

    const targetVariant = product.variants.find((it)=>it._id.toString()===variantId.toString())
    if (!targetVariant) {
        throw new ApiError("Variant does not exist for this product.",404);
    }
    if (quantity >  targetVariant.stock) {
        throw new ApiError(`Only ${targetVariant.stock} units available in stock for this variant`, 400);
    }
    const cart = await Cart.findOne({user:req.user._id})
    if (!cart) {
        throw new ApiError("Cart not found",404);
    }
    const updateditem = cart.item.find((item)=>item.product.toString() === productId && item.variantId.toString()===variantId.toString());
    if (!updateditem) {
        throw new ApiError("Product is not found in the cart",404);
    }
    updateditem.quantity = quantity;
    cart.markModified('item');
    await cart.save();
    await cart.populate("item.product")
    return res.status(200).json(new ApiResponse("item successfully updated",200, cart));

})

export const removefromCart = asyncHandler(async (req, res) => {
    const {productId,variantId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(variantId)) {
        throw new ApiError("Invalid Product ID format", 400);
    }
    const targetProductId = new mongoose.Types.ObjectId(productId);
    const targetVariantId = new mongoose.Types.ObjectId(variantId);
    const cart = await Cart.findOneAndUpdate(
                {user:req.user._id},
                {$pull: {item:{product:targetProductId, variantId:targetVariantId}}},
                {new:true}
    )
    if (!cart) {
        throw new ApiError("Cart not found", 404);
    }
    await cart.populate("item.product")

    return res.status(200).json(new ApiResponse("item successfully removed from cart",200, cart));
})