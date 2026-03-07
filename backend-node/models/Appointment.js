const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DoctorProfile",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PatientProfile",
      default: null,
    },
    manual_patient_name: { type: String, default: null },
    date: { type: String, required: true },
    time_slot: { type: String, required: true },
    status: {
      type: String,
      enum: ["booked", "confirmed", "in_progress", "completed", "cancelled"],
      default: "booked",
    },
    reason: { type: String, default: "" },
    notes: { type: String, default: "" },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

module.exports = mongoose.model("Appointment", appointmentSchema);
