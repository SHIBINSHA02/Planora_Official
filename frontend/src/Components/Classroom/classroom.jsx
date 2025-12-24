import React, { useEffect, useState } from "react";
import ClassroomScheduleView from "./ClassroomScheduleView";

import { useClassroomContext } from "../../context/useClassroomContext";
import { useTeacher } from "../../context/useTeacher";

const Classroom = () => {
  const { classrooms, loading } = useClassroomContext();
  const { teachers } = useTeacher();

  const [selectedClassroom, setSelectedClassroom] = useState(null);

  /* ================= RESET ON CLASSROOM LIST CHANGE ================= */
  useEffect(() => {
    setSelectedClassroom(null);
  }, [classrooms]);

  /* ================= AUTO SELECT FIRST CLASSROOM ================= */
  useEffect(() => {
    if (!loading && classrooms.length > 0 && !selectedClassroom) {
      setSelectedClassroom(classrooms[0].classroomId);
    }
  }, [classrooms, loading, selectedClassroom]);

  if (loading) {
    return <p className="p-6">Loading classrooms...</p>;
  }

  if (classrooms.length === 0) {
    return <p className="p-6">No classrooms available</p>;
  }

  return (
    <div className="p-6 space-y-4">
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

      {selectedClassroom && (
        <ClassroomScheduleView
          classrooms={classrooms}
          selectedClassroom={selectedClassroom}
          teachers={teachers}
        />
      )}
    </div>
  );
};

export default Classroom;
