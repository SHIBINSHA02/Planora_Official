// frontend/src/Components/organisation/organisation.jsx
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import Navigation from "../Navigation/Navigation"; // ✅ YOUR existing navbar
import { useOrganisationContext } from "../../context/useOrganisationContext";
import Footer from "../Footer/Footer";

/* ================= MODAL ================= */
const CreateOrganisationModal = ({ open, onClose }) => {
  const [name, setName] = useState("");

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    // backend wiring later
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm ">
      <div className="relative w-full max-w-md p-6 m-3 bg-white shadow-xl rounded-xl">
        <button
          onClick={onClose}
          className="absolute text-gray-400 top-3 right-3 hover:text-gray-600"
        >
          ✕
        </button>

        <h2 className="mb-6 text-xl font-semibold">
          Create Organisation
        </h2>

        <form onSubmit={submit} className="space-y-4">
          <input
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Organisation Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
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

        {/* Header */}
        <div className="flex flex-col justify-between gap-8 mb-8 lg:items-center lg:flex-row">
          <h1 className="text-3xl font-medium">
            Organisations
          </h1>

          <button
            onClick={() => setOpen(true)}
            className="px-5 py-2 text-white bg-indigo-600 rounded-lg shadow hover:bg-indigo-700"
          >
            + Create Organisation
          </button>
        </div>

        {/* Organisation Cards */}
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
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {/* ✅ Your existing Landing Navigation */}
      <Navigation />

      <OrganisationOnboarding />
      <Footer/>
    </>
  );
};

export default OrganisationPage;
