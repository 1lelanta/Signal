import { Server } from "socket.io";
import { registerNotificationSocket } from "../sockets/notification.socket.js";
import { registerCommentSocket } from "../sockets/comment.socket.js";
import { registerReputationSocket } from "../sockets/reputation.socket.js";

let io;
const onlineUsers = new Map(); // userId -> socketId

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // change in production
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    socket.on("registerUser", (userId) => {
      onlineUsers.set(userId, socket.id);
    });

    socket.on("disconnect", () => {
      for (let [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
    });

    // Register modular sockets
    registerNotificationSocket(io, socket, onlineUsers);
    registerCommentSocket(io, socket, onlineUsers);
    registerReputationSocket(io, socket, onlineUsers);
  });
};

export const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};

export const getOnlineUsers = () => onlineUsers;
