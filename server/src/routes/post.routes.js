import express from "express"

import {
    createPost,
    publishPost,
    getSinglePost,
} from "../controllers/post.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { validatePostInput } from "../middleware/validate.middleware.js";
import router from "./auth.routes.js";


router = express.Router();

router.post("/", protect, validatePostInput, createPost);

router.put("/:id/publish", protect, publishPost);

router.get("/:id", protect, getSinglePost)

export default router;