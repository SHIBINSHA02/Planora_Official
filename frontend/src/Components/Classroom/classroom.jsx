import React, { useEffect, useState } from "react";
import ClassroomScheduleView from "./ClassroomScheduleView";
import { useClassrooms } from "../../context/ClassroomContext";
import { useTeachers } from "../../context/TeacherContext";
import { useSchedule } from "../../context/ScheduleContext";

const Classroom = () => {
  const { classrooms } = useClassrooms();
  const { teachers } = useTeachers();
  const { schedules, fetchClassroomSchedule, updateSlot } = useSchedule();

  const [selectedClassroom, setSelectedClassroom] = useState("");

  useEffect(() => {
    if (classrooms.length > 0) {
      setSelectedClassroom(classrooms[0].classroomId);
    }
  }, [classrooms]);

  useEffect(() => {
    if (selectedClassroom) {
      fetchClassroomSchedule(selectedClassroom);
    }
  }, [selectedClassroom]);

  return (
    <div className="p-6">
      <select
        value={selectedClassroom}
        onChange={(e) => setSelectedClassroom(e.target.value)}
      >
        {classrooms.map(cls => (
          <option key={cls.classroomId} value={cls.classroomId}>
            {cls.className}
          </option>
        ))}
      </select>

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
