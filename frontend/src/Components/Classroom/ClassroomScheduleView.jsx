"use client";

import React, { useState, useEffect } from "react";
import ClassroomScheduleTable from "../tables/ClassroomScheduleTable";
import { ScheduleGridProvider } from "../../context/ScheduleGridContexttemp";

const ClassroomScheduleView = ({ selectedClassroom }) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const periods = ["P1", "P2", "P3", "P4", "P5"];

  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    setSchedule([
      { day: 0, period: 0, teacherId: "T001", subject: "Math" },
      { day: 0, period: 0, teacherId: "T002", subject: "Physics" },
      { day: 2, period: 3, teacherId: "T004", subject: "Computer Science" },
    ]);
  }, [selectedClassroom]);


  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">
        Timetable for Classroom: {selectedClassroom}
      </h2>

      <ScheduleGridProvider
        scheduleData={schedule}
        days={days}
        periods={periods}
      >
        <ClassroomScheduleTable />
      </ScheduleGridProvider>
    </div>
  );
};

export default ClassroomScheduleView;
