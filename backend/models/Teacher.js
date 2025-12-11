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
  },
  workload:{
    type:Number,
    default :0
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

const Teacher = mongoose.model('Teacher', TeacherSchema);

// ===== Model functions (similar to Classroom) =====

async function checkTeacherExists(teacherId) {
  const teacher = await Teacher.findOne({ teacherid: teacherId });
  return !!teacher;
}

async function saveTeacher(data) {
  const teacher = new Teacher(data);
  await teacher.save();
  return teacher;
}

async function getTeacherById(teacherId) {
  return await Teacher.findOne({ teacherid: teacherId }).lean();
}

async function updateTeacher(teacherId, updateData) {
  return await Teacher.findOneAndUpdate(
    { teacherid: teacherId },
    { $set: updateData },
    { new: true, runValidators: true }
  ).lean();
}

async function deleteTeacherById(teacherId) {
  return await Teacher.findOneAndDelete({ teacherid: teacherId }).lean();
}

// ===== Schedule helper functions =====

// Get full schedule grid for a teacher
async function getTeacherScheduleGrid(teacherId) {
  const teacher = await Teacher.findOne(
    { teacherid: teacherId },
    { schedule_grid: 1, teacherid: 1, teachername: 1 }
  ).lean();

  if (!teacher) return null;

  return teacher.schedule_grid || [];
}

// Get schedule for a particular day (0–4) for a teacher
// Returns array of 6 periods (each period: array of ScheduleItemSchema or null)
async function getTeacherDaySchedule(teacherId, dayIndex) {
  const scheduleGrid = await getTeacherScheduleGrid(teacherId);
  if (!scheduleGrid || dayIndex < 0 || dayIndex > 4) return null;
  return scheduleGrid[dayIndex] || [];
}

// Count periods assigned for a particular day
async function getTeacherDayPeriodCount(teacherId, dayIndex) {
  const daySchedule = await getTeacherDaySchedule(teacherId, dayIndex);
  if (!daySchedule) {
    return {
      dayIndex,
      totalPeriods: 0,
      assignedPeriods: 0,
      freePeriods: 0
    };
  }

  const totalPeriods = daySchedule.length;
  const assignedPeriods = daySchedule.reduce((count, slot) => {
    if (Array.isArray(slot) && slot.length > 0) {
      return count + 1;
    }
    return count;
  }, 0);

  return {
    dayIndex,
    totalPeriods,
    assignedPeriods,
    freePeriods: totalPeriods - assignedPeriods
  };
}

// Given a day and period, get:
// - the current period schedule
// - how many assigned periods are before it
// - how many assigned periods are after it
async function getTeacherPeriodContext(teacherId, dayIndex, periodIndex) {
  const daySchedule = await getTeacherDaySchedule(teacherId, dayIndex);
  if (!daySchedule || periodIndex < 0 || periodIndex > 5) {
    return null;
  }

  const currentPeriod = daySchedule[periodIndex] || null;

  const isAssigned = (slot) => Array.isArray(slot) && slot.length > 0;

  const countBefore = daySchedule.slice(0, periodIndex)
    .reduce((count, slot) => count + (isAssigned(slot) ? 1 : 0), 0);

  const countAfter = daySchedule.slice(periodIndex + 1)
    .reduce((count, slot) => count + (isAssigned(slot) ? 1 : 0), 0);

  const totalAssignedThatDay = daySchedule
    .reduce((count, slot) => count + (isAssigned(slot) ? 1 : 0), 0);

  return {
    dayIndex,
    periodIndex,
    currentPeriod,          // array of schedule items or null
    countBefore,            // assigned periods before this period
    countAfter,             // assigned periods after this period
    totalAssignedThatDay
  };
}

module.exports = {
  Teacher,
  checkTeacherExists,
  saveTeacher,
  getTeacherById,
  updateTeacher,
  deleteTeacherById,
  getTeacherScheduleGrid,
  getTeacherDaySchedule,
  getTeacherDayPeriodCount,
  getTeacherPeriodContext
};
