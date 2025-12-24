import React, { useEffect } from "react";
import PropTypes from "prop-types";
import ClassroomScheduleTable from "../tables/ClassroomScheduleTable";
import { useSchedule } from "../../context/useSchedule";

const ClassroomScheduleView = ({
  classrooms = [],
  selectedClassroom,
  teachers = []
}) => {
  const { schedules, fetchClassroomSchedule, updateSlot } = useSchedule();

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const periods = [
    "Period 1",
    "Period 2",
    "Period 3",
    "Period 4",
    "Period 5",
    "Period 6"
  ];

  /* ================= FETCH ONLY IF NOT CACHED ================= */
  useEffect(() => {
    if (selectedClassroom && !schedules[selectedClassroom]) {
      fetchClassroomSchedule(selectedClassroom);
    }
  }, [selectedClassroom, schedules, fetchClassroomSchedule]);

  /* ================= FIND CURRENT CLASSROOM ================= */
  const currentClassroom = classrooms.find(
    c => c.classroomId === selectedClassroom
  );

  if (!classrooms.length || !currentClassroom) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <div className="w-8 h-8 mb-4 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
        <p>Loading classroom configuration...</p>
      </div>
    );
  }

  const availableSubjects =
    currentClassroom.subjects?.map(s => s.subject) || [];

  /* ================= UPDATE SLOT ================= */
  const onUpdateSchedule = async (dayIndex, periodIndex, updatedAssignments) => {
    await updateSlot({
      organisationId: currentClassroom.organisationId,
      classroomId: selectedClassroom,
      teacherId: updatedAssignments.teacherId,
      subject: updatedAssignments.subject,
      day: dayIndex,
      period: periodIndex
    });
  };

  return (
    <div className="mt-6 space-y-6">
      <ClassroomScheduleTable
        scheduleData={schedules[selectedClassroom] || []}
        days={days}
        periods={periods}
        teachers={teachers}
        subjects={availableSubjects}
        onUpdateSchedule={onUpdateSchedule}
      />

      <div className="font-semibold text-center text-blue-500">
        <div className="flex items-center justify-end text-xs text-white no-print">
          <button
            onClick={() => window.print()}
            className="m-5 px-5 py-3 bg-[#4F46E5] rounded-lg hover:bg-[#4338CA] text-white"
          >
            Print Schedule
          </button>
        </div>

        <p className="text-sm italic text-gray-600 m-14">
          Organisation: <strong>{currentClassroom.organisationId}</strong> |{" "}
          Room:{" "}
          <strong>
            {currentClassroom.className} ({selectedClassroom})
          </strong>
        </p>
      </div>
    </div>
  );
};

ClassroomScheduleView.propTypes = {
  classrooms: PropTypes.array.isRequired,
  selectedClassroom: PropTypes.string.isRequired,
  teachers: PropTypes.array
};

export default ClassroomScheduleView;
