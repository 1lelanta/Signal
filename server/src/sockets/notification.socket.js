export const registerNotificationSocket = (io,socket, onlineUsers)=>{
    socket.on("markNotificationRead",({notificationId})=>{
        socket.emit("notificationReadSuccess")
    })
}