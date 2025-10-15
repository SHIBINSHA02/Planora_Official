// frontend/src/Components/Classroom/classroom.jsx
import React, { useState } from "react";
import ClassroomScheduleView from "./ClassroomScheduleView.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";

// Mock data to replace backend API calls
const mockClassrooms = [
  { id: 1, name: "Class 1A", grade: "10", division: "A" },
  { id: 2, name: "Class 1B", grade: "10", division: "B" },
];

const mockTeachers = [
  { id: 1, teachername: "John Doe", subjects: ["Math", "Physics"], classes: ["10"] },
  { id: 2, teachername: "Jane Smith", subjects: ["English", "History"], classes: ["10"] },
];

const mockClassSchedules = {
  1: [
    [{ teacher_id: 1, subject: "Math" }, null, null, null, null, null],
    [null, { teacher_id: 2, subject: "English" }, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
  ],
  2: [
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
  ],
};

const mockTeacherSchedules = {
  1: [
    [{ classroomId: 1, subject: "Math" }, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
  ],
  2: [
    [null, { classroomId: 1, subject: "English" }, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
  ],
};

const Classroom = () => {
  const [selectedClassroom, setSelectedClassroom] = useState("");

  // Mock functions to replace backend API calls
  const getSubjectsForClass = (grade) => {
    return grade === "10" ? ["Math", "English", "Physics", "History"] : [];
  };

  const updateSchedule = (classroomId, dayIndex, periodIndex, teacherId, subject) => {
    console.log(`Updating schedule for classroom ${classroomId}, day ${dayIndex}, period ${periodIndex}: ${teacherId}, ${subject}`);
    return true; // Simulate successful update
  };

  const getAvailableTeachers = (classroomId, dayIndex, periodIndex, subject) => {
    return mockTeachers.filter(
      (teacher) =>
        teacher.subjects.includes(subject) &&
        !mockTeacherSchedules[teacher.id]?.[dayIndex]?.[periodIndex]
    );
  };

  const getTeachersForSubject = (grade, subject) => {
    return mockTeachers.filter(
      (teacher) => teacher.subjects.includes(subject) && teacher.classes.includes(grade)
    );
  };

  const isTeacherAvailable = (teacherId, dayIndex, periodIndex, classroomId) => {
    return !mockTeacherSchedules[teacherId]?.[dayIndex]?.[periodIndex];
  };

  const autoGenerateSchedule = (classroomId) => {
    console.log(`Auto-generating schedule for classroom ${classroomId}`);
    return Promise.resolve();
  };

  return (
    <ErrorBoundary>
      <ClassroomScheduleView
        classrooms={mockClassrooms}
        teachers={mockTeachers}
        classSchedules={mockClassSchedules}
        teacherSchedules={mockTeacherSchedules}
        selectedClassroom={selectedClassroom}
        setSelectedClassroom={setSelectedClassroom}
        updateSchedule={updateSchedule}
        getAvailableTeachers={getAvailableTeachers}
        getTeachersForSubject={getTeachersForSubject}
        getSubjectsForClass={getSubjectsForClass}
        isTeacherAvailable={isTeacherAvailable}
        autoGenerateSchedule={autoGenerateSchedule}
      />
    </ErrorBoundary>
  );
};

export default Classroom;