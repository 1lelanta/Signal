import express from "express";

import {
    getUserProfile,
    updateUserProfile,
    uploadUserAvatar,
    toggleFollowUser,
    getFollowStatus,
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

router.put("/profile", protect, updateUserProfile);
router.post("/upload-avatar", protect, upload.single("avatar"), uploadUserAvatar);
router.get("/:id/follow-status", protect, getFollowStatus);
router.post("/:id/follow", protect, toggleFollowUser);
router.get("/:id", protect, getUserProfile);

export default router;

