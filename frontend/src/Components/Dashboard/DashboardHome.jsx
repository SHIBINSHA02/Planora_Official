// frontend/src/Components/Dashboard/DashboardHome.jsx
// frontend/src/Components/Dashboard/DashboardHome.jsx
import React from 'react';
import ClassOnboarding from './class_onboarding';
import TeacherOnboarding from './teacher_onboarding';
import DownloadPanel from './download_panel';

const DashboardHome = () => {
    return (
        <>
            
            <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
                <div className="p-6 bg-white border border-gray-200 shadow rounded-3xl">
                    <h2 className="mb-4 text-xl font-semibold text-gray-900">Teacher Onboarding</h2>
                    <TeacherOnboarding />
                </div>
                <div className="p-6 bg-white border border-gray-200 shadow rounded-3xl">
                    <h2 className="mb-4 text-xl font-semibold text-gray-900">Class Onboarding</h2>
                    <ClassOnboarding />
                </div>
            </div>
            <div className="p-6 bg-white border border-gray-200 shadow rounded-3xl">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">Download Panel</h2>
                <DownloadPanel />
            </div>
        </>
    );
};

export default DashboardHome;