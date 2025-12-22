// frontend/src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { SignedOut } from "@clerk/clerk-react";
import { useSyncUser } from "./hooks/useSyncUser";

/* Layouts */
import ProtectedLayout from "./layouts/ProtectedLayouts";
import PublicLayout from "./layouts/PublicLayout";

/* Pages */
import LandingPage from "./Components/Landing/landing";
import Dashboard from "./Components/Dashboard/dashboard";
import DashboardHome from "./Components/Dashboard/DashboardHome";
import Teacher from "./Components/Teacher/teacher";
import Classroom from "./Components/Classroom/classroom";
import OrganisationPage from "./Components/organisation/organisation";

/* Auth Pages */
import Login from "./Components/auth/login";
import Signup from "./Components/auth/signup";

function App() {
  useSyncUser();

  return (
    <Routes>

      {/* ================= PUBLIC ================= */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />

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
      </Route>

      {/* ================= PROTECTED ================= */}
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="teacher" element={<Teacher />} />
          <Route path="classroom" element={<Classroom />} />
        </Route>

        <Route path="/organisation" element={<OrganisationPage />} />
      </Route>

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<LandingPage />} />

    </Routes>
  );
}

export default App;
