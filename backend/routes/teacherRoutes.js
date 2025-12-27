// backend/routes/teacherRoutes.js
const express = require('express');
const router = express.Router();

const teacherController = require('../controllers/teacherController');





router.post('/', teacherController.createTeacher);

// GET /api/teachers?organisationId=ORG1
// Get all teachers for an organisation
router.get('/', teacherController.getAllTeachers);

// GET /api/teachers/:teacherId?organisationId=ORG1
// Get a single teacher by teacherId (NOT Mongo _id)
router.get('/:teacherId', teacherController.getTeacherById);

// PUT /api/teachers/:teacherId
// Update teacher details (organisationId in body)
router.put('/:teacherId', teacherController.updateTeacher);

// DELETE /api/teachers/:teacherId?organisationId=ORG1
// Delete teacher and cleanup schedule slots
router.delete('/:teacherId', teacherController.deleteTeacher);

module.exports = router;
