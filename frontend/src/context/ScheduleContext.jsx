// frontend/src/context/ScheduleContext.jsx
import { createContext, useState, useCallback, useEffect } from "react";
import axios from "axios";
import { useOrganisationContext } from "./useOrganisationContext";

export const ScheduleContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

export const ScheduleProvider = ({ children }) => {
  const [schedules, setSchedules] = useState({});
  const [teacherSchedules, setTeacherSchedules] = useState({});

  const { activeOrganisation } = useOrganisationContext();
  const organisationId = activeOrganisation?.organisationId;


  /* ================= CLASSROOM ================= */
  const fetchClassroomSchedule = useCallback(
    async (classroomId) => {
      if (!organisationId) return;

      const res = await axios.get(
        `${API_BASE}/api/schedule/classroom/${classroomId}`,
        { params: { organisationId } }
      );

      // schedule already includes teacherName now 🎉
      setSchedules(prev => ({
        ...prev,
        [classroomId]: res.data.schedule
      }));
    },
    [organisationId]
  );


  /* ================= TEACHER ================= */
  const fetchTeacherSchedule = useCallback(
    async (teacherId) => {
      if (!organisationId) return;

      const res = await axios.get(
        `${API_BASE}/api/schedule/teacher/${teacherId}`,
        { params: { organisationId } }
      );

      setTeacherSchedules(prev => ({
        ...prev,
        [teacherId]: res.data.schedule
      }));
    },
    [organisationId]
  );


  /* ================= CREATE / UPDATE SLOT ================= */
  const updateSlot = useCallback(
    async (payload) => {
      if (!organisationId) throw new Error("Organisation missing");

      // Don't allow empty saves — prevents 400 error
      if (!payload.teacherId || !payload.subject) {
        console.warn("Ignoring empty slot save");
        return;
      }

      await axios.post(`${API_BASE}/api/schedule`, {
        ...payload,
        organisationId
      });

      // Refresh classroom after saving
      if (payload.classroomId) {
        await fetchClassroomSchedule(payload.classroomId);
      }
    },
    [organisationId, fetchClassroomSchedule]   // <-- important
  );


  /* ================= RESET WHEN ORG CHANGES ================= */
  useEffect(() => {
    setSchedules({});
    setTeacherSchedules({});
  }, [organisationId]);


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
