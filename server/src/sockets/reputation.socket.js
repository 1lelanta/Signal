import { Socket } from "socket.io";

export const registerReputationSocket = (io, socket) => {
    socket.on("joinUserRoom", (userId) => {
        socket.join(`reputation_${userId}`);
    });

    socket.on("leaveUserRoom", (userId) => {
        socket.leave(`reputation_${userId}`);
    });
};

export const emitReputationUpdate = (io, userId, reputationScore) => {
    io.to(`reputation_${userId}`).emit("reputation:update", {
        userId,
        score: reputationScore,
    });
};