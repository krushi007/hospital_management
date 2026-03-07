const mongoose = require("mongoose");

const admissionSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PatientProfile",
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    admit_date: { type: Date, required: true },
    discharge_date: { type: Date, default: null },
    status: {
      type: String,
      enum: ["admitted", "discharged", "transferred"],
      default: "admitted",
    },
    reason: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { timestamps: { createdAt: "created_at" } },
);

module.exports = mongoose.model("Admission", admissionSchema);
