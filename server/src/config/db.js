import mongoose from "mongoose";
import { ENV } from "./env";

const connectDB = async ()=>{
    try {
        await mongoose.connect(ENV.MONGO_URI);
        console.log("mongoDB connected");
    } catch (error) {
        console.error("database connection failed", error.message);
        process.exit(1)
        
    }
}

export default connectDB;