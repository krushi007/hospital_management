const mongoose = require("mongoose");

const medicationSchema = new mongoose.Schema(
  {
    name: String,
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String,
  },
  { _id: false },
);

const prescriptionSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DoctorProfile",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PatientProfile",
      required: true,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
    },
    diagnosis: { type: String, required: true },
    notes: { type: String, default: "" },
    medications: { type: [medicationSchema], default: [] },
    is_analyzed: { type: Boolean, default: false },
    ai_analysis: { type: Object, default: {} },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

module.exports = mongoose.model("Prescription", prescriptionSchema);
