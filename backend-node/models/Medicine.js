const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    generic_name: { type: String, default: "" },
    category: { type: String, default: "" },
    manufacturer: { type: String, default: "" },
    price: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    unit: { type: String, default: "tablet" },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: "created_at" } },
);

module.exports = mongoose.model("Medicine", medicineSchema);
