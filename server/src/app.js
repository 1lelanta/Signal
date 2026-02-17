import express from "express";
import corsMiddleware from "./config/cors.js";
import { errorHandler } from "./middleware/error.middleware.js";

import authRoutes from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import feedRoutes from "./routes/feed.routes.js";
import reputationRoutes from "./routes/reputation.routes.js";

import { errorHandler } from "./middleware/error.middleware.js";





const app = express();

app.use(express.json());
app.use(corsMiddleware);

app.get("/", (req, res)=>{
    res.json({message: "Signal API Running "})
});
app.use(errorHandler);

app.use("/api/auth", authRoutes);
app.use("/api/users",);
app.use("/api/posts")
export default app;