const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  goal: { type: String, required: true },
  plan: { type: Array, required: true },
  createdAt: { type: Date, default: Date.now }
});

// 🛑 The change: Use module.exports instead of export default
module.exports = mongoose.model("Task", TaskSchema);