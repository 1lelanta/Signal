import Message from "../models/Message.model.js";
import User from "../models/User.model.js";
import { getIO, getOnlineUsers } from "../config/socket.js";
import path from "path";
import { ENV } from "../config/env.js";
import supabase, { ensureBucketExists } from "../config/supabase.js";

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

    await Message.updateMany(
      {
        sender: otherUserId,
        receiver: myId,
        readAt: null,
      },
      { $set: { readAt: new Date() } }
    );

    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: otherUserId },
        { sender: otherUserId, receiver: myId },
      ],
    })
      .sort({ createdAt: 1 })
      .select("sender receiver text imageUrl createdAt");

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
    const imageUrl = req.body?.imageUrl ? String(req.body.imageUrl).trim() : null;

    if (!text && !imageUrl) {
      return res.status(400).json({ message: "Message text or image is required" });
    }

    const receiver = await User.findById(receiverId).select("_id");
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      text,
      imageUrl: imageUrl || null,
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

export const uploadMessageImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    if (!ENV.SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({
        message: "SUPABASE_SERVICE_ROLE_KEY is required for server-side uploads",
      });
    }

    if (!supabase || !ENV.SUPABASE_BUCKET) {
      return res.status(500).json({ message: "Supabase storage is not configured" });
    }

    await ensureBucketExists(ENV.SUPABASE_BUCKET);

    const fileExt = path.extname(req.file.originalname || "").toLowerCase() || ".jpg";
    const safeExt = [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(fileExt)
      ? fileExt
      : ".jpg";
    const filePath = `messages/${req.user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}${safeExt}`;

    const { error: uploadError } = await supabase.storage
      .from(ENV.SUPABASE_BUCKET)
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      return res.status(500).json({
        message: `Supabase upload failed: ${uploadError.message}`,
      });
    }

    const { data: publicData } = supabase.storage
      .from(ENV.SUPABASE_BUCKET)
      .getPublicUrl(filePath);

    return res.status(201).json({ imageUrl: publicData.publicUrl });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user._id,
      readAt: null,
    });

    return res.json({ success: true, count });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};