// frontend/src/Components/Dashboard/dashboard.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import DashboardNavigation from "./DashboardNavigation";
import { useOrganisationContext } from "../../context/useOrganisationContext";
const Dashboard = () => {
  const { activeOrganisation, loading } = useOrganisationContext();
  
   if (loading) {
    return <p className="text-gray-700">Loading organisation...</p>;
  }

  if (!activeOrganisation) {
    return <p className="font-semibold text-red-600">
      No organisation selected. Please select an organisation.
    </p>;
  }
  return (
    <div className="items-center mx-auto lg:w-2/3 ">
      {/* Dashboard Top Navigation */}
      <DashboardNavigation />

      {/* Main Content */}
      <main className="px-6 pb-6">
         <h1 className="mb-5 text-2xl font-semibold text-gray-700 lg:m-5">
          Active Organisation:<span className='text-blue-600'> {activeOrganisation.organisationName}</span>
        </h1>
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
