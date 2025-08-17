const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
     const existingUser = await User.findOne({ email });
if (existingUser) {
  return res.status(400).json({ error: "Email already registered" });
}
    const user = new User({ username, email, password });
   
    await user.save();
    res.status(201).json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const u = await User.findOne({ email });
    if (!u || !(await u.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ _id: u._id, username: u.username }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { _id: u._id, username: u.username, email: u.email } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
