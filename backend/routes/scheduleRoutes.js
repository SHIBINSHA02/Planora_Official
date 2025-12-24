// backend/routes/scheduleRoutes.js
// backend/controllers/scheduleRoutes.js
const express = require('express');
const router = express.Router();
const ScheduleSlot = require('../models/ScheduleSlot');
const scheduleController = require('../controllers/scheduleController')
/* ================= CREATE ================= */
router.post('/', async (req, res) => {
    try {
        const slot = await ScheduleSlot.create(req.body);
        res.status(201).json({ success: true, slot });
    } catch (err) {
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

// Classroom timetable
router.get('/classroom/:classroomId', async (req, res) => {
    const { organisationId } = req.query;
    const { classroomId } = req.params;

    console.log("Searching for Org:", organisationId); // Should be ORG1
    console.log("Searching for Room:", classroomId);   // Should be CSE-A1

    try {
        const slots = await ScheduleSlot.find({
            organisationId: organisationId,
            classroomId: classroomId
        }).sort({ day: 1, period: 1 });

        console.log("Found slots count:", slots.length);
        res.json({ classroomId, schedule: slots });
    } catch (err) {
        res.status(500).json({ error: err.message });
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
