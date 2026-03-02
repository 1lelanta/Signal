import express from "express";

import {
    getUserProfile,
    updateUserProfile,
    uploadUserAvatar,
} from "../controllers/user.controller.js";

import {protect} from "../middleware/auth.middleware.js";
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

router.get("/:id", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.post("/upload-avatar", protect, upload.single("avatar"), uploadUserAvatar);

export default router;

