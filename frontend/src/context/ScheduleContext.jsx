import { createContext, useState, useCallback } from "react";
import axios from "axios";
import { useOrganisationContext } from "./useOrganisationContext";

export const ScheduleContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

export const ScheduleProvider = ({ children }) => {
  const [schedules, setSchedules] = useState({});
  const [teacherSchedules, setTeacherSchedules] = useState({});

  // ⛔ IMPORTANT: Get active organisation
  const { activeOrganisation } = useOrganisationContext();
  const organisationId = activeOrganisation?.organisationId;

  /* ================= CLASSROOM ================= */
  const fetchClassroomSchedule = useCallback(
    async (classroomId) => {
      if (!organisationId) {
        console.warn("❌ No organisation selected. Cannot fetch classroom schedule.");
        return;
      }

      const res = await axios.get(
        `${API_BASE}/api/schedule/classroom/${classroomId}`,
        {
          params: { organisationId },
          headers: { "Cache-Control": "no-cache" }
        }
      );

      setSchedules((prev) => ({
        ...prev,
        [classroomId]: res.data.schedule,
      }));
    },
    [organisationId]
  );

  /* ================= TEACHER ================= */
  const fetchTeacherSchedule = useCallback(
    async (teacherId) => {
      if (!organisationId) {
        console.warn("❌ No organisation selected. Cannot fetch teacher schedule.");
        return;
      }

      const res = await axios.get(
        `${API_BASE}/api/schedule/teacher/${teacherId}`,
        {
          params: { organisationId },
          headers: { "Cache-Control": "no-cache" }
        }
      );

      setTeacherSchedules((prev) => ({
        ...prev,
        [teacherId]: res.data.schedule,
      }));
    },
    [organisationId]
  );

  /* ================= UPDATE SLOT ================= */
  const updateSlot = async (payload) => {
    await axios.post(`${API_BASE}/api/schedule`, payload);
  };

  return (
    <ScheduleContext.Provider
      value={{
        schedules,
        teacherSchedules,
        fetchClassroomSchedule,
        fetchTeacherSchedule,
        updateSlot,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};
