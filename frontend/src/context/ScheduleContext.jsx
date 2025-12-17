// frontend/src/context/ScheduleContext.jsx
import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { useOrganisation } from "./OrganisationContext";

const ScheduleContext = createContext(null);

export const ScheduleProvider = ({ children }) => {
    const { organisationId } = useOrganisation();
    const [schedules, setSchedules] = useState({});

    const fetchClassroomSchedule = async (classroomId) => {
        if (!classroomId || schedules[classroomId]) return;

        const res = await axios.get(
            `/api/schedules/classroom/${classroomId}`,
            { params: { organisationId }, withCredentials: true }
        );

        setSchedules(prev => ({
            ...prev,
            [classroomId]: res.data.schedule
        }));
    };

    const updateSlot = async ({ classroomId, teacherId, subject, day, period }) => {
        await axios.post("/api/schedules", {
            organisationId,
            classroomId,
            teacherId,
            subject,
            day,
            period
        }, { withCredentials: true });

        // Re-fetch classroom schedule (source of truth)
        await fetchClassroomSchedule(classroomId);
    };

    return (
        <ScheduleContext.Provider value={{
            schedules,
            fetchClassroomSchedule,
            updateSlot
        }}>
            {children}
        </ScheduleContext.Provider>
    );
};

export const useSchedule = () => useContext(ScheduleContext);
