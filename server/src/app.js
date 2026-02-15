import express from "express";
import corsMiddleware from "./config/cors.js";


const app = express();

app.use(express.json());
app.use(corsMiddleware);

app.get("/", (req, res)=>{
    res.json({message: "Signal API Running "})
});

export default app;