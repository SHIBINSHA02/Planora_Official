// frontend/src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { useSyncUser } from "./hooks/useSyncUser";

// --- Pages ---
import LandingPage from "./Components/Landing/landing";
import Dashboard from "./Components/Dashboard/dashboard";
import DashboardHome from "./Components/Dashboard/DashboardHome";
import Teacher from "./Components/Teacher/teacher";
import Classroom from "./Components/Classroom/classroom";
import OrganisationOnboarding from "./Components/organisation/organisation";

// --- Auth Pages ---
import Login from "./Components/auth/login";
import Signup from "./Components/auth/signup";

function App() {
  useSyncUser();
  return (
    <Routes>
      {/* ====================================================== */}
      {/* PUBLIC ROUTES                                         */}
      {/* ====================================================== */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/landing" element={<LandingPage />} />

      {/* ====================================================== */}
      {/* AUTH ROUTES                                           */}
      {/* ====================================================== */}
      <Route
        path="/login"
        element={
          <SignedOut>
            <Login />
          </SignedOut>
        }
      />

      <Route
        path="/signup"
        element={
          <SignedOut>
            <Signup />
          </SignedOut>
        }
      />

      {/* ====================================================== */}
      {/* PROTECTED ROUTES                                      */}
      {/* ====================================================== */}

      {/* Dashboard Layout */}
      <Route
        path="/dashboard"
        element={
          <SignedIn>
            <Dashboard />
          </SignedIn>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="teacher" element={<Teacher />} />
        <Route path="classroom" element={<Classroom />} />
      </Route>

      {/* Organisation Onboarding */}
      <Route
        path="/organisation"
        element={
          <SignedIn>
            <OrganisationOnboarding />
          </SignedIn>
        }
      />

      {/* ====================================================== */}
      {/* FALLBACK                                              */}
      {/* ====================================================== */}
      <Route
        path="*"
        element={
          <>
            <SignedIn>
              <Dashboard />
            </SignedIn>
            <SignedOut>
              <LandingPage />
            </SignedOut>
          </>
        }
      />
    </Routes>
  );
}

export default App;
