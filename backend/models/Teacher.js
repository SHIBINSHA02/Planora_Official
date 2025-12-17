// backend/models/Teacher.js
const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema({
  organisationId: {
    type: String,
    required: true,
    index: true
  },

  teacherId: {
    type: String,
    required: true,
    unique: true
  },

  teacherName: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  subjects: {
    type: [String],
    default: []
  },

  metadata: {
    type: Object,
    default: {}
  }

}, { timestamps: true });

module.exports = mongoose.model("Teacher", TeacherSchema);
module.exports = mongoose.model("Teacher", TeacherSchema);
