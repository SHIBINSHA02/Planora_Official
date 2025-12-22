import React, { useEffect, useState } from "react";
import ClassroomScheduleView from "./ClassroomScheduleView";

import { useClassroom } from "../../context/useClassroom";
import { useTeacher } from "../../context/useTeacher";
import { useSchedule } from "../../context/useSchedule";

const Classroom = () => {
  const { classrooms } = useClassroom();
  const { teachers } = useTeacher();
  const { schedules, fetchClassroomSchedule, updateSlot } = useSchedule();

  const [selectedClassroom, setSelectedClassroom] = useState("");

  // Auto-select first classroom
  useEffect(() => {
    if (classrooms.length > 0) {
      setSelectedClassroom(classrooms[0].classroomId);
    }
  }, [classrooms]);

  // Fetch schedule when classroom changes
  useEffect(() => {
    if (selectedClassroom) {
      fetchClassroomSchedule(selectedClassroom);
    }
  }, [selectedClassroom, fetchClassroomSchedule]);

  return (
    <div className="p-6">
      {/* Classroom Selector */}
      <select
        value={selectedClassroom}
        onChange={(e) => setSelectedClassroom(e.target.value)}
        className="p-2 mb-4 border rounded"
      >
        {classrooms.map((cls) => (
          <option key={cls.classroomId} value={cls.classroomId}>
            {cls.className}
          </option>
        ))}
      </select>

      {/* Schedule View */}
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
