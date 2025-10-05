// backend/routes/teacherRoutes.js
const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

// POST /api/teachers - Create a new teacher
router.get('/', teacherController.getAllTeachers);
router.get('/:id', teacherController.getTeacherById);
router.post('/', teacherController.createTeacher);
module.exports = router;
