import mongoose from "mongoose";
import { ENV } from "./env.js";

const connectDB = () => {
  mongoose
    .connect(ENV.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((error) => {
      console.error("Database connection error:", error.message);
      // Optional: remove process.exit(1) if you want server to keep running
    });
};

export default connectDB;
