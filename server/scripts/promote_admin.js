import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import User from "../src/models/User.model.js";

const envPath = path.resolve(process.cwd(), "server/.env");
dotenv.config({ path: envPath });
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGO || process.env.DB;
if(!MONGO_URI){
    console.error("MONGO_URI not set. Provide it as env var or in server/.env");
    process.exit(1);
}

async function run(){
    try{
        await mongoose.connect(MONGO_URI, {});
        console.log("Connected to MongoDB");

        const email = process.env.TARGET_EMAIL || "admin-demo@example.com";
        const user = await User.findOne({ email });
        if(!user){
            console.log("No user found for", email);
            process.exit(0);
        }

        user.trustLevel = "moderator";
        user.isVerified = true;
        await user.save();

        console.log("Updated user:", { id: user._id.toString(), email: user.email, trustLevel: user.trustLevel });
        process.exit(0);
    }catch(err){
        console.error("Error promoting admin:", err.message || err);
        process.exit(1);
    }
}

run();
