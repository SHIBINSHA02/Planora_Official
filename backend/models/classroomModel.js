// backend/models/classroomModel.js
const mongoose = require("mongoose");

const ClassroomSchema = new mongoose.Schema({
  organisationId: {
    type: String,
    required: true,
    index: true
  },

  classroomId: {
    type: String,
    required: true,
    unique: true
  },

  className: {
    type: String,
    required: true
  },

  department: {
    type: String
  },

  subjects: [
    {
      subject: String,
      defaultTeacherId: String,
      weeklyHours: Number
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model("Classroom", ClassroomSchema);
