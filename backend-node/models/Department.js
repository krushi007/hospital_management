const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: "created_at" } },
);

module.exports = mongoose.model("Department", departmentSchema);
