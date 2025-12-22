// frontend/src/Components/Dashboard/DashboardNavigation.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { SignOutButton, useUser } from "@clerk/clerk-react";

const DashboardNavigation = () => {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  if (!isLoaded) return null;

  const getNavLinkClass = ({ isActive }) =>
    isActive
      ? "text-indigo-600 font-semibold"
      : "text-gray-600 hover:text-indigo-700";

  return (
    <>
      {/* ================= DESKTOP NAV ================= */}
      <nav className="items-center justify-between hidden px-6 py-4 m-8 bg-white shadow-lg md:flex shadow-blue-200 rounded-3xl">
        
        {/* Logo */}
        <NavLink to="/" >
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="Planora Logo" className="w-20 h-auto" />
        </div>
         </NavLink>
        {/* Links */}
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

        {/* User + Logout */}
        <div className="flex items-center gap-4">
          <span className="flex gap-1 text-sm text-gray-600">
            <p className="text-blue-700">Hi</p> 
            {`${user.firstName || user.username} ${user.lastName || user.username}`}
          </span>

          <SignOutButton signOutCallback={() => navigate("/login")}>
            <button className="flex items-center gap-2 px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </SignOutButton>
        </div>
      </nav>

      {/* ================= MOBILE NAV ================= */}
      <nav className="flex items-center justify-between px-4 py-3 bg-white shadow-md md:hidden">
        
        {/* Logo */}
        <img src="/logo.svg" alt="Planora Logo" className="w-16 h-auto" />

        {/* Hamburger */}
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* ================= MOBILE MENU ================= */}
      {isOpen && (
        <div className="p-4 mx-4 mt-2 space-y-4 bg-white shadow-lg md:hidden rounded-2xl">
          
          <NavLink
            to="/dashboard"
            end
            className={getNavLinkClass}
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/dashboard/classroom"
            className={getNavLinkClass}
            onClick={() => setIsOpen(false)}
          >
            Classroom
          </NavLink>

          <NavLink
            to="/dashboard/teacher"
            className={getNavLinkClass}
            onClick={() => setIsOpen(false)}
          >
            Teacher
          </NavLink>

          <hr />

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {user.firstName || user.username}
            </span>

            <SignOutButton signOutCallback={() => navigate("/login")}>
              <button className="flex items-center gap-2 px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </SignOutButton>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardNavigation;
