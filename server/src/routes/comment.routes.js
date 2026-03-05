import express from "express";
import { addComment, getCommentsByPost, uploadCommentImage } from "../controllers/comment.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import multer from "multer";

const router = express.Router();
const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter: (req, file, cb) => {
		if (!file.mimetype?.startsWith("image/")) {
			return cb(new Error("Only image files are allowed"));
		}
		cb(null, true);
	},
});

router.get("/post/:postId", getCommentsByPost);
router.post("/upload-image", protect, upload.single("image"), uploadCommentImage);
router.post("/:postId", protect, addComment);

export default router;