import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },

  usageCount: {
    type: Number,
    default: 0,
  }
});

export default mongoose.model("Tag", tagSchema);
