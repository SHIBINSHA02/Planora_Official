// backend/routes/scheduleRoutes.js
// backend/controllers/scheduleRoutes.js
const express = require('express');
const router = express.Router();
const ScheduleSlot = require('../models/ScheduleSlot');
const scheduleController = require('../controllers/scheduleController')

/* ================= CREATE ================= */
router.post('/', async (req, res) => {
  try {
    const { organisationId, classroomId, teacherId, subject, day, period } = req.body;

    if (!organisationId || !classroomId)
      return res.status(400).json({ message: "organisationId & classroomId required" });

    if (!teacherId || !subject)
      return res.status(400).json({ message: "teacherId & subject required" });

    const slot = await ScheduleSlot.findOneAndUpdate(
      { organisationId, classroomId, day, period },   // match existing
      {
        $set: {
          teacherId,
          subject
        }
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      slot
    });

  } catch (err) {
    console.error("❌ Schedule upsert error:", err);
    res.status(400).json({ success: false, message: err.message });
  }
});


/* ================= READ ================= */

// Organisation timetable
router.get('/', async (req, res) => {
    const { organisationId } = req.query;
    const slots = await ScheduleSlot.find({ organisationId })
        .sort({ day: 1, period: 1 });
    res.json({ count: slots.length, data: slots });
});

const Teacher = require("../models/Teacher");

router.get('/classroom/:classroomId', async (req, res) => {
  const { organisationId } = req.query;
  const { classroomId } = req.params;

  try {
    const slots = await ScheduleSlot.find({
      organisationId,
      classroomId
    })
      .sort({ day: 1, period: 1 })
      .lean();

    if (!slots.length) {
      return res.json({
        classroomId,
        organisationId,
        totalSlots: 0,
        schedule: []
      });
    }

    const teacherIds = [...new Set(
      slots.map(s => s.teacherId).filter(Boolean)
    )];

    let teacherMap = {};

    if (teacherIds.length > 0) {
      const teachers = await Teacher.find({
        teacherId: { $in: teacherIds },
        organisationId
      })
        .select("teacherId teacherName")
        .lean();

      teacherMap = Object.fromEntries(
        teachers.map(t => [t.teacherId, t.teacherName])
      );
    }

    const enriched = slots.map(s => ({
      ...s,
      teacherName: teacherMap[s.teacherId] || "Unknown"
    }));

    res.json({
      classroomId,
      organisationId,
      totalSlots: enriched.length,
      schedule: enriched
    });

  } catch (err) {
    console.error("❌ Classroom timetable error:", err);
    res.status(500).json({
      message: "Failed to load classroom schedule",
      error: err.message
    });
  }
});



// Teacher timetable
router.get("/teacher/:teacherId", scheduleController.getTeacherSchedule);

/* ================= UPDATE ================= */
router.put('/:slotId', async (req, res) => {
    const { slotId } = req.params;
    const { organisationId } = req.body;

    const updated = await ScheduleSlot.findOneAndUpdate(
        { _id: slotId, organisationId },
        { $set: req.body },
        { new: true }
    );

    if (!updated) {
        return res.status(404).json({ message: "Slot not found" });
    }

    res.json({ success: true, slot: updated });
});

/* ================= DELETE ================= */
router.delete('/:slotId', async (req, res) => {
    const { slotId } = req.params;
    const { organisationId } = req.query;

    await ScheduleSlot.findOneAndDelete({ _id: slotId, organisationId });
    res.json({ success: true, message: "Schedule slot deleted" });
});

module.exports = router;
