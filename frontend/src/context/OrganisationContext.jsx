import React, { createContext, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";

/**
 * ✅ CONTEXT MUST BE EXPORTED
 */
export const OrganisationContext = createContext(null);

export const OrganisationProvider = ({ children }) => {
  const { isSignedIn, getToken } = useAuth();

  const [organisations, setOrganisations] = useState([]);
  const [activeOrganisation, setActiveOrganisation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isSignedIn) {
      setOrganisations([]);
      setActiveOrganisation(null);
      setLoading(false);
      return;
    }

    const fetchOrganisations = async () => {
      try {
        const token = await getToken();

        const res = await fetch(
          "/api/organisations/my-organisations",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Unauthorized");
        }

        const data = await res.json();

        setOrganisations(data.organisations || []);
        setActiveOrganisation(data.organisations?.[0] || null);
      } catch (err) {
        console.error("Organisation fetch failed:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganisations();
  }, [isSignedIn, getToken]);

  return (
    <OrganisationContext.Provider
      value={{
        organisations,
        activeOrganisation,
        setActiveOrganisation,
        loading,
        error,
      }}
    >
      {children}
    </OrganisationContext.Provider>
  );
};
