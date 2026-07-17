import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import userRoutes from "./routes/user.routes.js"
import productRoutes from "./routes/product.routes.js"
import orderRoutes from "./routes/order.routes.js"
import cartRoutes from "./routes/cart.routes.js";
import analyticsRoute from "./routes/analytics.routes.js"
import connectDB from './config/db.js';
import cookieParser from "cookie-parser";
import paymentRoutes from "./routes/payment.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import {apiLimiter} from "./middlewares/ratelimiter.middleware.js";
import appSwiperRoutes from "./routes/AppSwiper.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import aiRoutes from "./routes/ai.routes.js";

dotenv.config();
const app = express();

//allowing different forms of data
app.use(express.json({limit:'16kb'}));
app.use(express.urlencoded({limit:'16kb',extended:true}));
app.use(cookieParser())
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true,
}))


//connectDB and run server
const PORT = process.env.PORT || 5000;
connectDB()
.then(() => {

    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    })
}).catch((err) => {
    console.error("Error while connection to db"+err);
})
//routes
app.use('/api/user' ,userRoutes);
app.use('/api/product',productRoutes);
app.use('/api/cart',cartRoutes);
app.use('/api/order',orderRoutes);
app.use('/api/payment',paymentRoutes);
app.use('/api/analytics',analyticsRoute);
app.use('/api/review',reviewRoutes);
app.use('/api/appswiper',appSwiperRoutes);
app.use('/api/wishlist',wishlistRoutes);
app.use('/api/category',categoryRoutes);
app.use("/api/ai", aiRoutes);