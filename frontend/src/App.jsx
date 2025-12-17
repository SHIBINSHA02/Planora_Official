// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

// --- Import Page & Layout Components ---
import LandingPage from './Components/Landing/landing';
import Dashboard from './Components/Dashboard/dashboard';
import DashboardHome from './Components/Dashboard/DashboardHome';
import Teacher from './Components/Teacher/teacher';
import Classroom from './Components/Classroom/classroom';
import Login from './Components/auth/login';
import Signup from './Components/auth/signup';
import OrganisationOnboarding from './Components/organisation/organisation';

// --- Import Auth Components ---
import ProtectedRoute from './Components/auth/ProtectedRoute';

// This is a small helper component to handle the navigation logic after a successful login.
// It's a clean way to use the `useNavigate` hook which can only be used inside a Router context.
function LoginHandler({ onLoginSuccess }) {
  const navigate = useNavigate();
  return (
    <Login
      onLoggedIn={() => {
        onLoginSuccess(); // Update the app-level isLoggedIn state
        navigate('/dashboard'); // Redirect to the dashboard
      }}
    />
  );
}

// Another helper for the signup flow
function SignupHandler() {
  const navigate = useNavigate();
  return (
    <Signup
      onSignedUp={() => {
        navigate('/login'); // After signing up, redirect to the login page
      }}
    />
  );
}

// --- Main App Component ---
function App() {
  // State to track if a user is authenticated throughout the app
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // This effect runs only once when the App component first loads.
  // It checks for an existing token in localStorage to persist the user's session.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Function to be called when a user successfully logs in
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // Function to be called when a user logs out
  const handleLogout = () => {
    // Clear authentication data from storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    // The component triggering logout (e.g., Dashboard or LandingPage) will handle navigation.
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* ====================================================== */}
        {/* PUBLIC ROUTES (Accessible to everyone)                 */}
        {/* ====================================================== */}
        <Route
          path="/"
          element={<LandingPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />}
        />
        <Route
          path="/landing"
          element={<LandingPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />}
        />

        {/* ====================================================== */}
        {/* AUTHENTICATION ROUTES (For login and signup)           */}
        {/* ====================================================== */}
        <Route path="/login" element={<LoginHandler onLoginSuccess={handleLogin} />} />
        <Route path="/signup" element={<SignupHandler />} />

        {/* ====================================================== */}
        {/* PROTECTED ROUTES (Require user to be logged in)        */}
        {/* ====================================================== */}

        {/* --- Dashboard Layout Route --- */}
        {/* The Dashboard component acts as a shell/layout for all its nested child routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        >
          {/* Nested Routes - These will render inside the Dashboard's <Outlet /> */}
          <Route index element={<DashboardHome />} />
          <Route path="teacher" element={<Teacher />} />
          <Route path="classroom" element={<Classroom />} />
        </Route>

        {/* --- Other Protected Routes --- */}
        <Route
          path="/organisation"
          element={
            <ProtectedRoute>
              <OrganisationOnboarding />
            </ProtectedRoute>
          }
        />

        {/* ====================================================== */}
        {/* FALLBACK ROUTE (Catches any undefined paths)           */}
        {/* ====================================================== */}
        <Route
          path="*"
          element={<LandingPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;