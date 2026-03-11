const mongoose = require("mongoose");

const doctorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    email: { type: String, default: "" },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },
    specialization: { type: String, default: "" },
    license_no: { type: String, default: "" },
    experience_years: { type: Number, default: 0 },
    qualification: { type: String, default: "" },
    fee: { type: Number, default: 0 },
    bio: { type: String, default: "" },
    available_days: {
      type: [String],
      default: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    },
    available_from: { type: String, default: "09:00" },
    available_to: { type: String, default: "17:00" },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

module.exports = mongoose.model("DoctorProfile", doctorProfileSchema);
