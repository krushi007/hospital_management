const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    room_number: { type: String, required: true, unique: true },
    room_type: { type: String, default: "general" },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },
    capacity: { type: Number, default: 1 },
    occupied: { type: Number, default: 0 },
    rate_per_day: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: "created_at" } },
);

module.exports = mongoose.model("Room", roomSchema);
