// frontend/src/context/useSchedule.js
import { useContext } from "react";
import { ScheduleContext } from "./ScheduleContext";

export const useSchedule = () => {
  const ctx = useContext(ScheduleContext);

  if (!ctx) {
    throw new Error(
      "useSchedule must be used inside ScheduleProvider"
    );
  }

  return ctx;
};
