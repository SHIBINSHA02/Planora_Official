// frontend/src/context/useClassroomContext.js
import { useContext } from "react";
import { ClassroomContext } from "./ClassroomContext";

export const useClassroomContext = () => {
  const context = useContext(ClassroomContext);

  if (!context) {
    throw new Error(
      "useClassroomContext must be used inside ClassroomProvider"
    );
  }

  return context;
};
