import React, { createContext, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";

export const OrganisationContext = createContext(null);

export const OrganisationProvider = ({ children }) => {
  const { isSignedIn } = useAuth();

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
        setLoading(true);
        setError(null);

        const res = await fetch("/api/organisations/my-organisations", {
          method: "GET",
          credentials: "include",   // ⬅️ REQUIRED
        });

        if (!res.ok) {
          throw new Error("Unauthorized");
        }

        const data = await res.json();
        const orgs = data.organisations || [];

        setOrganisations(orgs);

        const savedOrgId = localStorage.getItem("activeOrganisationId");

        if (savedOrgId) {
          const matchedOrg = orgs.find(
            (org) => org.organisationId === savedOrgId
          );
          setActiveOrganisation(matchedOrg || orgs[0] || null);
        } else {
          setActiveOrganisation(orgs[0] || null);
        }
      } catch (err) {
        console.error("Organisation fetch failed:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganisations();
  }, [isSignedIn]);   // ⬅️ ONLY THIS

  const setActiveOrganisationById = (organisationId) => {
    const org = organisations.find((o) => o.organisationId === organisationId);

    if (org) {
      setActiveOrganisation(org);
      localStorage.setItem("activeOrganisationId", organisationId);
    }
  };

  return (
    <OrganisationContext.Provider
      value={{
        organisations,
        activeOrganisation,
        setActiveOrganisationById,
        loading,
        error,
      }}
    >
      {children}
    </OrganisationContext.Provider>
  );
};
