// frontend/src/Components/Profile/SideNavbar.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  School,
  BookOpen,
  Clock,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navItemClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
    isActive
      ? "bg-indigo-600 text-white"
      : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
  }`;

export const SideNavbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ================= MOBILE TOP BAR ================= */}
      <div className="flex items-center justify-between p-4 bg-white border-b md:hidden">
       {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/logo1.svg" alt="Planora Logo" className="h-10" />
        </Link>
        <button onClick={() => setOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* ================= OVERLAY ================= */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white border-r shadow-sm
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:min-h-screen
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:block">
          <div>
            <h1 className="text-xl font-bold text-indigo-600">
              Teacher Panel
            </h1>
            <p className="text-sm text-gray-500">
              Timetable Scheduler
            </p>
          </div>

          {/* Close (mobile only) */}
          <button
            className="md:hidden"
            onClick={() => setOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 p-4">
          <NavLink to="/teacher/dashboard" className={navItemClass} onClick={() => setOpen(false)}>
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink to="/teacher/timetable" className={navItemClass} onClick={() => setOpen(false)}>
            <CalendarDays size={18} />
            My Timetable
          </NavLink>

          <NavLink to="/teacher/classrooms" className={navItemClass} onClick={() => setOpen(false)}>
            <School size={18} />
            Classrooms
          </NavLink>

          <NavLink to="/teacher/subjects" className={navItemClass} onClick={() => setOpen(false)}>
            <BookOpen size={18} />
            Subjects
          </NavLink>

          <NavLink to="/teacher/availability" className={navItemClass} onClick={() => setOpen(false)}>
            <Clock size={18} />
            Availability
          </NavLink>

          <NavLink to="/teacher/profile" className={navItemClass} onClick={() => setOpen(false)}>
            <User size={18} />
            Profile
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="p-4 mt-auto border-t">
          <button className="flex items-center w-full gap-3 px-4 py-3 text-red-600 transition rounded-xl hover:bg-red-50">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};
