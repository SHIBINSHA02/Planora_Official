// frontend/src/Components/Navigation/Navigation.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { SignOutButton } from "@clerk/clerk-react";
import { useAuthContext } from "../../context/AuthContext";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn, loading, displayName } = useAuthContext();

  return (
    <header className="sticky top-0 z-50 bg-white ">
      <div className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl">

        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/logo.svg" alt="Planora Logo" className="h-14" />
        </Link>

        {/* Desktop Nav */}
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
              <span className="text-sm text-gray-700">
                Welcome, {displayName}
              </span>

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
          

        {/* Mobile Toggle */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="px-2 md:hidden">
        <div className="bg-white shadow-lg rounded-b-3xl">
          <div className="px-4 py-2 space-y-3 ">
            <a href="#features" className="block text-gray-700">
              Features
            </a>
            

            {!loading && isSignedIn ? (
              <>
                <Link to="/dashboard" className="block text-gray-700">
                  Dashboard
                </Link>

                <SignOutButton>
                  <button className="block text-red-600">
                    Logout
                  </button>
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
        </div>
      )}
    </header>
  );
};

export default Navigation;
