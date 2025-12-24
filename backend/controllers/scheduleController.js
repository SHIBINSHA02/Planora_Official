// backend/controllers/scheduleController.js
const ScheduleSlot = require("../models/ScheduleSlot");

/**
 * GET TEACHER SCHEDULE (FLAT LIST)
 * /api/schedule/teacher/:teacherId?organisationId=ORG1
 */
exports.getTeacherSchedule = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { organisationId } = req.query;

    if (!teacherId || !organisationId) {
      return res.status(400).json({
        message: "teacherId and organisationId are required"
      });
    }

    const schedule = await ScheduleSlot.find({
      teacherId,
      organisationId
    })
      .sort({ day: 1, period: 1 })
      .lean();

    res.status(200).json({
      teacherId,
      organisationId,
      totalSlots: schedule.length,
      schedule
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch teacher schedule",
      error
    });
  }
};
