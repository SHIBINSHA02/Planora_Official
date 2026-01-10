// frontend/src/Components/organisation/CreateOrganisationModal.jsx
import React, { useState } from "react";

const CreateOrganisationModal = ({ open, onClose }) => {
  const [name, setName] = useState("");

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/api/organisations/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",         // ⬅️ IMPORTANT
      body: JSON.stringify({ name }),
    });

    if (res.ok) onClose();
    else console.log("Failed to create org");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md p-6 m-3 bg-white shadow-xl rounded-xl">
        <button
          onClick={onClose}
          className="absolute text-gray-400 top-3 right-3 hover:text-gray-600"
        >
          ✕
        </button>

        <h2 className="mb-6 text-xl font-semibold">Create Organisation</h2>

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

export default CreateOrganisationModal;
