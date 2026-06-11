const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    code: { type: String, default: "// Start coding here..." },
    language: { type: String, default: "javascript" },
    isPrivate: { type: Boolean, default: false },
    inviteCode: { type: String, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
