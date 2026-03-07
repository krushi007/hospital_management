const mongoose = require("mongoose");

const patientProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    date_of_birth: { type: Date, default: null },
    gender: { type: String, default: "" },
    blood_group: { type: String, default: "" },
    address: { type: String, default: "" },
    emergency_contact: { type: String, default: "" },
    emergency_contact_name: { type: String, default: "" },
    allergies: { type: String, default: "" },
    chronic_conditions: { type: String, default: "" },
    height_cm: { type: Number, default: null },
    weight_kg: { type: Number, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

module.exports = mongoose.model("PatientProfile", patientProfileSchema);
