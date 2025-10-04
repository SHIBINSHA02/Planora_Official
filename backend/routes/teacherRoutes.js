const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

// POST /api/teachers - Create a new teacher
router.post('/', teacherController.createTeacher);

module.exports = router;
