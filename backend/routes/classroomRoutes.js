// backend/routes/classroomRoutes.js
const express = require('express');
const router = express.Router();
const classroomController = require('../controllers/classroomController');

// Keep your existing POST route unchanged
// POST /api/classrooms - onboard a new classroom
router.post('/', classroomController.onboardClassroom);

// Additional common endpoints (optional - you can add these)
router.get('/', classroomController.getAllClassrooms);           // GET all classrooms
router.get('/:classroom_id', classroomController.getClassroom);  // GET specific classroom
router.put('/:classroom_id', classroomController.updateClassroom); // UPDATE classroom
router.delete('/:classroom_id', classroomController.deleteClassroom); // DELETE classroom
router.get('/:classroom_id/schedule', classroomController.getSchedule); // GET schedule only

// Error handling middleware for this router
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

module.exports = router;