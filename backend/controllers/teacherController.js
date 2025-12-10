// backend/controllers/teacherController.js
const { Teacher } = require('../models/Teacher');
const EventEmitter = require('events');

const teacherEmitter = new EventEmitter();
exports.teacherEmitter = teacherEmitter;

const Counter = require('../models/counter');

const generateTeacherId = async () => {
    const counter = await Counter.findOneAndUpdate(
        { _id: 'teacherid' },               // Identify the sequence
        { $inc: { sequence_value: 1 } },    // Atomically increment
        { new: true, upsert: true }         // Create if doesn't exist
    );

    return `T-${counter.sequence_value}`;
};

// POST /api/teachers - Create a new teacher
exports.createTeacher = async (req, res) => {
    try {
        const { teachername, mailid, subjects } = req.body;

        if (!teachername || !mailid || !subjects || subjects.length === 0) {
            return res.status(400).json({ message: "Missing required fields: teachername, mailid, or subjects." });
        }

        const teacherid = await generateTeacherId();

        const newTeacher = new Teacher({
            teacherid,
            teachername,
            mailid,
            subjects,
        });

        const savedTeacher = await newTeacher.save();

        // Emit event for socket broadcast
        teacherEmitter.emit('teacher_created', savedTeacher);

        res.status(201).json({
            message: "Teacher created successfully.",
            teacher: savedTeacher
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: "A teacher with this Mail ID or Teacher ID already exists." });
        }
        console.error('Error creating teacher:', error);
        res.status(500).json({ message: "Server error during teacher creation." });
    }
};

// GET /api/teachers - Retrieve all teachers
exports.getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find();
        res.status(200).json(teachers);
    } catch (err) {
        res.status(500).json({ message: "Error fetching teachers", details: err.message });
    }
};

// GET /api/teachers/:id - Retrieve a single teacher by MongoDB _id
exports.getTeacherById = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) return res.status(404).json({ message: "Teacher not found" });
        res.status(200).json(teacher);
    } catch (err) {
        res.status(500).json({ message: "Error fetching teacher", details: err.message });
    }
};

// PUT /api/teachers/:teacherid - Update a teacher's information
exports.updateTeacher = async (req, res) => {
    try {
        const { teacherid } = req.params;
        const updateData = req.body;

        // --- Improved Validation ---
        // 1. Prevent changing the unique teacherid
        if (updateData.teacherid && updateData.teacherid !== teacherid) {
            return res.status(400).json({ message: "Cannot change the teacher's ID." });
        }

        // 2. If a schedule_grid is being updated, validate its dimensions
        if (updateData.schedule_grid) {
            const grid = updateData.schedule_grid;
            if (!Array.isArray(grid) || grid.length !== 5 || grid.some(row => !Array.isArray(row) || row.length !== 6)) {
                return res.status(400).json({
                    message: "Invalid schedule_grid format. It must be a 5x6 array."
                });
            }
        }

        // Find the teacher by their custom `teacherid` and update them
        const updatedTeacher = await Teacher.findOneAndUpdate(
            { teacherid: teacherid },
            { $set: updateData },
            { new: true, runValidators: true } // Options: return the new version, run schema validators
        );

        if (!updatedTeacher) {
            return res.status(404).json({ message: `Teacher with ID '${teacherid}' not found.` });
        }

        res.status(200).json({
            message: "Teacher updated successfully.",
            teacher: updatedTeacher
        });

    } catch (error) {
        console.error('Error updating teacher:', error);
        if (error.code === 11000) {
            return res.status(409).json({ message: "Update failed: A teacher with this Mail ID already exists." });
        }
        // This will now handle schema validation errors more gracefully
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: `Validation Error: ${error.message}` });
        }
        res.status(500).json({ message: "Server error during teacher update." });
    }
};


// DELETE /api/teachers/:teacherid - Delete a teacher
exports.deleteTeacher = async (req, res) => {
    try {
        const { teacherid } = req.params;

        const deletedTeacher = await Teacher.findOneAndDelete({ teacherid: teacherid });

        if (!deletedTeacher) {
            return res.status(404).json({ message: `Teacher with ID '${teacherid}' not found.` });
        }


        res.status(200).json({
            message: `Teacher '${deletedTeacher.teachername}' (ID: ${teacherid}) was deleted successfully.`
        });

    } catch (error) {
        console.error('Error deleting teacher:', error);
        res.status(500).json({ message: "Server error during teacher deletion." });
    }
};