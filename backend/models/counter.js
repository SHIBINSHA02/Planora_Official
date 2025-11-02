// backend/models/counter.js
const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // e.g., 'teacherid'
  sequence_value: { type: Number, default: 100 },
});

module.exports = mongoose.model('Counter', counterSchema);
