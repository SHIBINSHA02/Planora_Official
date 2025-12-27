"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const ScheduleGridContext = createContext(null);

export const ScheduleGridProvider = ({
  children,
  scheduleData = [],
  days = [],
  periods = [],
}) => {
  /* ---------- Teachers (Now in Context) ---------- */
  const [teachers] = useState([
    { teacherId: "T001", teacherName: "John Mathew", subjects: ["Math", "Physics"] },
    { teacherId: "T002", teacherName: "Anna Thomas", subjects: ["English", "Social"] },
    { teacherId: "T003", teacherName: "Rahul Sharma", subjects: ["Chemistry", "Biology"] },
    { teacherId: "T004", teacherName: "Priya Menon", subjects: ["Computer Science"] },
  ]);

  /* ---------- Subjects (Now in Context) ---------- */
  const [subjects] = useState([
    "Math",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "Computer Science"
  ]);

  /* ---------- Build Initial Grid ---------- */
  const buildInitialGrid = () => {
    const g = days.map(() => periods.map(() => []));
    scheduleData.forEach((s) => {
      if (g[s.day] && g[s.day][s.period]) {
        g[s.day][s.period].push({
          teacherId: s.teacherId || "",
          subject: s.subject || "",
        });
      }
    });
    return g;
  };

  const [grid, setGrid] = useState(buildInitialGrid);

  useEffect(() => {
    setGrid(buildInitialGrid());
  }, [scheduleData, days, periods]);


  /* ---------- ADD ---------- */
  const addAssignment = (day, period) => {
    const newGrid = structuredClone(grid);
    newGrid[day][period].push({
      teacherId: "",
      subject: ""
    });
    setGrid(newGrid);
  };

  /* ---------- UPDATE ---------- */
  const updateAssignment = (day, period, index, key, value) => {
    const newGrid = structuredClone(grid);
    newGrid[day][period][index][key] = value;
    setGrid(newGrid);
  };

  /* ---------- DELETE ---------- */
  const deleteAssignment = (day, period, index) => {
    const newGrid = structuredClone(grid);
    newGrid[day][period].splice(index, 1);
    setGrid(newGrid);
  };

  return (
    <ScheduleGridContext.Provider
      value={{
        grid,
        days,
        periods,
        teachers,
        subjects,
        addAssignment,
        updateAssignment,
        deleteAssignment
      }}
    >
      {children}
    </ScheduleGridContext.Provider>
  );
};

export const useScheduleGrid = () => useContext(ScheduleGridContext);
