import express from "express";
import { addComment } from "../controllers/comment.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/:postId", protect, addComment);

export default router;