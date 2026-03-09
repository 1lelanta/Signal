import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../src/models/User.model.js";

// load env from server/.env if present, otherwise default
const envPath = path.resolve(process.cwd(), "server/.env");
dotenv.config({ path: envPath });
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
if(!MONGO_URI){
    console.error("MONGO_URI not set. Set it in server/.env or export it before running.");
    process.exit(1);
}

const demoEmail = process.env.DEMO_ADMIN_EMAIL || "admin-demo@example.com";
const demoPassword = process.env.DEMO_ADMIN_PASSWORD || "Password123!";

async function run(){
    try{
        await mongoose.connect(MONGO_URI, { });
        console.log("Connected to MongoDB");

        const existing = await User.findOne({ email: demoEmail });
        if(existing){
            console.log("User already exists:", demoEmail);
            console.log("If you want to recreate, delete the existing user first from the DB.");
            process.exit(0);
        }

        const hashed = await bcrypt.hash(demoPassword, 12);

        const user = await User.create({
            username: "admin-demo",
            email: demoEmail,
            password: hashed,
            trustLevel: "moderator",
            isVerified: true
        });

        console.log("Created demo admin user:");
        console.log("email:", demoEmail);
        console.log("password:", demoPassword);
        console.log("user id:", user._id.toString());

        process.exit(0);
    }catch(err){
        console.error("Error creating admin:", err.message || err);
        process.exit(1);
    }
}

run();
