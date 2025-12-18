// frontend/src/Components/Landing/landing.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  Users,
  BookOpen,
  ArrowRight,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { SignOutButton } from "@clerk/clerk-react";
import { useAuthContext } from "../../context/AuthContext";
function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  
  const { isSignedIn, loading, displayName } = useAuthContext();

  const features = [
    {
      icon: <Calendar className="w-8 h-8 text-indigo-600" />,
      title: "Smart Scheduling",
      description:
        "AI-powered schedule optimization that considers teacher preferences, room availability, and student needs.",
    },
    {
      icon: <Clock className="w-8 h-8 text-indigo-600" />,
      title: "Time Management",
      description:
        "Effortlessly manage class timings, break schedules, and substitutes.",
    },
    {
      icon: <Users className="w-8 h-8 text-indigo-600" />,
      title: "Team Collaboration",
      description:
        "Seamless coordination between teachers and administrators.",
    },
    {
      icon: <BookOpen className="w-8 h-8 text-indigo-600" />,
      title: "Resource Planning",
      description:
        "Optimize classroom and resource allocation with zero conflicts.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl">
          <Link to="/" className="flex items-center">
            <img src="/logo.svg" alt="Planora Logo" className="h-14" />
          </Link>

          <nav className="hidden space-x-8 md:flex">
            <a href="#features" className="font-medium text-gray-700 hover:text-indigo-600">
              Features
            </a>
            <Link to="/" className="font-medium text-gray-700 hover:text-indigo-600">
              Home
            </Link>
          </nav>

          {/* Desktop Auth */}
          <div className="items-center hidden space-x-4 md:flex">
            {!loading && isSignedIn ? (
              <>
                {!loading && isSignedIn && (
                    <span className="text-sm text-gray-700">
                      Welcome, {displayName}
                    </span>
                  )}

                <Link
                  to="/dashboard"
                  className="font-medium text-gray-700 hover:text-indigo-600"
                >
                  Dashboard
                </Link>

                <SignOutButton>
                  <button
                    className="text-gray-500 hover:text-red-600"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </SignOutButton>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="font-medium text-gray-700 hover:text-indigo-600"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {isMenuOpen && (
          <div className="bg-white border-t md:hidden">
            <div className="px-4 py-2 space-y-2">
              <a href="#features" className="block text-gray-700">
                Features
              </a>

              {!loading && isSignedIn ? (
                <>
                  <Link to="/dashboard" className="block text-gray-700">
                    Dashboard
                  </Link>

                  <SignOutButton>
                    <button className="block text-red-600">Logout</button>
                  </SignOutButton>
                </>
              ) : (
                <>
                  <Link to="/login" className="block text-gray-700">
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-3 py-2 text-white bg-indigo-600 rounded-lg"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ================= HERO ================= */}
      <main>
        <section className="flex items-center justify-center py-20 m-4 rounded-2xl  bg-gradient-to-r from-blue-50 via-white to-blue-50
    lg:bg-gradient-to-r lg:from-blue-100 lg:via-white lg:to-blue-100 lg:h-[70vh]">
          <div className="grid gap-12 px-4 max-w-7xl lg:grid-cols-2">
            {/* LEFT */}
            <div>
              <h1 className="text-4xl font-bold md:text-6xl">
                Revolutionize Your
                <span className="text-indigo-600"> School Scheduling</span>
              </h1>

              <p className="mt-6 text-xl text-gray-600">
                Streamline teacher schedules and optimize resources with
                intelligent automation.
              </p>

              <div className="flex flex-col gap-4 mt-8 sm:flex-row">
                {isSignedIn ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="flex items-center justify-center px-8 py-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                    >
                      Go to Dashboard <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>

                    <Link
                      to="/organisation"
                      className="flex items-center justify-center px-8 py-4 text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50"
                    >
                      Manage Organization
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/signup"
                    className="flex items-center justify-center px-8 py-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                  >
                    Get Started Free <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                )}
              </div>
            </div>

            {/* RIGHT CARD (KEPT AS REQUESTED) */}
            <div className="relative">
              <div className="p-6 transform bg-white shadow-2xl rounded-2xl rotate-3">
                <div className="p-4 mb-4 bg-indigo-600 rounded-lg">
                  <Calendar className="w-8 h-8 mx-auto text-white" />
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">
                        Math - Room 204
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      9:00 AM - 10:30 AM
                    </span>
                  </div>

                  <div className="p-3 bg-gray-100 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium">
                        Science - Lab 1
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      11:00 AM - 12:30 PM
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section id="features" className="py-20 h-[70vh] flex justify-center items-center">
          <div className="grid gap-8 px-4 mx-auto max-w-7xl md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="p-6 text-center bg-white shadow-lg rounded-xl"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="mb-2 text-xl font-semibold">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
        <footer className="py-12 mx-3 text-white bg-gray-900 rounded-t-3xl">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4 space-x-2">
                <div className="p-2 bg-indigo-600 rounded-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">Planora</span>
              </div>
              <p className="text-gray-400">
                Empowering educational institutions with intelligent scheduling solutions.
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 mt-8 text-center text-gray-400 border-t border-gray-800">
            <p>&copy; 2025 Planora. All rights reserved.</p>
          </div>
        </div>
      </footer>
      </main>
    </div>
  );
}

export default LandingPage;
