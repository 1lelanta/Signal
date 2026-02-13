import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },

  description: {
    type: String,
  }
});

export default mongoose.model("Skill", skillSchema);
