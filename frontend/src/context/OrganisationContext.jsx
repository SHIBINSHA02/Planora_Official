import React, { createContext, useContext } from "react";

const OrganisationContext = createContext(null);

export const OrganisationProvider = ({ children }) => {
    // Later: derive from auth token
    const organisationId = "ORG1";

    return (
        <OrganisationContext.Provider value={{ organisationId }}>
            {children}
        </OrganisationContext.Provider>
    );
};

export const useOrganisation = () => {
    return useContext(OrganisationContext);
};
