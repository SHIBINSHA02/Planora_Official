// backend/routes/classroomRoutes.js
const express = require('express');
const router = express.Router();
const classroomController = require('../controllers/classroomController');

// POST /api/classrooms - onboard a new classroom
router.post('/', classroomController.onboardClassroom);

// GET /api/classrooms?organisationId=ORG1
router.get('/', classroomController.getAllClassrooms);

// GET /api/classrooms/:classroomId?organisationId=ORG1
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

    // Collect unique teacherIds
    const teacherIds = [...new Set(slots.map(s => s.teacherId))];

    const teachers = await Teacher.find({
      teacherId: { $in: teacherIds },
      organisationId
    })
      .select("teacherId teacherName")
      .lean();

    // Build lookup
    const teacherMap = Object.fromEntries(
      teachers.map(t => [t.teacherId, t.teacherName])
    );

    // Attach teacherName to each slot
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
    res.status(500).json({ error: err.message });
  }
});


// PUT /api/classrooms/:classroomId
router.put('/:classroomId', classroomController.updateClassroom);

// DELETE /api/classrooms/:classroomId?organisationId=ORG1
router.delete('/:classroomId', classroomController.deleteClassroom);

module.exports = router;
