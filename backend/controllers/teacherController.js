// backend/controllers/teacherController.js
const Teacher = require('../models/Teacher');
const EventEmitter = require('events');

// Create an internal event emitter to signal new teacher creation
const teacherEmitter = new EventEmitter();
exports.teacherEmitter = teacherEmitter;

/**
 * NOTE: This is a simple, non-production-safe ID generation. 
 * In a real application, use atomic operations or UUIDs.
 */
const generateTeacherId = async () => {
    const lastTeacher = await Teacher.findOne({}).sort({ teacherid: -1 }).limit(1);
    let newIdNumber = 101; 

    if (lastTeacher && lastTeacher.teacherid) {
        const lastNumber = parseInt(lastTeacher.teacherid.replace('T-', ''));
        newIdNumber = lastNumber + 1;
    }

    return `T-${newIdNumber}`;
};

// Controller function to handle POST /api/teachers
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

// Optional: add more handlers (these do not change your create logic)
exports.getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find();
        res.status(200).json(teachers);
    } catch (err) {
        res.status(500).json({ message: "Error fetching teachers", details: err.message });
    }
};

exports.getTeacherById = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) return res.status(404).json({ message: "Teacher not found" });
        res.status(200).json(teacher);
    } catch (err) {
        res.status(500).json({ message: "Error fetching teacher", details: err.message });
    }
};
