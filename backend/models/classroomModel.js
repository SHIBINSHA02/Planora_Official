const mongoose = require('mongoose');

// Schema for individual slot in schedule
const scheduleSlotSchema = new mongoose.Schema({
  teacher_id: { type: String, required: true },
  teacher_name: { type: String, required: true },
  subject: { type: String, required: true },
}, { _id: false });

// Each period can have multiple assignments, so array of scheduleSlotSchema
const periodSchema = [scheduleSlotSchema];

// 6 periods per day
const daySchema = [periodSchema];

// Full schedule: 5 days, 6 periods per day
const classroomSchema = new mongoose.Schema({
  classroom_id: { type: String, required: true, unique: true },
  classname: { type: String, required: true },
  admin: { type: String, required: true },
  subjects: [
    {
      subject: { type: String, required: true },
      teachername: { type: String, required: true },
      time: { type: Number, required: true },
    }
  ],
  schedule: {
    type: Array, // Array of days, each day is array of periods
    required: true,
    default: Array(5).fill(Array(6).fill([]))
  }
});

const Classroom = mongoose.model('Classroom', classroomSchema);

// Model functions
async function checkClassroomExists(classroomId) {
  const classroom = await Classroom.findOne({ classroom_id: classroomId });
  return !!classroom;
}

async function saveClassroom(data) {
  const classroom = new Classroom(data);
  await classroom.save();
  return classroom;
}

module.exports = {
  Classroom,
  checkClassroomExists,
  saveClassroom
};
