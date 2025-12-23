// frontend/src/context/ScheduleContext.jsx
import React, { createContext, useState } from "react";
import axios from "axios";
import { useOrganisationContext } from "./useOrganisationContext";

export const ScheduleContext = createContext(null);

export const ScheduleProvider = ({ children }) => {
  const { activeOrganisation } = useOrganisationContext();

  const organisationId = activeOrganisation?.organisationId;

  const [schedules, setSchedules] = useState({});

  /**
   * Fetch schedule for a classroom
   */
  const fetchClassroomSchedule = async (classroomId) => {
    if (!organisationId || !classroomId) return;

    // cache check
    if (schedules[classroomId]) return;

    const res = await axios.get(
      `/api/schedules/classroom/${classroomId}`,
      {
        params: { organisationId },
        withCredentials: true,
      }
    );

    setSchedules((prev) => ({
      ...prev,
      [classroomId]: res.data.schedule,
    }));
  };

  /**
   * Update a single slot
   */
  const updateSlot = async ({
    classroomId,
    teacherId,
    subject,
    day,
    period,
  }) => {
    if (!organisationId) return;

    await axios.post(
      "/api/schedules",
      {
        organisationId,
        classroomId,
        teacherId,
        subject,
        day,
        period,
      },
      { withCredentials: true }
    );

    // re-fetch (source of truth)
    setSchedules((prev) => {
      const copy = { ...prev };
      delete copy[classroomId];
      return copy;
    });

    await fetchClassroomSchedule(classroomId);
  };

  return (
    <ScheduleContext.Provider
      value={{
        schedules,
        fetchClassroomSchedule,
        updateSlot,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};
