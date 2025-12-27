// frontend/src/context/useSchedule.js
import { useContext } from "react";
import { ScheduleContext } from "./ScheduleContext";

export const useSchedule = () => {
  const context = useContext(ScheduleContext);

  if (!context) {
    throw new Error(
      "useSchedule must be used inside a ScheduleProvider"
    );
  }

  return context;
};
