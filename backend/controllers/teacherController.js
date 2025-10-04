const Teacher = require('../models/Teacher');

/**
 * NOTE: This is a simple, non-production-safe ID generation. 
 * In a real application, use atomic operations or UUIDs.
 */
const generateTeacherId = async () => {
    // Find the teacher with the highest numerical ID and increment it
    const lastTeacher = await Teacher.findOne({}).sort({ teacherid: -1 }).limit(1);
    let newIdNumber = 101; 

    if (lastTeacher && lastTeacher.teacherid) {
        // Example: 'T-105' -> 105
        const lastNumber = parseInt(lastTeacher.teacherid.replace('T-', ''));
        newIdNumber = lastNumber + 1;
    }

    return `T-${newIdNumber}`;
};

// Controller function to handle POST /api/teachers
exports.createTeacher = async (req, res) => {
    try {
        const { teachername, mailid, subjects } = req.body;

        // Basic input validation
        if (!teachername || !mailid || !subjects || subjects.length === 0) {
            return res.status(400).json({ message: "Missing required fields: teachername, mailid, or subjects." });
        }

        // Generate the unique teacher ID
        const teacherid = await generateTeacherId();

        // Create the new teacher document (schedule_grid uses the default empty array)
        const newTeacher = new Teacher({
            teacherid,
            teachername,
            mailid,
            subjects,
        });

        const savedTeacher = await newTeacher.save();

        res.status(201).json({ 
            message: "Teacher created successfully.",
            teacher: savedTeacher 
        });

    } catch (error) {
        // Handle MongoDB duplicate key error (11000) for mailid
        if (error.code === 11000) { 
            return res.status(409).json({ message: "A teacher with this Mail ID or Teacher ID already exists." });
        }
        console.error('Error creating teacher:', error);
        res.status(500).json({ message: "Server error during teacher creation." });
    }
};
