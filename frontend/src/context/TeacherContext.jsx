import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useOrganisationContext } from "./useOrganisationContext";

export const TeacherContext = createContext(null);

export const TeacherProvider = ({ children }) => {
  const { activeOrganisation } = useOrganisationContext();
  const organisationId = activeOrganisation?.organisationId;

  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!organisationId) return;

    setLoading(true);
    setError(null);

    axios
      .get("/api/teachers", {
        params: { organisationId },
        withCredentials: true,
      })
      .then((res) => {
        setTeachers(res.data?.teachers || []);
      })
      .catch((err) => {
        console.error("Failed to fetch teachers", err);
        setError("Failed to load teachers");
      })
      .finally(() => setLoading(false));
  }, [organisationId]);

  return (
    <TeacherContext.Provider
      value={{
        teachers,
        loading,
        error,
      }}
    >
      {children}
    </TeacherContext.Provider>
  );
};
