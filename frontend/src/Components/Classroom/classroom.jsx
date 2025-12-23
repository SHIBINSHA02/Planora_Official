// frontend/src/Components/Classroom/classroom.jsx
import React, { useEffect, useState } from "react";
import ClassroomScheduleView from "./ClassroomScheduleView";

import { useClassroomContext } from "../../context/useClassroomContext";
import { useTeacher } from "../../context/useTeacher";
import { useSchedule } from "../../context/useSchedule";

const Classroom = () => {
  const { classrooms, loading } = useClassroomContext();
  const { teachers } = useTeacher();
  const { schedules, fetchClassroomSchedule, updateSlot } = useSchedule();

  const [selectedClassroom, setSelectedClassroom] = useState(null);

  /* ================= RESET ON ORG CHANGE ================= */
  useEffect(() => {
    setSelectedClassroom(null);
  }, [classrooms]);

  /* ================= AUTO-SELECT FIRST ================= */
  useEffect(() => {
    if (!loading && classrooms.length > 0 && !selectedClassroom) {
      setSelectedClassroom(classrooms[0].classroomId);
    }
  }, [classrooms, loading, selectedClassroom]);

  /* ================= FETCH SCHEDULE ================= */
  useEffect(() => {
    if (selectedClassroom && !schedules[selectedClassroom]) {
      fetchClassroomSchedule(selectedClassroom);
    }
  }, [selectedClassroom, schedules, fetchClassroomSchedule]);

  /* ================= STATES ================= */
  if (loading) {
    return <p className="p-6">Loading classrooms...</p>;
  }

  if (classrooms.length === 0) {
    return <p className="p-6">No classrooms available</p>;
  }

  return (
    <div className="p-6 space-y-4">
      
      {/* ================= CLASSROOM SELECT ================= */}
      <select
        value={selectedClassroom || ""}
        onChange={(e) => setSelectedClassroom(e.target.value)}
        className="p-2 border rounded"
      >
        {classrooms.map((cls) => (
          <option key={cls.classroomId} value={cls.classroomId}>
            {cls.className}
          </option>
        ))}
      </select>

      {/* ================= SCHEDULE VIEW ================= */}
      {selectedClassroom && schedules[selectedClassroom] && (
        <ClassroomScheduleView
          classroomId={selectedClassroom}
          schedule={schedules[selectedClassroom]}
          teachers={teachers}
          onUpdateSlot={updateSlot}
        />
      )}
    </div>
  );
};

export default Classroom;
