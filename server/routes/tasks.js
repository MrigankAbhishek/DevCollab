const express = require("express");
const Task = require("../models/Task");
const Room = require("../models/Room");
const { protect } = require("../middleware/auth");

const router = express.Router();

const verifyRoomMember = async (roomId, userId) => {
  const room = await Room.findById(roomId);
  if (!room) return false;
  return room.members.some((m) => m.toString() === userId.toString());
};

router.get("/:roomId", protect, async (req, res) => {
  try {
    const allowed = await verifyRoomMember(req.params.roomId, req.user._id);
    if (!allowed) return res.status(403).json({ message: "Access denied" });
    const tasks = await Task.find({ roomId: req.params.roomId })
      .populate("assignedTo", "name avatar username")
      .populate("createdBy", "name avatar username")
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/:roomId", protect, async (req, res) => {
  try {
    const allowed = await verifyRoomMember(req.params.roomId, req.user._id);
    if (!allowed) return res.status(403).json({ message: "Access denied" });
    const task = await Task.create({
      ...req.body,
      roomId: req.params.roomId,
      createdBy: req.user._id,
    });
    const populated = await task.populate(["assignedTo", "createdBy"]);
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("assignedTo", "name avatar username")
      .populate("createdBy", "name avatar username");
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
