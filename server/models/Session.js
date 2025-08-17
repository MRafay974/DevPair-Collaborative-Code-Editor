const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, unique: true },
  code: String,
  language: { type: String, default: "javascript" },
  participants: [String],
  chatHistory: [{
    message: { type: String, required: true },
    from: { type: String, required: true },
    ts: { type: Number, required: true }
  }],
}, { timestamps: true });

module.exports = mongoose.model("Session", sessionSchema);