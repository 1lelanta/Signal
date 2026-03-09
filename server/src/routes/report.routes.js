import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { createReport, listReports, getReport, updateReport } from "../controllers/report.controller.js";

const router = express.Router();

// create a report (authenticated users)
router.post("/", protect, createReport);

// list reports (moderator)
router.get("/", protect, authorizeRoles("moderator"), listReports);

// get single report (reporter or moderator)
router.get("/:id", protect, getReport);

// update report (moderator)
router.patch("/:id", protect, authorizeRoles("moderator"), updateReport);

export default router;
