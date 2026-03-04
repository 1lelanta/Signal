import Message from "../models/Message.model.js";
import User from "../models/User.model.js";
import { getIO, getOnlineUsers } from "../config/socket.js";

export const listChatUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select("username avatar")
      .sort({ username: 1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getConversation = async (req, res) => {
  try {
    const myId = req.user._id;
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: otherUserId },
        { sender: otherUserId, receiver: myId },
      ],
    })
      .sort({ createdAt: 1 })
      .select("sender receiver text createdAt");

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.userId;
    const text = String(req.body?.text || "").trim();

    if (!text) {
      return res.status(400).json({ message: "Message text is required" });
    }

    const receiver = await User.findById(receiverId).select("_id");
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      text,
    });

    const onlineUsers = getOnlineUsers();
    const receiverSocketId = onlineUsers.get(String(receiverId));
    if (receiverSocketId) {
      getIO().to(receiverSocketId).emit("message:new", message);
    }

    return res.status(201).json(message);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};