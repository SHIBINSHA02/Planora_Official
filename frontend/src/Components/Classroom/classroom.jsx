// frontend/src/Components/Classroom/classroom.jsx
"use client";

import React, { useEffect, useState } from "react";
import ClassroomScheduleView from "./ClassroomScheduleView";

const Classroom = () => {
  const classrooms = [
    { classroomId: "C101", classroomName: "Class 10 A" },
    { classroomId: "C102", classroomName: "Class 10 B" },
  ];

  const [selectedClassroom, setSelectedClassroom] = useState(null);

  useEffect(() => {
    if (!selectedClassroom && classrooms.length > 0) {
      setSelectedClassroom(classrooms[0].classroomId);
    }
  }, [classrooms, selectedClassroom]);

  return (
    <div className="p-6 space-y-4">
      <select
        value={selectedClassroom || ""}
        onChange={(e) => setSelectedClassroom(e.target.value)}
        className="p-2 border rounded"
      >
        {classrooms.map((cls) => (
          <option key={cls.classroomId} value={cls.classroomId}>
            {cls.classroomName}
          </option>
        ))}
      </select>

      {selectedClassroom && (
        <ClassroomScheduleView selectedClassroom={selectedClassroom} />
      )}
    </div>
  );
};

export default Classroom;
