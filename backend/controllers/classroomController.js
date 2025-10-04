const { validateClassroomSchema } = require('../models/validation'); // Your validation
const { checkClassroomExists, saveClassroom } = require('../models/classroomModel');

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
