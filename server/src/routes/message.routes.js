import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getConversation,
  listChatUsers,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.use(protect);

router.get("/users", listChatUsers);
router.get("/:userId", getConversation);
router.post("/:userId", sendMessage);

export default router;