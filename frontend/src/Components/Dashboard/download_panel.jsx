// frontend/src/Components/Dashboard/download_panel.jsx
import React from 'react';

const DownloadPanel = () => {
  const handleDownloadTeacherSchedule = () => {
    // TODO: Implement download teacher schedule functionality
    console.log('Download teacher schedule clicked');
  };

  const handleDownloadClassSchedules = () => {
    // TODO: Implement download class schedules functionality
    console.log('Download class schedules clicked');
  };

  return (
    <div className="flex flex-col gap-5 lg:flex-row">
      <button
        onClick={handleDownloadTeacherSchedule}
        className="px-6 py-3 font-semibold text-white transition-colors duration-200 bg-indigo-600 rounded-lg shadow hover:bg-indigo-700"
      >
        Download Teacher Schedule
      </button>
      
      <button
        onClick={handleDownloadClassSchedules}
        className="px-6 py-3 font-semibold text-white transition-colors duration-200 bg-indigo-600 rounded-lg shadow hover:bg-indigo-700"
      >
        Download Class Schedules
      </button>
    </div>
  );
};

export default DownloadPanel;
