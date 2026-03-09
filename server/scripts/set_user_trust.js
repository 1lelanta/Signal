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

const email = process.argv[2] || process.env.EMAIL;
const trust = process.argv[3] || process.env.TRUST || "moderator";

if(!email){
  console.error("Usage: node set_user_trust.js <email> [trustLevel]");
  process.exit(1);
}

async function run(){
  try{
    await mongoose.connect(MONGO_URI, {});
    const user = await User.findOne({ email });
    if(!user){
      console.error("User not found:", email);
      process.exit(1);
    }
    user.trustLevel = trust;
    await user.save();
    console.log(`Updated ${email} -> trustLevel=${trust}`);
    process.exit(0);
  }catch(err){
    console.error(err);
    process.exit(1);
  }
}

run();
