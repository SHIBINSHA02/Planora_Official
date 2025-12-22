import { useContext } from "react";
import { OrganisationContext } from "./OrganisationContext";

export const useOrganisationContext = () => {
  const ctx = useContext(OrganisationContext);

  if (!ctx) {
    throw new Error(
      "useOrganisationContext must be used inside OrganisationProvider"
    );
  }

  return ctx;
};
