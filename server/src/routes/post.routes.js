import express from "express"

import {
    createPost,
    publishPost,
    getSinglePost,
    uploadPostImage,
} from "../controllers/post.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { validatePostInput } from "../middleware/validate.middleware.js";
import multer from "multer";


let router = express.Router();
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

router.post("/", protect, validatePostInput, createPost);
router.post("/upload-image", protect, upload.single("image"), uploadPostImage);

router.put("/:id/publish", protect, publishPost);

router.get("/:id", protect, getSinglePost)

export default router;