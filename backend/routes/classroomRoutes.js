const express = require('express');
const router = express.Router();
const classroomController = require('../controllers/classroomController');

// POST /api/classrooms - onboard a new classroom
router.post('/', classroomController.onboardClassroom);

// GET /api/classrooms?organisationId=ORG1
router.get('/', classroomController.getAllClassrooms);

// GET /api/classrooms/:classroomId?organisationId=ORG1
router.get('/:classroomId', classroomController.getClassroom);

// PUT /api/classrooms/:classroomId
router.put('/:classroomId', classroomController.updateClassroom);

// DELETE /api/classrooms/:classroomId?organisationId=ORG1
router.delete('/:classroomId', classroomController.deleteClassroom);

module.exports = router;
