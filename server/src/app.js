import express from "express";
import corsMiddleware from "./config/cors.js";
import { errorHandler } from "./middleware/error.middleware.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import feedRoutes from "./routes/feed.routes.js";
import reputationRoutes from "./routes/reputation.routes.js";
import messageRoutes from "./routes/message.routes.js";


const app = express();

app.use(express.json());
app.use(corsMiddleware);

app.get("/", (req, res)=>{
    res.json({message: "Signal API Running "})
});


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes)
app.use("/api/comments", commentRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/reputation", reputationRoutes)
app.use("/api/messages", messageRoutes)

app.use(errorHandler);
export default app;