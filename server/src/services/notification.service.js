import Notification from "../models/Notification.model.js";
import { getIO, getOnlineUsers } from "../config/socket.js";
import { emitNotification } from "../sockets/notification.socket.js";

export const createNotificationService = async (data) => {
  const notification = await Notification.create(data);

  const io = getIO();
  const onlineUsers = getOnlineUsers();

  emitNotification(io, onlineUsers, data.recipient, notification);

  return notification;
};
