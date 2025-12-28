// backend/models/Teacher.js
const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema(
  {
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
      lowercase: true,
      unique: true,        // 🔥 GLOBAL UNIQUE
      trim: true
    },

    subjects: {
      type: [String],
      default: []
    },

    organisations: {
      type: [String],      // 🔥 teacher belongs to MANY orgs
      default: []
    },

    metadata: {
      type: Object,
      default: {}
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teacher", TeacherSchema);
