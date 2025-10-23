// frontend/src/Components/Classroom/ClassroomScheduleView.jsx
import React from 'react';
import PropTypes from 'prop-types';
import ScheduleTable from '../tables/ScheduleTable'; // Make sure this path is correct

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

  return (
    <div className="space-y-6 mt-6">
      <ScheduleTable
        scheduleData={classSchedules[selectedClassroom]}
        days={days}
        periods={periods}
        teachers={teachers}
        subjects={availableSubjects}
        onUpdateSchedule={(dayIndex, periodIndex, teacherId, subject) => 
          handleUpdateSchedule(selectedClassroom, dayIndex, periodIndex, teacherId, subject)
        }
      />
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