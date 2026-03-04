import express from "express";
import { addComment, getCommentsByPost } from "../controllers/comment.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/post/:postId", getCommentsByPost);
router.post("/:postId", protect, addComment);

export default router;