import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../src/models/User.model.js";

// load env from server/.env if present
const envPath = path.resolve(process.cwd(), "server/.env");
dotenv.config({ path: envPath });
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("MONGO_URI not set. Set it in server/.env or export it before running.");
  process.exit(1);
}

const ADMIN_EMAIL = process.env.DEMO_ADMIN_EMAIL || "admin2-demo@example.com";
const USER_EMAIL = process.env.DEMO_USER_EMAIL || "demo-user@example.com";
const PASSWORD = process.env.DEMO_PASSWORD || "Password123!";

async function createIfNotExists(email, username, trustLevel) {
  const existing = await User.findOne({ email });
  if (existing) {
    return { created: false, user: existing };
  }

  const hashed = await bcrypt.hash(PASSWORD, 12);
  const user = await User.create({
    username,
    email,
    password: hashed,
    trustLevel,
    isVerified: true,
  });
  return { created: true, user };
}

async function run() {
  try {
    await mongoose.connect(MONGO_URI, {});
    console.log("Connected to MongoDB");

    const adminRes = await createIfNotExists(ADMIN_EMAIL, "admin2-demo", "moderator");
    const userRes = await createIfNotExists(USER_EMAIL, "demo-user", "trusted");

    console.log("Demo accounts summary:");
    console.log(`Admin: ${ADMIN_EMAIL} / ${PASSWORD}  -> ${adminRes.created ? 'created' : 'already exists'}  id=${adminRes.user._id}`);
    console.log(`User:  ${USER_EMAIL} / ${PASSWORD}  -> ${userRes.created ? 'created' : 'already exists'}  id=${userRes.user._id}`);

    process.exit(0);
  } catch (err) {
    console.error("Error creating demo users:", err.message || err);
    process.exit(1);
  }
}

run();
