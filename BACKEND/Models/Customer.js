const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  phone:    { type: String, required: true },
  password: { type: String, required: true },
  address:  { type: String },
  status:   { type: String, default: 'active' },
}, { timestamps: true }); // auto adds createdAt & updatedAt

module.exports = mongoose.model('Customer', customerSchema);