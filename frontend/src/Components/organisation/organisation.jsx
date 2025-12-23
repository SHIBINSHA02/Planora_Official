// frontend/src/Components/organisation/organisation.jsx
// frontend/src/Components/organisation/organisation.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import Navigation from "../Navigation/Navigation";
import Footer from "../Footer/Footer";
import OrganisationOnboarding from "./OrganisationOnboarding";

const OrganisationPage = () => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;
  if (!isSignedIn) return <Navigate to="/login" replace />;

  return (
    <>
      <Navigation />
      <OrganisationOnboarding />
      <Footer />
    </>
  );
};

export default OrganisationPage
