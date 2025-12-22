// frontend/src/Components/organisation/organisation.jsx
import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { SignOutButton } from "@clerk/clerk-react";
import { useAuthContext } from "../../context/AuthContext";
import { useOrganisationContext } from "../../context/useOrganisationContext";


/* ================= ICONS ================= */
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
    <header className="bg-white border-b shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl">
        <Link to="/" className="flex items-center">
          <img src="/logo.svg" alt="Logo" className="h-10" />
        </Link>

        <nav className="hidden space-x-8 md:flex">
          <Link to="/" className="text-gray-700 hover:text-indigo-600">
            Home
          </Link>
        </nav>

        <div className="items-center hidden gap-4 md:flex">
          {!loading && isSignedIn && (
            <>
              <span className="text-sm text-gray-600">
                Hi, {displayName}
              </span>
              <SignOutButton>
                <button className="text-gray-500 hover:text-red-600">
                  <LogOut className="w-5 h-5" />
                </button>
              </SignOutButton>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
    </header>
  );
};

/* ================= MODAL (UI ONLY FOR NOW) ================= */
const CreateOrganisationModal = ({ open, onClose }) => {
  const [name, setName] = useState("");

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    onClose(); // backend wiring later
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md p-6 bg-white shadow-xl rounded-xl">
        <button
          onClick={onClose}
          className="absolute text-gray-400 top-3 right-3 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="mb-6 text-xl font-semibold">Create Organisation</h2>

        <form onSubmit={submit} className="space-y-4">
          <input
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Organisation Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button className="w-full py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
            Create Organisation
          </button>
        </form>
      </div>
    </div>
  );
};

/* ================= PAGE CONTENT ================= */
const OrganisationOnboarding = () => {
  const {
    organisations,
    activeOrganisation,
    setActiveOrganisation,
    loading,
    error,
  } = useOrganisationContext();

  const [open, setOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">Loading organisations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-sans text-3xl font-medium">
            Organisations
          </h1>

          <button
            onClick={() => setOpen(true)}
            className="px-5 py-2 text-white bg-indigo-600 rounded-lg shadow hover:bg-indigo-700"
          >
            + Create Organisation
          </button>
        </div>

        {organisations.length === 0 ? (
          <div className="p-10 text-center bg-white shadow-sm rounded-xl">
            <p className="text-gray-600">
              You don’t belong to any organisation yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {organisations.map((org) => (
              <div
                key={org._id}
                onClick={() => setActiveOrganisation(org)}
                className={`p-5 cursor-pointer transition rounded-xl shadow-sm hover:shadow-md
                  ${
                    activeOrganisation?.organisationId === org.organisationId
                      ? "border-2 border-indigo-600 bg-indigo-50"
                      : "bg-white"
                  }`}
              >
                <h3 className="text-lg font-semibold">
                  {org.organisationName}
                </h3>

                <p className="text-sm text-gray-600">
                  Org ID: {org.organisationId}
                </p>

                <p className="text-sm text-gray-500">
                  Admin: {org.adminName}
                </p>

                <p className="mt-2 text-xs text-gray-400">
                  {org.workingDays} days · {org.periodsPerDay} periods/day
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateOrganisationModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
};

/* ================= ROUTE ================= */
const OrganisationPage = () => {
  const { isSignedIn, loading } = useAuthContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!loading && !isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Header
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      <OrganisationOnboarding />
    </>
  );
};

export default OrganisationPage;
