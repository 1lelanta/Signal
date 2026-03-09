import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { listUsers, updateUserTrust, listPosts, deletePost } from "../controllers/admin.controller.js";

const router = express.Router();

// all admin endpoints require moderator trust level
router.get("/users", protect, authorizeRoles("moderator"), listUsers);
router.patch("/users/:userId/trust", protect, authorizeRoles("moderator"), updateUserTrust);

router.get("/posts", protect, authorizeRoles("moderator"), listPosts);
router.delete("/posts/:postId", protect, authorizeRoles("moderator"), deletePost);

export default router;
