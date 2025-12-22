import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useOrganisationContext } from "./useOrganisationContext";

export const ClassroomContext = createContext(null);

export const ClassroomProvider = ({ children }) => {
  const { activeOrganisation } = useOrganisationContext();
  const organisationId = activeOrganisation?.organisationId;

  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!organisationId) return;

    setLoading(true);
    setError(null);

    axios
      .get("/api/classrooms", {
        params: { organisationId },
        withCredentials: true,
      })
      .then((res) => {
        setClassrooms(res.data?.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch classrooms", err);
        setError("Failed to load classrooms");
      })
      .finally(() => setLoading(false));
  }, [organisationId]);

  return (
    <ClassroomContext.Provider
      value={{
        classrooms,
        loading,
        error,
      }}
    >
      {children}
    </ClassroomContext.Provider>
  );
};
