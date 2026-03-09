import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import User from "../src/models/User.model.js";

const envPath = path.resolve(process.cwd(), "server/.env");
dotenv.config({ path: envPath });
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
if(!MONGO_URI){
  console.error("MONGO_URI not set. Set server/.env or export MONGO_URI");
  process.exit(1);
}

const EMAIL = process.env.DEMO_USER_EMAIL || "demo-user@example.com";

async function run(){
  try{
    await mongoose.connect(MONGO_URI, {});
    const user = await User.findOne({ email: EMAIL }).select("username email trustLevel isVerified createdAt").lean();
    if(!user){
      console.log(`User not found: ${EMAIL}`);
      process.exit(0);
    }
    console.log("Found user:", user);
    process.exit(0);
  }catch(err){
    console.error(err);
    process.exit(1);
  }
}

run();
