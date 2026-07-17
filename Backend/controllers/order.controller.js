import {Order} from "../models/order.model.js";
import {Cart} from "../models/Cart.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import sendmail from "../utils/sendmail.js";
import {User} from "../models/user.model.js";
import {Product} from "../models/product.model.js";
import mongoose from "mongoose";

export const createOrder = asyncHandler(async (req, res) => {
    const {address,phone} = req.body;

    if (!address||!address.street||!address.city||!address.postalCode){
        throw new ApiError("Address is required",401);
    }
    if (!phone){
        throw new ApiError("Phone number is required",401);
    }
    const session = await mongoose.startSession()
    session.startTransaction()
    try{
        const cart = await Cart.findOne(
            {user:req.user._id}
        ).session(session).populate("item.product")
        if (!cart || cart?.item.length===0){
            throw new ApiError("First add items to your cart",401);
        }
        const orderItemSnapshot = []
        let subtotal=0
        for (let cartItem of cart.item){
            const productId = cartItem.product._id;
            const variantId = cartItem.variantId
            const variantName = cartItem.variantName;
            const quantity = cartItem.quantity;
            const currentVariant = cartItem.product.variants.find((it)=>it._id.toString()===variantId.toString());
            if (!currentVariant){
                throw new ApiError("Current variant is not found",401);
            }
            const price = (cartItem.price)*cartItem.quantity;
            subtotal+=price;
            const product = await Product.findOneAndUpdate(
                {_id: productId,
                    variants:{
                        $elemMatch:{
                            _id:variantId,
                            stock:{$gte:quantity}
                        }

                    }

                },
                {
                    $inc:{ "variants.$.stock": -quantity}
                },
                {
                    new:true,
                    session
                }
            )
            if (!product) {
                throw new ApiError(
                    "This product is no longer available in the requested quantity.",
                    400
                );
            }

            orderItemSnapshot.push({
                product: cartItem.product._id,
                variantId: variantId,
                variantName: variantName,
                quantity: cartItem.quantity,
                price: cartItem.price,
            })


        }

        const shippingCharges = subtotal>=2000?150:0
        const finalAmount = shippingCharges + subtotal;
        const  order = new Order({
            user: req.user._id,
            item: orderItemSnapshot,
            address,
            phone,
            totalAmount: finalAmount,
        });

        await order.save({ session });
        await session.commitTransaction()
        return res.status(201).json(new ApiResponse("Order successfully created",200,order))
    }catch(err){
        await session.abortTransaction()
        throw err
    }finally{
        await session.endSession();
    }

})

export const getOrders = asyncHandler(async (req, res) => {
    const order = await Order.find({user:req.user._id}).populate("item.product");

    return res.status(200).json(new ApiResponse("Order fetched successfully",200,order))
})

export const getAllOrders = asyncHandler(async (req, res) => {
        const {status,totalAmount} = req.query;

        const pipeline= []
        pipeline.push(
            {
                $lookup:{
                    from:"users",//its User but mongo do users
                    localField:"user",
                    foreignField:"_id",
                    as:"user",
                }
            }
        )
        const validStatus = [
            "Pending",
            "Shipped",
            "Delivered",
            "Cancelled"]

        if (status){
            if (!validStatus.includes(status)){
                throw new ApiError("Enter a appropriate status",401);
            }
            pipeline.push({$match:{status:status}})

        }
        if (totalAmount){
            const sortedDirection = parseInt(totalAmount)===1?1:-1;
            pipeline.push({$sort:{totalAmount:sortedDirection}})
        }
        const order =await Order.aggregate(pipeline)


      return res.status(200).json(new ApiResponse("Order fetched successfully",200,order))
})

export const updateOrderStatus = asyncHandler(async (req, res) => {

    const {orderId,status} = req.params
    const validStatus = [
        "Pending",
        "Shipped",
        "Delivered",
        "Cancelled"]

    if (!validStatus.includes(status)){
        throw new ApiError("Enter a appropriate status",401);
    }
    const updates = {};
    updates.status=status;
    if (status==="Delivered"){
        updates.delivered=new Date()
    }
    const order = await Order.findOneAndUpdate(
        {_id:orderId},
         updates,
        {new:true}
    )
    if (!order){
        throw new ApiError("Order not found",401);
    }
    return res.status(200).json(new ApiResponse("Order successfully updated",200,order))
})

export const searchOrder = asyncHandler(async (req, res) => {
    const {email} = req.body;

    if (!email){
        throw new ApiError("Enter a valid email",401);
    }
    const loweremail = email.toLowerCase();
    const user = await User.findOne({email:loweremail});
    if (!user){
        throw new ApiError("User not found",401);
    }
    const order = await Order.find({user:user._id}).populate("user");
    if (order.length==0){
        throw new ApiError("No Order exist for this email",401);
    }
    return res.status(200).json(new ApiResponse("Order searched successfully",200,order))
})