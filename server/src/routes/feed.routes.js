import express from "express";
import { getFeed } from "../controllers/feed.controller.js";

const router = express.Router();

// Public feed (no auth required for reading)
router.get("/", getFeed);
export default router;