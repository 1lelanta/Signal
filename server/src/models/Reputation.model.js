import mongoose from "mongoose";

const reputationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sourceType: {
      type: String,
      enum: ["post", "comment", "tag", "moderation"],
      required: true,
    },

    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    points: {
      type: Number,
      required: true,
    },

    reason: {
      type: String,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Reputation", reputationSchema);
