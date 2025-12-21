// frontend/src/context/OrganisationContext.jsx

// frontend/src/context/OrganisationContext.jsx
import React, { createContext, useContext, useState } from "react";

const OrganisationContext = createContext(null);

export const OrganisationProvider = ({ children }) => {
    // 1. Move to state so it can be changed
    const [organisationId, setOrganisationId] = useState("ORG1");

    return (
        // 2. Include the setter function in the Provider value
        <OrganisationContext.Provider value={{ organisationId, setOrganisationId }}>
            {children}
        </OrganisationContext.Provider>
    );
};

export const useOrganisation = () => useContext(OrganisationContext);