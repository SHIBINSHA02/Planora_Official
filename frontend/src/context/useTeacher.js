// frontend/src/context/useTeacher.js
import { useContext } from "react";
import { TeacherContext } from "./TeacherContext";

export const useTeacher = () => {
  const ctx = useContext(TeacherContext);

  if (!ctx) {
    throw new Error(
      "useTeacher must be used inside TeacherProvider"
    );
  }

  return ctx;
};
