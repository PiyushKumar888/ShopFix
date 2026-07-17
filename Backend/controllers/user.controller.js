import {User} from "../models/user.model.js"
import asyncHandler from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js";
import sendmail from "../utils/sendmail.js";
import jwt from "jsonwebtoken";

export const register = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body;
    if (!name || !email || !password ) {
        throw new ApiError( "Please enter valid fields",400);
    }
    const loweremail = email.toLowerCase();
    const user = await User.findOne({email:loweremail});
    if (user) {
        throw new ApiError("User already exists",400);
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpExpire = Date.now()+10*60*1000
    const userData = await User.create({
        name:name,
        email:loweremail,
        password:password,
        otp:otp,
        otpExpire:otpExpire
    })
    const registeredUser = await User.findById(userData._id).select("-password")

    const html = `
    <h1>Welcome to ShopFix</h1>

    <p>Hello ${name},</p>

    <p>Thank you for creating your account with ShopFix.</p>

    <p>Your registered email is: <b>${email}</b></p>

    <p>Your OTP is:</p>

    <h2>${otp}</h2>

    <p>This OTP will expire in 10 minutes.</p>

    <p>If you did not create this account, please ignore this email.</p>

    <br/>

    <p>Thanks,<br/>Team ShopFix</p>
`;

    if (userData){
        await sendmail(email, "Welcome message to new user","Welcome",html)
    }

    return res.status(200)
        .json(new ApiResponse("User registered successfully",200,registeredUser))
})

export const login = asyncHandler(async (req, res) => {

    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError("Please enter valid fields",400);
    }
    const loweremail = email.toLowerCase();
    const user = await User.findOne({email:loweremail});
    if (!user) {
        throw new ApiError("User doesn't exist please register first",400);
    }
    const checkpassword = await user.comparePassword(password);
    if (!checkpassword) {
        throw new ApiError("Password or email is incorrect",400)
    }
    if (!user.isVerified){
        throw new ApiError("Please verify your account",400)
    }
    const registeredUser = await User.findById(user._id).select("-password");
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    user.refreshToken = refreshToken;
    await user.save();

    const cookieOptions={
        httpOnly: true,
        sameSite: "none",
        maxAge:15*60*1000,
        secure:process.env.NODE_ENV==="production",

    }
    const refreshcookieOptions={
        httpOnly: true,
        sameSite: "none",
        maxAge:7*24*60*60*1000,
        secure:process.env.NODE_ENV==="production",

    }
    return res.status(200)
        .cookie("accessToken", accessToken,cookieOptions)
        .cookie("refreshToken", refreshToken,refreshcookieOptions)
        .json(new ApiResponse("User LoggedIn Successfully",200,registeredUser))
})

export const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select("-password");
    if (users.length===0) {
        throw new ApiError("Failed to find all the users",400);
    }
    return res.status(200).json(new ApiResponse("All users found successfully",200,users));
})

export const verifyUser = asyncHandler(async (req, res) => {
     const { otp } = req.body
     const {email}= req.params
     const loweremail = email.toLowerCase();
     const user = await User.findOne({email:loweremail})
     if (!user) {
         throw new ApiError("User doesn't exist",400);
     }
     if (user.otp!==otp){
         throw new ApiError("Please enter valid OTP",400);
     }
     if (user.otpExpire<Date.now()) {
         throw new ApiError("OTP expired",400);
     }
     user.isVerified = true;
     user.otp=undefined;
     user.otpExpire=undefined;
     await user.save();
     return res.status(200).json(new ApiResponse("user is verified please login now",200))
})
export const resendOTP = asyncHandler(async (req, res) => {
    const {email} = req.params
    const loweremail = email.toLowerCase();
    const user = await User.findOne({email:loweremail})

    if (!user) {
        throw new ApiError("User doesn't exist",400);
    }

    if (user.isVerified===true){
        throw new ApiError("User is already Verified",400);
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpExpire = Date.now()+10*60*1000
    const message = `
    Welcome to ShopFix, ${loweremail}!
    Your verification OTP is ${otp}. This OTP will expire in 5 minutes.
    `;
    user.otp=otp;
    user.otpExpire = otpExpire;
    await user.save()
    await sendmail(loweremail,"OTP Resend :",message)
    return res.status(200).json(new ApiResponse("OTP Resend :",200))


})

export const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
        throw new ApiError("User doesn't exist",400);
    }
    return res.status(200).json(new ApiResponse("User is authenticated",200,user))
})

export const refreshUser  = asyncHandler(async (req, res) => {
        const refreshToken = req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!refreshToken) {
             throw new ApiError("Refresh token is missing",400)
        }

        let decoded;
         try {
            decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
         } catch (error) {
            throw new ApiError("Refresh token is invalid or expired", 401);
        }

        const user = await User.findById(decoded._id).select("-password");

        if (!user) {
                throw new ApiError("User doesn't exist",400);
            }
        if (refreshToken!==user.refreshToken) {
            throw new ApiError("User refreshToken doesn't match to db token",400);
        }

        const accessToken = user.generateAccessToken();
        const newrefreshToken = user.generateRefreshToken();
        user.refreshToken = newrefreshToken;
        await user.save();

        const safeUser = await User.findById(user._id).select("-password");
        const cookieOptions={
            httpOnly: true,
            sameSite: "none",
            maxAge:15*60*1000,
            secure:process.env.NODE_ENV==="production",
        }
    const refreshcookieOptions={
        httpOnly: true,
        sameSite: "none",
        maxAge:7*24*60*60*1000,
        secure:process.env.NODE_ENV==="production",
    }
        return res.status(200)
            .cookie("accessToken", accessToken,cookieOptions)
            .cookie("refreshToken", newrefreshToken,refreshcookieOptions)
            .json(new ApiResponse("User refreshed successfully",200,safeUser))

})

export const logout = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!refreshToken) {
        throw new ApiError("Refresh token is missing",400)
    }
    const user = await User.findById(req.user._id).select("-password");
    const cookieOptions={
        httpOnly: true,
        sameSite: "none",
        secure:process.env.NODE_ENV === "production",
        maxAge:15*60*1000

    }
    const refreshcookieOptions={
        httpOnly: true,
        sameSite: "none",
        secure:process.env.NODE_ENV === "production",
        maxAge:7*24*60*60*1000

    }
    user.refreshToken = null;
    await user.save()
    return res.status(200)
        .clearCookie("accessToken",cookieOptions)
        .clearCookie("refreshToken",refreshcookieOptions)
        .json(new ApiResponse("Logged out user successful",200))
})