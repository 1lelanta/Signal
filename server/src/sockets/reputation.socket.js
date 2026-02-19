import { Socket } from "socket.io";

export const registerReputationSocket = (io, socket)=>{
    socket.on("subscribeReputation", (userId)=>{
        socket.join(`reputation_${userId}`)
    })
}

export const emitReputationUpdate = (io,userId,reputationScore)=>{
    io.to(`reputation_${userId}`).emit("reputationUpdated",{
        reputationScore
    })
}