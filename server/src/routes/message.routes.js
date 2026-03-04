import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getConversation,
  getUnreadCount,
  listChatUsers,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.use(protect);

router.get("/users", listChatUsers);
router.get("/unread/count", getUnreadCount);
router.get("/:userId", getConversation);
router.post("/:userId", sendMessage);

export default router;