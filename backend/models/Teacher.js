// backend/models/Teacher.js
const mongoose = require('mongoose');

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
      
        type: [[mongoose.Schema.Types.Mixed]], 
        default: () => [
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null]
        ]
    }
});

module.exports = mongoose.model('Teacher', TeacherSchema);