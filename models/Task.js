import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  goal: { type: String, required: true },
  plan: { type: Array, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Task", TaskSchema);
