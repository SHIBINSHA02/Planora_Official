// backend/routes/teacherRoutes.js
const express = require('express');
const router = express.Router();

const teacherController = require('../controllers/teacherController');

router.post('/', teacherController.createTeacher);
router.get('/', teacherController.getAllTeachers);
router.get('/:id', teacherController.getTeacherById); // This route uses the MongoDB _id


router.put('/:teacherid', teacherController.updateTeacher);

router.delete('/:teacherid', teacherController.deleteTeacher);
module.exports = router;