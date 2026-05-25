const mongoose = require("mongoose");

const ShipmentSchema = new mongoose.Schema({
  ShipmentId: {
    type: String,
    required: true,
    unique: true,
  },
  Supplier: {
    type: String,
    required: true,
  },
  Origin: {
    type: String,
    required: true,
  },
  Destination: {
    type: String,
    required: true,
  },
  ETA: {
    type: Date,
    required: true,
  },
  Status: {
    type: String,
    enum: ["On Time", "Delayed", "Delivered", "In Transit"],
    default: "In Transit",
  },
  DelayReason: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DelayCode",
    default: null,
  },
  DelayDuration: {
    type: Number,
    default: 0,
  },
  CreatedBy: {
    type: String,
    default: "admin",
  },
  AssignedCustomer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model("Shipment", ShipmentSchema);