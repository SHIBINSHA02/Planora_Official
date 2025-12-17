// frontend/src/context/ClassroomContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useOrganisation } from "./OrganisationContext";

const ClassroomContext = createContext(null);

export const ClassroomProvider = ({ children }) => {
    const { organisationId } = useOrganisation();
    const [classrooms, setClassrooms] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!organisationId) return;

        setLoading(true);
        axios.get("/api/classrooms", {
            params: { organisationId },
            withCredentials: true
        })
            .then(res => setClassrooms(res.data.data || []))
            .finally(() => setLoading(false));
    }, [organisationId]);

    return (
        <ClassroomContext.Provider value={{ classrooms, loading }}>
            {children}
        </ClassroomContext.Provider>
    );
};

export const useClassrooms = () => useContext(ClassroomContext);
