export const registerNotificationSocket = (io,socket, onlineUsers)=>{
    socket.on("markNotificationRead",({notificationId})=>{
        socket.emit("notificationReadSuccess")
    })
}

export const emitNotification = (io, onlineUsers,userId,data)=>{
    const socketId = onlineUsers.get(userId.toString());
    if(socketId){
        io.to(socketId).emit("newNotification", data)
    }
}