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

    // Fetch Teacher Name
    const teacher = await Teacher.findOne({
      teacherId,
      organisationId
    }).select("teacherName").lean();

    const teacherName = teacher?.teacherName || "Unknown";

    // Attach teacherName to each slot
    const enriched = schedule.map(s => ({
      ...s,
      teacherName
    }));

    res.status(200).json({
      teacherId,
      teacherName,
      organisationId,
      totalSlots: enriched.length,
      schedule: enriched
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch teacher schedule",
      error
    });
  }
};
