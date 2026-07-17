import asyncHandler from "../utils/asyncHandler.js";
import {Order} from "../models/order.model.js";
import {ApiResponse} from "../utils/ApiResponse.js";



export const adminAnalytics = asyncHandler(async (req, res) => {
    const stats =await Order.aggregate([
        {$match:{status:{$in:["Delivered"]}}},
        {$group: {
                _id:null,
                totalRevenue:{$sum:"$totalAmount"},
                totalOrders:{$sum:1},
                averageRevenue:{$avg:"$totalAmount"},
            }
        }
    ])
    if(stats.length===0){
        return res.status(200).json(
            new ApiResponse("No delivery data found yet", 200, {
                totalRevenue: 0,
                totalOrders: 0,
                averageRevenue: 0
            })
        );
    }
    return res.status(200).json(new ApiResponse("All stats are successfully fetched ",200,stats))
})

export const getMonglyAnalytics = asyncHandler(async (req, res) => {

    const stats = await Order.aggregate([
        {
            $match: {
                status: "Delivered"
            }
        },
        {
            $group: {
                _id: { $month: "$createdAt" },
                revenue: { $sum: "$totalAmount" },
                orders: { $sum: 1 }
            }
        },
        {
            $sort: {
                _id: 1
            }
        }
    ]);

    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];

    const monthlyStats = monthNames.map((month, index) => {
        const found = stats.find(item => item._id === index + 1);

        return {
            months: month,
            revenue: found ? found.revenue : 0,
            orders: found ? found.orders : 0
        };
    });

    return res.status(200).json(
        new ApiResponse(
            "Monthly analytics fetched successfully",
            200,
            monthlyStats
        )
    );

});