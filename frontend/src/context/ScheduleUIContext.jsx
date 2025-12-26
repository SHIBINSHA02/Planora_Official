// frontend/src/context/ScheduleUIContext.jsx
import React, { createContext, useContext, useState } from "react";

const ScheduleUIContext = createContext(null);

export const ScheduleUIProvider = ({ children }) => {
  const [hoveredTeacher, setHoveredTeacher] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  const showTeacherPreview = (teacher, position) => {
    setHoveredTeacher(teacher);
    setHoverPosition(position);
  };

  const hideTeacherPreview = () => {
    setHoveredTeacher(null);
  };

  return (
    <ScheduleUIContext.Provider
      value={{
        hoveredTeacher,
        hoverPosition,
        showTeacherPreview,
        hideTeacherPreview
      }}
    >
      {children}
    </ScheduleUIContext.Provider>
  );
};

export const useScheduleUI = () => {
  const ctx = useContext(ScheduleUIContext);
  if (!ctx) {
    throw new Error("useScheduleUI must be used inside ScheduleUIProvider");
  }
  return ctx;
};
