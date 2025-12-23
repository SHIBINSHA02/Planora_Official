// frontend/src/Components/organisation/OrganisationOnboarding.jsx
import React, { useState } from "react";
import { useOrganisationContext } from "../../context/useOrganisationContext";
import CreateOrganisationModal from "./CreateOrganisationModal";
import { useNavigate } from "react-router-dom";

const OrganisationOnboarding = () => {
  const {
    organisations,
    activeOrganisation,
    setActiveOrganisationById,
    loading,
    error,
  } = useOrganisationContext();
  const navigate = useNavigate();

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
    <div className="min-h-screen px-4 py-8 m-2 border border-blue-300 lg:m-10 rounded-3xl bg-slate-100/90">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col justify-between gap-8 mb-8 lg:items-center lg:flex-row">
          <h1 className="text-3xl font-medium">Organisations</h1>

          <button
            onClick={() => setOpen(true)}
            className="px-5 py-2 text-white bg-indigo-600 rounded-lg shadow hover:bg-indigo-700"
          >
            + Create Organisation
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {organisations.map((org) => (
            <div
              key={org._id}
              onClick={() => {
                setActiveOrganisationById(org.organisationId)
                navigate("/dashboard")
              }
              }
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
            </div>
          ))}
        </div>
      </div>

      <CreateOrganisationModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default OrganisationOnboarding;
