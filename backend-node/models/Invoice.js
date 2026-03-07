const mongoose = require("mongoose");

const invoiceItemSchema = new mongoose.Schema(
  {
    description: String,
    quantity: { type: Number, default: 1 },
    unit_price: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  { _id: false },
);

const invoiceSchema = new mongoose.Schema(
  {
    invoice_number: { type: String, unique: true },
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
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    items: { type: [invoiceItemSchema], default: [] },
    subtotal: { type: Number, default: 0 },
    tax_percent: { type: Number, default: 0 },
    tax_amount: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total_amount: { type: Number, default: 0 },
    paid_amount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["unpaid", "paid", "partial", "cancelled"],
      default: "unpaid",
    },
    notes: { type: String, default: "" },
    due_date: { type: Date, default: null },
    bill_type: { type: String, default: "general" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

// Auto-generate invoice number
invoiceSchema.pre("save", async function (next) {
  if (!this.invoice_number) {
    const count = await mongoose.model("Invoice").countDocuments();
    this.invoice_number = `INV-${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Invoice", invoiceSchema);
