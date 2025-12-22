// frontend/src/context/useClassroom.js
import { useContext } from "react";
import { ClassroomContext } from "./ClassroomContext";

export const useClassroom = () => {
  const ctx = useContext(ClassroomContext);

  if (!ctx) {
    throw new Error(
      "useClassroom must be used inside ClassroomProvider"
    );
  }

  return ctx;
};
