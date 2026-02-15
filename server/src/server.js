import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import { ENV } from "./config/env.js";
import { initSocket } from "./config/socket.js";

connectDB();

const server = http.createServer(app);
initSocket(server);

server.listen(ENV.PORT, ()=>{
    console.log(`server running on port ${ENV.PORT}`);
});