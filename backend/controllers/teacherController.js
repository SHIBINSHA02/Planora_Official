// backend/controllers/teacherController.js

const Teacher = require('../models/Teacher');

const ScheduleSlot = require('../models/ScheduleSlot');
const Counter = require('../models/counter');
const EventEmitter = require('events');

const teacherEmitter = new EventEmitter();
exports.teacherEmitter = teacherEmitter;

/* ================= ID GENERATOR ================= */

const generateTeacherId = async () => {
    const counter = await Counter.findOneAndUpdate(
        { _id: 'teacherid' },
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
    );
    return `T-${counter.sequence_value}`;
};

/* ================= CREATE ================= */

exports.createTeacher = async (req, res) => {
    try {
        const { organisationId, teachername, mailid, subjects } = req.body;

        if (!organisationId || !teachername || !mailid || !subjects?.length) {
            return res.status(400).json({
                message: "organisationId, teachername, mailid, subjects are required"
            });
        }

        const teacherid = await generateTeacherId();

        const teacher = await Teacher.create({
            organisationId,
            teacherId: teacherid,
            teacherName: teachername,
            email: mailid,
            subjects
        });

        teacherEmitter.emit('teacher_created', teacher);

        res.status(201).json({
            message: "Teacher created successfully",
            teacher
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Teacher with this email or ID already exists"
            });
        }
        res.status(500).json({ message: "Server error", error });
    }
};

/* ================= READ (ORG SCOPED) ================= */

exports.getAllTeachers = async (req, res) => {
    try {
        const { organisationId } = req.query;

        if (!organisationId) {
            return res.status(400).json({
                message: "organisationId is required"
            });
        }

        const teachers = await Teacher.find({ organisationId });
        res.status(200).json(teachers);

    } catch (error) {
        res.status(500).json({ message: "Error fetching teachers" });
    }
};

exports.getTeacherById = async (req, res) => {
    try {
        const { teacherid } = req.params;
        const { organisationId } = req.query;

        const teacher = await Teacher.findOne({ teacherId: teacherid, organisationId });

        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        res.status(200).json(teacher);

    } catch (error) {
        res.status(500).json({ message: "Error fetching teacher" });
    }
};



exports.updateTeacher = async (req, res) => {
    try {
        const { teacherid } = req.params;
        const { organisationId } = req.body;

        if (!organisationId) {
            return res.status(400).json({ message: "organisationId required" });
        }

       
        delete req.body.teacherId;
        delete req.body.teacherid;

        const updated = await Teacher.findOneAndUpdate(
            { teacherId: teacherid, organisationId },
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        res.status(200).json({
            message: "Teacher updated successfully",
            teacher: updated
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: "Duplicate email detected" });
        }
        res.status(500).json({ message: "Update failed", error });
    }
};

/* ================= DELETE ================= */

exports.deleteTeacher = async (req, res) => {
    try {
        const { teacherid } = req.params;
        const { organisationId } = req.query;

        const deleted = await Teacher.findOneAndDelete({
            teacherId: teacherid,
            organisationId
        });

        if (!deleted) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        // 🔥 CLEAN UP SCHEDULE SLOTS
        await ScheduleSlot.deleteMany({
            teacherId: teacherid,
            organisationId
        });

        res.status(200).json({
            message: `Teacher ${deleted.teacherName} deleted successfully`
        });

    } catch (error) {
        res.status(500).json({ message: "Delete failed", error });
    }
};
