const express = require("express");
const crypto = require("crypto");
const Room = require("../models/Room");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { name, description, language, isPrivate } = req.body;
    const inviteCode = crypto.randomBytes(6).toString("hex");
    const room = await Room.create({
      name,
      description,
      language: language || "javascript",
      isPrivate: isPrivate || false,
      inviteCode,
      owner: req.user._id,
      members: [req.user._id],
    });
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const rooms = await Room.find({ members: req.user._id })
      .populate("owner", "name avatar username")
      .populate("members", "name avatar username")
      .sort({ updatedAt: -1 });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate("owner", "name avatar username")
      .populate("members", "name avatar username");
    if (!room) return res.status(404).json({ message: "Room not found" });
    const isMember = room.members.some((m) => m._id.toString() === req.user._id.toString());
    if (!isMember) return res.status(403).json({ message: "Access denied" });
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/join", protect, async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const room = await Room.findOne({ inviteCode });
    if (!room) return res.status(404).json({ message: "Invalid invite code" });
    const alreadyMember = room.members.some((m) => m.toString() === req.user._id.toString());
    if (!alreadyMember) {
      room.members.push(req.user._id);
      await room.save();
    }
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id/code", protect, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    room.code = req.body.code;
    await room.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    if (room.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Only the owner can delete this room" });
    await room.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
