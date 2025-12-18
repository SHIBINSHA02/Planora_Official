import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { SignOutButton } from "@clerk/clerk-react";
import { useAuthContext } from "../../context/AuthContext";

/* Icons */
const Menu = ({ className }) => (
  <svg className={className} stroke="currentColor" fill="none" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);
const X = ({ className }) => (
  <svg className={className} stroke="currentColor" fill="none" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const LogOut = ({ className }) => (
  <svg className={className} stroke="currentColor" fill="none" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

/* ================= HEADER ================= */
const Header = ({ isMenuOpen, setIsMenuOpen }) => {
  const { isSignedIn, loading, displayName } = useAuthContext();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <img src="/logo.svg" alt="Planora Logo" className="w-auto h-14" />
          </Link>

          <nav className="hidden space-x-8 md:flex">
            <a href="/#features" className="font-medium text-gray-700 hover:text-indigo-600">
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
                <SignOutButton>
                  <button className="text-gray-500 hover:text-red-600">
                    <LogOut className="w-5 h-5" />
                  </button>
                </SignOutButton>
              </>
            ) : (
              <>
                <Link to="/login" className="font-medium text-gray-700 hover:text-indigo-600">
                  Login
                </Link>
                <Link to="/signup" className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="bg-white border-t border-gray-200 md:hidden">
          <div className="px-4 py-2 space-y-1">
            <Link to="/" className="block px-3 py-2 text-gray-700">
              Home
            </Link>

            {!loading && isSignedIn ? (
              <SignOutButton>
                <button className="block w-full px-3 py-2 text-left text-red-600">
                  Logout
                </button>
              </SignOutButton>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 text-gray-700">
                  Login
                </Link>
                <Link to="/signup" className="block px-3 py-2 text-white bg-indigo-600 rounded-lg">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

/* ================= ORGANISATION CONTENT ================= */

const TEMP_ORGANISATIONS = [
  { id: 1, name: "Greenwood High School", location: "Springfield, IL", adminEmail: "admin@greenwood.edu", status: "Active" },
  { id: 2, name: "Northside Preparatory Academy", location: "Metropolis, NY", adminEmail: "contact@northsideprep.org", status: "Active" },
  { id: 3, name: "Oakridge International School", location: "Sunnyvale, CA", adminEmail: "info@oakridge.io", status: "Pending" },
];

const OrganisationOnboarding = () => {
  const [organisations, setOrganisations] = useState(TEMP_ORGANISATIONS);
  const [orgName, setOrgName] = useState("");
  const [orgLocation, setOrgLocation] = useState("");
  const [orgEmail, setOrgEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!orgName.trim() || !orgEmail.trim()) return;

    setOrganisations((prev) => [
      {
        id: Date.now(),
        name: orgName.trim(),
        location: orgLocation.trim(),
        adminEmail: orgEmail.trim(),
        status: "Active",
      },
      ...prev,
    ]);

    setOrgName("");
    setOrgLocation("");
    setOrgEmail("");
  };

  const badge = (s) =>
    s === "Active"
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h1 className="mb-8 text-3xl font-bold">Organisation Management</h1>

        <div className="p-6 mb-10 bg-white rounded-lg shadow">
          <h2 className="mb-4 text-xl font-semibold">Add New Organisation</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="Organisation Name"
              className="w-full px-3 py-2 border rounded"
            />
            <input
              value={orgLocation}
              onChange={(e) => setOrgLocation(e.target.value)}
              placeholder="Location"
              className="w-full px-3 py-2 border rounded"
            />
            <input
              value={orgEmail}
              onChange={(e) => setOrgEmail(e.target.value)}
              placeholder="Admin Email"
              className="w-full px-3 py-2 border rounded"
            />
            <button className="px-6 py-2 text-white bg-indigo-600 rounded">
              Add Organisation
            </button>
          </form>
        </div>

        {organisations.map((org) => (
          <div key={org.id} className="p-5 mb-4 bg-white border rounded shadow">
            <h3 className="font-bold">{org.name}</h3>
            <p className="text-sm">{org.location}</p>
            <p className="text-sm">{org.adminEmail}</p>
            <span className={`inline-block px-3 py-1 mt-2 text-xs rounded-full ${badge(org.status)}`}>
              {org.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ================= PAGE ================= */

const OrganisationPage = () => {
  const { isSignedIn, loading } = useAuthContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 🔒 Protect route
  if (!loading && !isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <OrganisationOnboarding />
    </>
  );
};

export default OrganisationPage;
