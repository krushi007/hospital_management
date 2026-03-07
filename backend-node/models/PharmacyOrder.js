const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    medicine_name: String,
    dosage: String,
    frequency: String,
    duration: String,
    quantity: { type: Number, default: 1 },
    unit_price: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    in_stock: { type: Boolean, default: false },
    medicine_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      default: null,
    },
  },
  { _id: false },
);

const pharmacyOrderSchema = new mongoose.Schema(
  {
    prescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
      default: null,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PatientProfile",
      required: true,
    },
    dispensed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    items: { type: [orderItemSchema], default: [] },
    subtotal: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "dispensed", "cancelled"],
      default: "pending",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

module.exports = mongoose.model("PharmacyOrder", pharmacyOrderSchema);
