import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password:{
        type: String,
        required: true,

    },
    address:{
        type: String,

    },
    phone:{
        type:Number,

    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    refreshToken:{
        type:String,


    },
    otp:{
        type:String,
    },
    otpExpire:{
        type:Date,
    },
    avatar:{
        type:String,
        default:function (){
            return `https://api.dicebear.com/7.x/bottts/svg?seed=${this.email}`
        }

    }


},{timestamps: true});

userSchema.pre('save',async function(){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 12);
    }
})

userSchema.methods.comparePassword = function(password){
    return bcrypt.compare(password, this.password);
}
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            name:this.name,
        },
        process.env.JWT_SECRET,
        {expiresIn: '15m'}
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            name:this.name,
        },
        process.env.JWT_SECRET,
        {expiresIn: '7d'}
    )
}

export const User = mongoose.model('User', userSchema);