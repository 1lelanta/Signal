import Report from "../models/Report.model.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import mongoose from "mongoose";

// Create a new report
export const createReport = asyncHandler(async (req, res) => {
  const { targetType, targetId, reason, details } = req.body;
  const reporterId = req.user && req.user.id;

  if (!reporterId) {
    res.status(401);
    throw new Error("Authentication required");
  }

  if (!targetType || !targetId || !reason) {
    res.status(400);
    throw new Error("targetType, targetId and reason are required");
  }

  // simple rate-limit: max 3 reports on same target by same user in 24h
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const sameReports = await Report.countDocuments({ reporter: reporterId, targetType, targetId, createdAt: { $gte: since } });
  if (sameReports >= 3) {
    res.status(429);
    throw new Error("Too many reports for this target. Try again later.");
  }

  const report = await Report.create({
    reporter: reporterId,
    targetType,
    targetId: String(targetId),
    reason,
    details
  });

  res.status(201).json({ success: true, report });
});

// List reports (moderator)
export const listReports = asyncHandler(async (req, res) => {
  const { status, targetType, page = 1, limit = 20 } = req.query;
  const q = {};
  if (status) q.status = status;
  if (targetType) q.targetType = targetType;

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Report.find(q).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
    Report.countDocuments(q)
  ]);

  res.json({ success: true, items, total, page: Number(page), limit: Number(limit) });
});

// Get single report (moderator or reporter)
export const getReport = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid report id");
  }

  const report = await Report.findById(id).lean();
  if (!report) {
    res.status(404);
    throw new Error("Report not found");
  }

  // allow reporter to view their own report or moderators
  if (String(report.reporter) !== String(req.user.id) && req.user.trustLevel !== "moderator") {
    res.status(403);
    throw new Error("Access denied");
  }

  res.json({ success: true, report });
});

// Update report (moderator actions)
export const updateReport = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid report id");
  }

  if (req.user.trustLevel !== "moderator") {
    res.status(403);
    throw new Error("Access denied");
  }

  const { status, actionTaken, note, assignedTo } = req.body;
  const update = {};
  if (status) update.status = status;
  if (actionTaken) update.actionTaken = actionTaken;
  if (assignedTo) update.assignedTo = assignedTo;

  const report = await Report.findById(id);
  if (!report) {
    res.status(404);
    throw new Error("Report not found");
  }

  if (note) {
    report.notes = report.notes || [];
    report.notes.push({ author: req.user.id, text: note });
  }

  Object.assign(report, update);
  await report.save();

  res.json({ success: true, report });
});
