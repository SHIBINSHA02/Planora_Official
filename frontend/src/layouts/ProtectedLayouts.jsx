// frontend/src/layouts/ProtectedLayouts.jsx
// frontend/src/layouts/Protectedlayouts.js
import React from "react";
import { Outlet } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Navigation from "../Components/Navigation/Navigation";

const ProtectedLayout = () => {
  return (
    <>
      <SignedIn>
        <Outlet />
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export default ProtectedLayout;
