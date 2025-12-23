// backend/controllers/classroomController.js
const  Classroom  = require('../models/classroomModel');
const ScheduleSlot = require('../models/ScheduleSlot');

/* ================= CREATE ================= */

exports.onboardClassroom = async (req, res) => {
  try {
    const { organisationId, classroomId, className, subjects, department } = req.body;

    if (!organisationId || !classroomId || !className) {
      return res.status(400).json({
        success: false,
        message: "organisationId, classroomId and className are required"
      });
    }

    const exists = await Classroom.findOne({ classroomId, organisationId });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: `Classroom '${classroomId}' already exists in this organisation`
      });
    }

    const classroom = await Classroom.create({
      organisationId,
      classroomId,
      className,
      department,
      subjects
    });

    res.status(201).json({
      success: true,
      message: "Classroom onboarded successfully",
      classroom
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to onboard classroom",
      error
    });
  }
};

/* ================= READ (ORG SCOPED) ================= */

exports.getAllClassrooms = async (req, res) => {
  try {
    const { organisationId } = req.query;

    if (!organisationId) {
      return res.status(400).json({
        success: false,
        message: "organisationId is required"
      });
    }

    const classrooms = await Classroom.find(
      { organisationId },
      { _id: 0, classroomId: 1, className: 1, department: 1, subjects: 1 }
    ).lean();

    res.status(200).json({
      success: true,
      count: classrooms.length,
      data: classrooms
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch classrooms",
      error
    });
  }
};

exports.getClassroom = async (req, res) => {
  try {
    const { classroomId } = req.params;
    const { organisationId } = req.query;

    const classroom = await Classroom.findOne({
      classroomId,
      organisationId
    }).lean();

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: "Classroom not found"
      });
    }

    res.status(200).json({
      success: true,
      data: classroom
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch classroom",
      error
    });
  }
};

/* ================= UPDATE ================= */

exports.updateClassroom = async (req, res) => {
  try {
    const { classroomId } = req.params;
    const { organisationId } = req.body;

    if (!organisationId) {
      return res.status(400).json({
        success: false,
        message: "organisationId is required"
      });
    }

    // Prevent ID mutation
    delete req.body.classroomId;

    const updated = await Classroom.findOneAndUpdate(
      { classroomId, organisationId },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Classroom not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Classroom updated successfully",
      classroom: updated
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update classroom",
      error
    });
  }
};

/* ================= DELETE ================= */

exports.deleteClassroom = async (req, res) => {
  try {
    const { classroomId } = req.params;
    const { organisationId } = req.query;

    const deleted = await Classroom.findOneAndDelete({
      classroomId,
      organisationId
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Classroom not found"
      });
    }

    // 🔥 Cleanup related schedule slots
    await ScheduleSlot.deleteMany({
      classroomId,
      organisationId
    });

    res.status(200).json({
      success: true,
      message: "Classroom deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete classroom",
      error
    });
  }
};
