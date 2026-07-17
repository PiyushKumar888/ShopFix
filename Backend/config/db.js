import mongoose from 'mongoose';

const connectDB = async ()=>{
    try{
        const connection = await mongoose.connect(`${process.env.MONGODB_URI}${process.env.DBNAME}`);
        console.log("Connected to database on "+connection.connection.host)
    }catch(err){
        console.log("MongoDB connection failed :"+err.message);
    }
}

export default connectDB;