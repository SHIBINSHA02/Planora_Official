// frontend/src/Components/Dashboard/DashboardHome.jsx
// frontend/src/Components/Dashboard/DashboardHome.jsx
import React from 'react';
import ClassOnboarding from './class_onboarding';
import TeacherOnboarding from './teacher_onboarding';
import DownloadPanel from './download_panel';

const DashboardHome = () => {
    return (
        <>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Teacher Onboarding</h2>
                    <TeacherOnboarding />
                </div>
                <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Class Onboarding</h2>
                    <ClassOnboarding />
                </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Download Panel</h2>
                <DownloadPanel />
            </div>
        </>
    );
};

export default DashboardHome;