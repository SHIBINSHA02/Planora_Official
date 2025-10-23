// backend/controllers/classroomController.js
const { Classroom, checkClassroomExists, saveClassroom } = require('../models/classroomModel');

// Your existing validation (assuming it exists)
const { validateClassroomSchema } = require('../models/validation');

// Existing onboardClassroom function (keep as is)
exports.onboardClassroom = async (req, res) => {
  try {
    const data = req.body;

    // Validate incoming data
    const [isValid, errorMessage] = validateClassroomSchema(data);
    if (!isValid) {
      return res.status(400).json({ success: false, message: `Validation Error: ${errorMessage}` });
    }

    const classroomId = data.classroom_id;

    // Check if classroom already exists
    if (await checkClassroomExists(classroomId)) {
      return res.status(409).json({ success: false, message: `Classroom with ID '${classroomId}' already exists.` });
    }

    // Save classroom to DB
    const savedClassroom = await saveClassroom(data);

    return res.status(201).json({
      success: true,
      message: `Classroom '${savedClassroom.classname}' onboarded successfully with schedule.`,
      classroom_id: savedClassroom.classroom_id
    });

  } catch (err) {
    console.error('Error saving classroom:', err);
    return res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
  }
};

// GET /api/classrooms - Get all classrooms
exports.getAllClassrooms = async (req, res) => {
  try {
    const classrooms = await Classroom.find({}, {
      classroom_id: 1,
      classname: 1,
      admin: 1,
      subjects: 1
      // Exclude schedule for listing to reduce payload size
    }).lean();

    res.status(200).json({
      success: true,
      count: classrooms.length,
      data: classrooms
    });
  } catch (err) {
    console.error('Error fetching classrooms:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch classrooms',
      error: err.message
    });
  }
};

// GET /api/classrooms/:classroom_id - Get specific classroom
exports.getClassroom = async (req, res) => {
  try {
    const { classroom_id } = req.params;
    
    if (!classroom_id) {
      return res.status(400).json({
        success: false,
        message: 'Classroom ID is required'
      });
    }

    const classroom = await Classroom.findOne({ classroom_id }).lean();
    
    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: `Classroom with ID '${classroom_id}' not found`
      });
    }

    res.status(200).json({
      success: true,
      data: classroom
    });
  } catch (err) {
    console.error('Error fetching classroom:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch classroom',
      error: err.message
    });
  }
};

// PUT /api/classrooms/:classroom_id - Update classroom
exports.updateClassroom = async (req, res) => {
  try {
    const { classroom_id } = req.params;
    const updateData = req.body;

    if (!classroom_id) {
      return res.status(400).json({
        success: false,
        message: 'Classroom ID is required'
      });
    }

    // Validate update data (basic validation)
    if (updateData.classroom_id && updateData.classroom_id !== classroom_id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change classroom_id'
      });
    }

    // Check if classroom exists
    const exists = await checkClassroomExists(classroom_id);
    if (!exists) {
      return res.status(404).json({
        success: false,
        message: `Classroom with ID '${classroom_id}' not found`
      });
    }

    // Update classroom
    const updatedClassroom = await Classroom.findOneAndUpdate(
      { classroom_id },
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    res.status(200).json({
      success: true,
      message: `Classroom '${updatedClassroom.classname}' updated successfully`,
      data: updatedClassroom
    });
  } catch (err) {
    console.error('Error updating classroom:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to update classroom',
      error: err.message
    });
  }
};

// DELETE /api/classrooms/:classroom_id - Delete classroom
exports.deleteClassroom = async (req, res) => {
  try {
    const { classroom_id } = req.params;

    if (!classroom_id) {
      return res.status(400).json({
        success: false,
        message: 'Classroom ID is required'
      });
    }

    const deletedClassroom = await Classroom.findOneAndDelete({ classroom_id }).lean();
    
    if (!deletedClassroom) {
      return res.status(404).json({
        success: false,
        message: `Classroom with ID '${classroom_id}' not found`
      });
    }

    res.status(200).json({
      success: true,
      message: `Classroom '${deletedClassroom.classname}' deleted successfully`,
      deleted_classroom_id: classroom_id
    });
  } catch (err) {
    console.error('Error deleting classroom:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete classroom',
      error: err.message
    });
  }
};

// GET /api/classrooms/:classroom_id/schedule - Get classroom schedule only
exports.getSchedule = async (req, res) => {
  try {
    const { classroom_id } = req.params;

    if (!classroom_id) {
      return res.status(400).json({
        success: false,
        message: 'Classroom ID is required'
      });
    }

    const classroom = await Classroom.findOne(
      { classroom_id },
      { schedule: 1, classname: 1 }
    ).lean();

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: `Classroom with ID '${classroom_id}' not found`
      });
    }

    res.status(200).json({
      success: true,
      classname: classroom.classname,
      schedule: classroom.schedule
    });
  } catch (err) {
    console.error('Error fetching schedule:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch schedule',
      error: err.message
    });
  }
};