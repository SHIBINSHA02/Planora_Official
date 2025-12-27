// frontend/src/Components/Dashboard/DashboardNavigation.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useClerk } from "@clerk/clerk-react";
import { useAuthContext } from "../../context/AuthContext";

const DashboardNavigation = () => {
  const { signOut } = useClerk();
  const { displayName, loading } = useAuthContext();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  if (loading) return null;

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const getNavLinkClass = ({ isActive }) =>
    isActive
      ? "py-3 px-5 bg-indigo-50 text-indigo-600 rounded-2xl"
      : "py-3 px-5 rounded-2xl text-gray-600 hover:bg-indigo-50 hover:text-indigo-600";

  return (
    <>
      {/* ================= DESKTOP NAV ================= */}
      <nav className="items-center justify-between hidden px-6 py-4 m-8 bg-white shadow-lg md:flex shadow-blue-200 rounded-3xl">
        <NavLink to="/">
          <img src="/logo1.svg" alt="Planora Logo" className="h-10" />
        </NavLink>

        <div className="flex items-center gap-6">
          <NavLink to="/dashboard" end className={getNavLinkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/dashboard/classroom" className={getNavLinkClass}>
            Classroom
          </NavLink>
          <NavLink to="/dashboard/teacher" className={getNavLinkClass}>
            Teacher
          </NavLink>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Hi{" "}
            <span className="font-medium text-indigo-600">
              {displayName}
            </span>
          </span>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-white bg-indigo-600 rounded-xl hover:bg-indigo-700"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </nav>

      {/* ================= MOBILE NAV ================= */}
      <nav className="flex items-center justify-between px-4 py-3 mx-2 bg-white shadow-md md:hidden">
        <img src="/logo1.svg" alt="Planora Logo" className="h-10" />
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* ================= MOBILE MENU ================= */}
      {isOpen && (
        <div className="flex flex-col p-4 mx-2 space-y-4 bg-white shadow-lg md:hidden rounded-b-3xl">
          <NavLink to="/dashboard" end className={getNavLinkClass} onClick={() => setIsOpen(false)}>
            Dashboard
          </NavLink>

          <NavLink to="/dashboard/classroom" className={getNavLinkClass} onClick={() => setIsOpen(false)}>
            Classroom
          </NavLink>

          <NavLink to="/dashboard/teacher" className={getNavLinkClass} onClick={() => setIsOpen(false)}>
            Teacher
          </NavLink>

          <hr />

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">
              Welcome, {displayName}
            </span>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardNavigation;
