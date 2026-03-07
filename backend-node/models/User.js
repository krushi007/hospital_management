const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String },
    password: { type: String, required: true },
    first_name: { type: String, default: "" },
    last_name: { type: String, default: "" },
    role: {
      type: String,
      enum: ["admin", "doctor", "patient", "receptionist", "pharmacist"],
      default: "patient",
    },
    phone: { type: String, default: "" },
    avatar: { type: String, default: "" },
    is_active: { type: Boolean, default: true },
    is_staff: { type: Boolean, default: false },
    is_superuser: { type: Boolean, default: false },
    is_verified: { type: Boolean, default: true },
    date_joined: { type: Date, default: Date.now },
    last_login: { type: Date },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

module.exports = mongoose.model("User", userSchema);
