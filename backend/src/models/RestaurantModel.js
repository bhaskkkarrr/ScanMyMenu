const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "customer", "superadmin"],
    default: "admin",
  },
  ownerName: { type: String },
  address: { type: String },
  currency: { type: String, default: "₹" },
  logoUrl: { type: String },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  isOpen: { type: Boolean, default: true },
  hasPictures: { type: Boolean, default: true },
  hasDescription: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
