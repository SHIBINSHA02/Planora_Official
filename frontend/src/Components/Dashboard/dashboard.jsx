import React from "react";
import { Outlet } from "react-router-dom";
import DashboardNavigation from "./DashboardNavigation";

const Dashboard = () => {
  return (
    <div className="items-center w-2/3 mx-auto ">
      {/* Dashboard Top Navigation */}
      <DashboardNavigation />

      {/* Main Content */}
      <main className="px-6 pb-6">
        {/* Default Dashboard Content */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard Overview
          </h1>
        </div>

        {/* Nested Routes Render Here */}
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
