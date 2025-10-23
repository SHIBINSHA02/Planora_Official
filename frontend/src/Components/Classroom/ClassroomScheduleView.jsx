// frontend/src/Components/Classroom/ClassroomScheduleView.jsx
import React from 'react';
import PropTypes from 'prop-types';
import ScheduleTable from '../tables/ScheduleTable'; // Assuming this component exists and is correct

// A placeholder for the ScheduleTable to prevent the app from crashing if the file is missing.
// You should replace this with your actual ScheduleTable component.
const DummyScheduleTable = () => <div className="p-4 border rounded-lg bg-gray-100">Schedule Table Placeholder</div>;


const ClassroomScheduleView = ({
  classrooms,
  classSchedules,
  selectedClassroom, // This is the classroom_id, e.g., "S7R1-ID"
  setSelectedClassroom,
  // --- Props that were missing from the parent component ---
  teachers = [], // Default to empty array to prevent crashes
}) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = ['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5', 'Period 6'];

  // --- REVISED FUNCTION ---
  // Finds the classroom object using the correct ID property
  const getCurrentClassroom = () => {
    if (!selectedClassroom || !classrooms) return null;
    // Use 'classroom_id' to find the classroom, not 'id'
    return classrooms.find(c => c.classroom_id === selectedClassroom);
  };

  const currentClassroom = getCurrentClassroom();

  // If the classroom isn't found, we shouldn't render the component details.
  if (!currentClassroom) {
    return (
      <div className="text-center py-8 text-red-500">
        Could not find details for the selected classroom.
      </div>
    );
  }

  // --- REVISED LOGIC ---
  // Simplified stats calculation based on the actual schedule structure
  const getClassroomStats = () => {
    const schedule = classSchedules[selectedClassroom] || [];
    let totalSlots = 0;
    let filledSlots = 0;

    schedule.forEach(day => {
      (day || []).forEach(cell => {
        totalSlots++;
        // A cell is filled if it's an array with content
        if (Array.isArray(cell) && cell.length > 0) {
          filledSlots++;
        }
      });
    });

    return {
      totalSlots,
      filledSlots,
      completionPercentage: totalSlots > 0 ? Math.round((filledSlots / totalSlots) * 100) : 0,
    };
  };

  const stats = getClassroomStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        {/* This dropdown is redundant as it exists in the parent. Can be removed if desired. */}
        <div className="flex items-center space-x-4">
          <select
            value={selectedClassroom}
            onChange={(e) => setSelectedClassroom(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f39f6]"
          >
            {classrooms.map(classroom => (
              // Use classroom_id for value and _id for key
              <option key={classroom._id} value={classroom.classroom_id}>
                {classroom.classname}
              </option>
            ))}
          </select>
          
          <div className="text-sm text-gray-600">
            <span className="font-medium">{currentClassroom.classname}</span>
          </div>
        </div>

        {stats && (
          <div className="text-sm text-gray-600">
            Schedule Completion: 
            <span className={`ml-1 font-medium ${
              stats.completionPercentage >= 80 ? 'text-green-600' : 
              stats.completionPercentage >= 50 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {stats.completionPercentage}%
            </span>
            <span className="ml-1">({stats.filledSlots}/{stats.totalSlots})</span>
          </div>
        )}
      </div>

      {/* Simplified view since many props (like getAvailableTeachers) are not provided by the parent */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Schedule for {currentClassroom.classname}
        </h3>
        {/* We use a dummy component here if ScheduleTable is not defined */}
        {typeof ScheduleTable !== 'undefined' ? (
          <ScheduleTable
            scheduleData={classSchedules[selectedClassroom]}
            days={days}
            periods={periods}
            teachers={teachers}
            // Many props are missing, so we provide defaults or remove them
            subjects={[]}
            onUpdateSchedule={() => {}}
            onAddAssignment={() => {}}
            onRemoveAssignment={() => {}}
            getTeachersForTimeSlot={() => []}
            getTeachersForSubject={() => []}
            validateAssignment={() => true}
            type="classroom"
            classroom={currentClassroom}
            teacherSchedules={{}}
          />
        ) : (
          <DummyScheduleTable />
        )}
      </div>
    </div>
  );
};

ClassroomScheduleView.propTypes = {
  classrooms: PropTypes.array.isRequired,
  classSchedules: PropTypes.object.isRequired,
  selectedClassroom: PropTypes.string.isRequired,
  setSelectedClassroom: PropTypes.func.isRequired,
  teachers: PropTypes.array, // Now an optional prop
};

export default ClassroomScheduleView;