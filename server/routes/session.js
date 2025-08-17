const express = require("express");
const router = express.Router();
const Session = require("../models/Session");

router.post("/", async (req, res) => {
  const { sessionId, code, language } = req.body;
  try {
    // Check if session already exists
    const existing = await Session.findOne({ sessionId });
    if (existing) {
      return res.status(409).json({ message: "Room already exists" });
    }

    const session = new Session({ sessionId, code, language });
    await session.save();
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const session = await Session.findOne({ sessionId: req.params.id });
    if (!session) return res.status(404).json({ message: "Not found" });
    res.status(200).json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const { code, chatHistory, language } = req.body; // ← Add language
  try {
    

    const session = await Session.findOneAndUpdate(
      { sessionId: req.params.id },
      { code, chatHistory, language }, // ← Include language in update
      { new: true }
    );

    if (!session) return res.status(404).json({ message: "Session not found" });
    res.status(200).json(session);
  } catch (err) {
    console.error("Update session error:", err); // ← Better error logging
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
