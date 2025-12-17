// backend/scripts/seedTemplateData.js
// backend/scripts/seedTemplateData.js

const mongoose = require("mongoose");
require("dotenv").config();

const Organisation = require("../models/organisation");
const Teacher = require("../models/Teacher");
const Classroom = require("../models/classroomModel");
const ScheduleSlot = require("../models/ScheduleSlot");

async function seed() {
    try {
        console.log("🔌 Connecting to DB...");
        await mongoose.connect("mongodb://localhost:27017/planora_official");

        /* ================= CLEAN OLD DATA ================= */

        await Promise.all([
            Organisation.deleteMany({}),
            Teacher.deleteMany({}),
            Classroom.deleteMany({}),
            ScheduleSlot.deleteMany({})
        ]);

        console.log("🧹 Old data cleared");

        /* ================= ORGANISATION ================= */

        const organisation = await Organisation.create({
            organisationId: "ORG1",
            organisationName: "Planora Demo College"
        });

        console.log("🏫 Organisation created");

        /* ================= TEACHERS ================= */

        const teachers = await Teacher.insertMany([
            {
                organisationId: "ORG1",
                teacherId: "T-1",
                teacherName: "Alice Johnson",
                email: "alice@college.edu",
                subjects: ["Maths", "Physics"]
            },
            {
                organisationId: "ORG1",
                teacherId: "T-2",
                teacherName: "Bob Smith",
                email: "bob@college.edu",
                subjects: ["Chemistry"]
            },
            {
                organisationId: "ORG1",
                teacherId: "T-3",
                teacherName: "Clara Lee",
                email: "clara@college.edu",
                subjects: ["Computer Science"]
            }
        ]);

        console.log("👩‍🏫 Teachers created");

        /* ================= CLASSROOMS ================= */

        const classrooms = await Classroom.insertMany([
            {
                organisationId: "ORG1",
                classroomId: "CSE-A",
                className: "Computer Science A",
                department: "CSE",
                subjects: [
                    { subject: "Maths", defaultTeacherId: "T-1", weeklyHours: 4 },
                    { subject: "CS", defaultTeacherId: "T-3", weeklyHours: 5 }
                ]
            },
            {
                organisationId: "ORG1",
                classroomId: "CSE-B",
                className: "Computer Science B",
                department: "CSE",
                subjects: [
                    { subject: "Physics", defaultTeacherId: "T-1", weeklyHours: 3 },
                    { subject: "Chemistry", defaultTeacherId: "T-2", weeklyHours: 3 }
                ]
            }
        ]);

        console.log("🏷️ Classrooms created");

        /* ================= SCHEDULE SLOTS ================= */

        await ScheduleSlot.insertMany([
            // Monday Period 1 (parallel allowed)
            {
                organisationId: "ORG1",
                classroomId: "CSE-A",
                teacherId: "T-1",
                subject: "Maths",
                day: 0,
                period: 0
            },
            {
                organisationId: "ORG1",
                classroomId: "CSE-A",
                teacherId: "T-3",
                subject: "CS",
                day: 0,
                period: 0
            },

            // Tuesday Period 3
            {
                organisationId: "ORG1",
                classroomId: "CSE-B",
                teacherId: "T-2",
                subject: "Chemistry",
                day: 1,
                period: 2
            },

            // Same teacher, same time, different classroom (allowed)
            {
                organisationId: "ORG1",
                classroomId: "CSE-A",
                teacherId: "T-1",
                subject: "Physics",
                day: 1,
                period: 2
            }
        ]);

        console.log("📅 Schedule slots created");

        console.log("✅ SEEDING COMPLETED SUCCESSFULLY");
        process.exit(0);

    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
}

seed();
