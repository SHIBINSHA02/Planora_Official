// frontend/src/context/ScheduleContext.jsx
import { createContext, useState, useCallback } from "react";
import axios from "axios";

export const ScheduleContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

export const ScheduleProvider = ({ children }) => {
  const [schedules, setSchedules] = useState({});
  const [teacherSchedules, setTeacherSchedules] = useState({});

  /* ================= CLASSROOM ================= */

  const fetchClassroomSchedule = useCallback(async (classroomId) => {
    const res = await axios.get(
      `${API_BASE}/api/schedule/classroom/${classroomId}`
    );

    setSchedules(prev => ({
      ...prev,
      [classroomId]: res.data.schedule
    }));
  }, []);

  /* ================= TEACHER ================= */

  const fetchTeacherSchedule = useCallback(async (teacherId, organisationId) => {
    const res = await axios.get(
      `${API_BASE}/api/schedule/teacher/${teacherId}`,
      { params: { organisationId } }
    );

    setTeacherSchedules(prev => ({
      ...prev,
      [teacherId]: res.data.schedule
    }));
  }, []);

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
        updateSlot
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};
