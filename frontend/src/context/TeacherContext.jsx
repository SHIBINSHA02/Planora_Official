// frontend/src/context/TeacherContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useOrganisation } from "./OrganisationContext";

const TeacherContext = createContext(null);

export const TeacherProvider = ({ children }) => {
    const { organisationId } = useOrganisation();
    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        if (!organisationId) return;

        axios.get("/api/teachers", {
            params: { organisationId },
            withCredentials: true
        })
            .then(res => setTeachers(res.data || []));
    }, [organisationId]);

    return (
        <TeacherContext.Provider value={{ teachers }}>
            {children}
        </TeacherContext.Provider>
    );
};

export const useTeachers = () => useContext(TeacherContext);
