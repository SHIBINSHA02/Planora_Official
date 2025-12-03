// frontend/src/Components/Classroom/ClassroomScheduleView.jsx
import React from 'react';
import PropTypes from 'prop-types';
import ClassroomScheduleTable from '../tables/ClassroomScheduleTable';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';





const ClassroomScheduleView = ({
  classrooms,
  classSchedules,
  selectedClassroom,
  teachers = [],
  handleUpdateSchedule,
}) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = ['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5', 'Period 6'];

  const currentClassroom = classrooms.find(c => c.classroom_id === selectedClassroom);

  if (!currentClassroom) {
    return <div className="text-center py-8 text-red-500">Error: Could not find classroom details.</div>;
  }

  const availableSubjects = currentClassroom.subjects?.map(s => s.subject) || [];
  const handleAutomate = async () => {
    try {
  
      const res = await axios.post(`${API_BASE}/automate`, {
        params: {
          classroom_id: selectedClassroom 
        }
      });

      alert(`Schedule Automation triggered successfully for ${selectedClassroom}. Status: ${res.status}`);
    } catch (error) {
    
      console.error('Automation Failed:', error);
      alert('Failed to Automate: Check console for details.');
    }
  };
  return (
    <div className="space-y-6 mt-6">
      <ClassroomScheduleTable
        scheduleData={classSchedules[selectedClassroom]}
        days={days}
        periods={periods}
        teachers={teachers}
        subjects={availableSubjects}
        // ✅ ARGUMENT FIX: Correctly pass the arguments to the handler function.
        onUpdateSchedule={(dayIndex, periodIndex, updatedAssignments) =>
          handleUpdateSchedule(selectedClassroom, dayIndex, periodIndex, updatedAssignments)
        }
        
      />
      <div className="text-center text-blue-500 font-semibold">
        
        <div className="text-xs text-white flex justify-end items-center">
          <button
            onClick={() => window.print()}
            className=" m-5 px-5 py-3 text-base bg-[#4F46E5] rounded-lg hover:bg-[#4338CA] text-white"
          >
            Print Schedule
          </button>
          <button onClick={handleAutomate} className="m-5 px-5 py-3  mr-0 text-base bg-[#4F46E5] rounded-lg hover:bg-[#4338CA] text-white">
            Schedule Automation
          </button>
        </div>
        <p className="text-sm  text-black m-14">
          Schedule for {currentClassroom.classname} ({currentClassroom.classroom_id})
        </p>
      </div>
    </div>
  );
};

ClassroomScheduleView.propTypes = {
  classrooms: PropTypes.array.isRequired,
  classSchedules: PropTypes.object.isRequired,
  selectedClassroom: PropTypes.string.isRequired,
  teachers: PropTypes.array,
  handleUpdateSchedule: PropTypes.func.isRequired,
};

export default ClassroomScheduleView;