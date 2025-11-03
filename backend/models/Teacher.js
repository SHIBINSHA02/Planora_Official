// backend/models/Teacher.js
const mongoose = require('mongoose');

const ScheduleItemSchema = new mongoose.Schema({
  classroomId: {
    type: String,
    required: true
  },
  classroomName: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  }
}, { _id: false }); // Disable automatic _id inside subdocument array

const TeacherSchema = new mongoose.Schema({
    teacherid: {
        type: String,
        unique: true,
        required: true,
    },
    teachername: {
        type: String,
        required: true,
        trim: true
    },
    mailid: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    subjects: {
        type: [String],
        required: true
    },
    schedule_grid: {
      
       
        type: [[{
            type: [ScheduleItemSchema],
            default: undefined
        }]],
        default: () => Array.from({ length: 5 }, () => Array(6).fill(null))
    }
});

module.exports = mongoose.model('Teacher', TeacherSchema);