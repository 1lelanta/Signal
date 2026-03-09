import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const reportSchema = new mongoose.Schema(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetType: { type: String, enum: ["post", "comment", "user"], required: true },
    targetId: { type: String, required: true },
    reason: { type: String, enum: ["spam", "abuse", "inappropriate", "other"], required: true },
    details: { type: String },
    status: { type: String, enum: ["open", "under_review", "resolved", "rejected"], default: "open" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    actionTaken: { type: String },
    notes: [noteSchema]
  },
  { timestamps: true }
);

reportSchema.index({ targetType: 1, targetId: 1 });
reportSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("Report", reportSchema);
