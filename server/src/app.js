import express from "express";
import corsMiddleware from "./config/cors.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());
app.use(corsMiddleware);

app.get("/", (req, res)=>{
    res.json({message: "Signal API Running "})
});
app.use(errorHandler);
export default app;