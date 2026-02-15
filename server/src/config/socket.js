import { Server} from "socket.io";
import { ENV } from "./env.js";

let io;

export const initSocket = (server)=>{
    io = new  Server(server, {
        cors:{
            origin:ENV.CLIENT_URL,
            methods:["GET", "POST"],
        }
    });

    io.on("connection", (socket)=>{
        console.log("User connected", socket.id);
        socket.on("disconnect", ()=>{
            console.log("user disconnected", socket.id)
        })
    })

    return io;
};

export const getIO = ()=>{
    if(!io){
        throw new Error("Socket.io not initialized");
    }
    return io;
}