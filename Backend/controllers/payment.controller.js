import {razorpayInstance} from '../config/razorpay.js'
import crypto from 'crypto'
import asyncHandler from "../utils/asyncHandler.js";
import {Order} from "../models/order.model.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {Cart} from "../models/Cart.model.js";
import sendMail from "../utils/sendMail.js";
import {User} from "../models/user.model.js";

export const createPayment = asyncHandler(async (req, res) => {
    const {orderId} = req.body

    const order = await Order.findById(orderId)

    if (!order) {
        throw new ApiError("create order first from ShopFix",403);
    }
    const parsedAmount = Number(order.totalAmount);
    if (!parsedAmount || isNaN(parsedAmount)) {
        throw new ApiError(`Invalid order total amount found in database: ${order.totalAmount}`, 400);
    }
     const options = {
         amount: Math.round(parsedAmount * 100),
         currency:"INR",
         receipt:`rec_${orderId}`,
     }
    let razorpayOrder;
    try {

        razorpayOrder = await razorpayInstance.orders.create(options);
    } catch (razorpayError) {

        throw new ApiError(razorpayError.description || "Razorpay cloud engine rejected order generation.", 400);
    }


    if (!razorpayOrder) {
        throw new ApiError("failed to generate payment order",401);
    }
    order.razorpayOrderId = razorpayOrder.id
    await order.save();
    return res.status(201).json(new ApiResponse("Razorpay order created successfully", 200, {
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        originalOrderId: order._id // MongoDB Order ID
    }))
})

export const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature,originalOrderId } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(sign.toString())
        .digest('hex');
    if (razorpay_signature === expectedSign) {

        const order = await Order.findById(originalOrderId);
        if (!order) {
            throw new ApiError("Order record not found in system database ledger", 404);
        }
        order.paymentStatus = "Completed"
        order.razorpayPaymentId = razorpay_payment_id
        await order.save()

        await Cart.findOneAndUpdate(
            {user:req.user._id},
            {$set:{item:[]}}
        )
        const user = await User.findById(req.user._id);
        const message = `
            <h2>Order Placed Successfully 🎉</h2> 
            <p>Hello ${user.name}, your payment was secured cleanly.</p> 
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Total Amount Paid:</strong> ₹${order.totalAmount}</p>
        `;
        await sendMail(user.email, "Order placed successfully!", "Completed", message);
        res.status(200).json(new ApiResponse("Payment verified successfully", 200));
    } else {

        await Order.findByIdAndUpdate(originalOrderId, { paymentStatus: "Failed" });
        throw new ApiError("Invalid cryptographic payment signature verification failed", 401);
    }

})