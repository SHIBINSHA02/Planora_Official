// backend/scripts/seedTemplateData.js

const mongoose = require("mongoose");

// FORCE load correct .env from backend root even if script runs inside /scripts
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const Organisation = require("../models/organisation");
const Teacher = require("../models/Teacher");
const Classroom = require("../models/classroomModel");
const ScheduleSlot = require("../models/ScheduleSlot");

async function seed() {
  try {
    console.log("🔌 Connecting to DB...");
    console.log("DB URI =>", process.env.MongoDB); // Debug helper

    if (!process.env.MongoDB) {
      throw new Error("❌ MongoDB ENV missing. Add MongoDB=... in backend/.env");
    }

    await mongoose.connect(process.env.MongoDB);

    /* ================= CLEAN OLD DATA ================= */
    await Promise.all([
      Organisation.deleteMany({}),
      Teacher.deleteMany({}),
      Classroom.deleteMany({}),
      ScheduleSlot.deleteMany({}),
    ]);

    console.log("🧹 Old data cleared");

    /* ================= ORGANISATIONS ================= */
    await Organisation.insertMany([
      {
        organisationId: "ORG1",
        organisationName: "Planora Demo College",
        adminName: "admin1@planora.com",
      },
      {
        organisationId: "ORG2",
        organisationName: "Planora Tech Institute",
        adminName: "admin2@planora.com",
      },
    ]);

    console.log("🏫 Organisations created");

    /* ================= TEACHERS (GLOBAL) ================= */
    await Teacher.insertMany(
      [
        {
          teacherId: "T-1",
          teacherName: "Alice Johnson",
          email: "alice@college.com",
          subjects: ["Maths", "Physics"],
          organisations: ["ORG1"],
        },
        {
          teacherId: "T-2",
          teacherName: "Bob Smith",
          email: "bob@college.com",
          subjects: ["Chemistry"],
          organisations: ["ORG1", "ORG2"],
        },
        {
          teacherId: "T-3",
          teacherName: "Clara Lee",
          email: "clara@college.com",
          subjects: ["Computer Science"],
          organisations: ["ORG2"],
        },
        {
          teacherId: "T-4",
          teacherName: "David Park",
          email: "david@college.com",
          subjects: ["Physics"],
          organisations: ["ORG1", "ORG2"],
        },
      ],
      { ordered: false }
    );

    console.log("👩‍🏫 Teachers created");

    /* ================= CLASSROOMS (4 EACH ORG) ================= */
    await Classroom.insertMany(
      [
        /* ---- ORG1 ---- */
        {
          organisationId: "ORG1",
          classroomId: "ORG1-C1",
          className: "CSE A",
          department: "CSE",
          subjects: [
            { subject: "Maths", defaultTeacherId: "T-1", weeklyHours: 4 },
            { subject: "Physics", defaultTeacherId: "T-4", weeklyHours: 3 },
          ],
        },
        {
          organisationId: "ORG1",
          classroomId: "ORG1-C2",
          className: "CSE B",
          department: "CSE",
          subjects: [
            { subject: "Chemistry", defaultTeacherId: "T-2", weeklyHours: 3 },
          ],
        },
        {
          organisationId: "ORG1",
          classroomId: "ORG1-C3",
          className: "EEE A",
          department: "EEE",
          subjects: [
            { subject: "Physics", defaultTeacherId: "T-4", weeklyHours: 4 },
          ],
        },
        {
          organisationId: "ORG1",
          classroomId: "ORG1-C4",
          className: "ME A",
          department: "Mechanical",
          subjects: [
            { subject: "Maths", defaultTeacherId: "T-1", weeklyHours: 4 },
          ],
        },

        /* ---- ORG2 ---- */
        {
          organisationId: "ORG2",
          classroomId: "ORG2-C1",
          className: "IT A",
          department: "IT",
          subjects: [
            { subject: "CS", defaultTeacherId: "T-3", weeklyHours: 5 },
          ],
        },
        {
          organisationId: "ORG2",
          classroomId: "ORG2-C2",
          className: "IT B",
          department: "IT",
          subjects: [
            { subject: "Chemistry", defaultTeacherId: "T-2", weeklyHours: 3 },
          ],
        },
        {
          organisationId: "ORG2",
          classroomId: "ORG2-C3",
          className: "ECE A",
          department: "ECE",
          subjects: [
            { subject: "Physics", defaultTeacherId: "T-4", weeklyHours: 4 },
          ],
        },
        {
          organisationId: "ORG2",
          classroomId: "ORG2-C4",
          className: "AI A",
          department: "AI",
          subjects: [
            { subject: "CS", defaultTeacherId: "T-3", weeklyHours: 5 },
          ],
        },
      ],
      { ordered: false }
    );

    console.log("🏷️ Classrooms created");

    /* ================= SCHEDULE SLOTS ================= */
    await ScheduleSlot.insertMany(
      [
        /* ORG1 */
        {
          organisationId: "ORG1",
          classroomId: "ORG1-C1",
          teacherId: "T-1",
          subject: "Maths",
          day: 0,
          period: 0,
        },
        {
          organisationId: "ORG1",
          classroomId: "ORG1-C2",
          teacherId: "T-2",
          subject: "Chemistry",
          day: 1,
          period: 2,
        },

        /* ORG2 */
        {
          organisationId: "ORG2",
          classroomId: "ORG2-C1",
          teacherId: "T-3",
          subject: "CS",
          day: 0,
          period: 1,
        },
        {
          organisationId: "ORG2",
          classroomId: "ORG2-C3",
          teacherId: "T-4",
          subject: "Physics",
          day: 2,
          period: 3,
        },
      ],
      { ordered: false }
    );

    console.log("📅 Schedule slots created");

    console.log("✅ SEEDING COMPLETED SUCCESSFULLY");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
