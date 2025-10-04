const express = require('express');
const router = express.Router();
const classroomController = require('../controllers/classroomController');

// POST /api/classrooms - onboard a new classroom
router.post('/', classroomController.onboardClassroom);

module.exports = router;