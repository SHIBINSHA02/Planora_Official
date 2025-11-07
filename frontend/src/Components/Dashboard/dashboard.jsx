// frontend/src/Components/Dashboard/dashboard.jsx
import React from 'react';
// Import components from React Router
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

// The Dashboard now accepts the `onLogout` prop from App.jsx
const Dashboard = ({ onLogout }) => {
  const navigate = useNavigate();

  // We no longer need the 'activeTab' state. The URL is the source of truth.
  // We no longer need the 'initialTab' prop.

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout(); // This clears localStorage and updates App state
    }
    navigate('/login'); // Redirect to the login page
  };

  // This function is used by NavLink to apply styles to the active link
  const getNavLinkClass = ({ isActive }) =>
    isActive ? 'text-indigo-600 font-semibold' : 'text-gray-600 hover:text-indigo-700';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Logo" className="h-16 w-16" />
          </div>
          <div className="flex items-center gap-6">
            {/* Replace <a> tags with <NavLink> */}
            <NavLink to="/dashboard" className={getNavLinkClass} end>
              Dashboard
            </NavLink>
            <NavLink to="/dashboard/classroom" className={getNavLinkClass}>
              Classroom
            </NavLink>
            <NavLink to="/dashboard/teacher" className={getNavLinkClass}>
              Teacher
            </NavLink>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleLogoutClick}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md"
            >
              Logout
            </button>
          </div>
        </nav>

        <main className="p-6">
          {/* Outlet is the placeholder for nested route content */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;