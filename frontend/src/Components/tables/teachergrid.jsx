// frontend/src/Components/tables/teachergrid.jsx
import React, { useMemo, useCallback } from 'react';

const getTeacherAvailabilityGrid = (teacher, currentDayIndex, currentPeriodIndex, days, periods) => {
  // Initialize an empty grid with default values
  const grid = Array(days.length).fill(null).map(() => 
    Array(periods.length).fill(null).map(() => ({ 
      isBooked: false, 
      isCurrentSlot: false,
      assignments: [], // ✅ CHANGED: Use an 'assignments' array instead of single properties
    }))
  );
  
  const teacherSchedule = teacher?.schedule_grid;
  if (!teacherSchedule) return grid;

  for (let d = 0; d < days.length; d++) {
    for (let p = 0; p < periods.length; p++) {
      const slotData = teacherSchedule[d]?.[p];
      
      const hasScheduleItems = Array.isArray(slotData) && slotData.length > 0;
      const isBooked = hasScheduleItems;
      
      grid[d][p] = { 
        isBooked: isBooked,
        isCurrentSlot: d === currentDayIndex && p === currentPeriodIndex,
        // ✅ CHANGED: Store the entire slotData array if the teacher is booked
        assignments: isBooked ? slotData : [],
      };
    }
  }
  return grid;
};

export const TeacherScheduleGrid = ({ teacher, position, currentDayIndex, currentPeriodIndex, setHoveredTeacher, days, periods }) => {
  const scheduleGrid = useMemo(() => getTeacherAvailabilityGrid(teacher, currentDayIndex, currentPeriodIndex, days, periods), [teacher, currentDayIndex, currentPeriodIndex, days, periods]);
  const totalAssignments = useMemo(() => scheduleGrid.flat().reduce((count, slot) => count + (slot.isBooked ? slot.assignments.length : 0), 0), [scheduleGrid]);
  const workloadStats = useMemo(() => {
    const totalSlots = days.length * periods.length;
    return { totalSlots, percentage: totalSlots > 0 ? Math.round((totalAssignments / totalSlots) * 100) : 0 };
  }, [days.length, periods.length, totalAssignments]);
  
  const handleMouseLeave = useCallback(() => setHoveredTeacher(null), [setHoveredTeacher]);

  const tooltipStyle = { left: Math.min(position.x + 15, window.innerWidth - 550), top: Math.max(position.y - 100, 20) };
  if (!teacher) return null;

  return (
    <div className="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-xl p-4 w-[520px]" style={tooltipStyle} onMouseLeave={handleMouseLeave}>
      <div className="mb-3 border-b pb-2">
        <h4 className="font-semibold text-base">{teacher.teachername}'s Weekly Schedule</h4>
        <p className="text-red-600 font-medium text-sm"><strong>Workload:</strong> {totalAssignments}/{workloadStats.totalSlots} ({workloadStats.percentage}%)</p>
      </div>
      
      <table className="w-full border-collapse text-center">
        <thead>
          <tr>
            <th className="font-semibold text-xs text-gray-600 p-1 w-1/12">Day</th>
            {periods.map((_, idx) => (
              <th key={idx} className="font-semibold text-xs text-gray-600 p-1">P{idx + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((day, dayIndex) => (
            <tr key={dayIndex}>
              <td className="font-semibold text-xs text-gray-700 p-1 bg-gray-50 border">{day.slice(0, 3)}</td>
              {periods.map((_, periodIndex) => {
                const slot = scheduleGrid[dayIndex]?.[periodIndex];
                if (!slot) return <td key={periodIndex} className="border"></td>;

                return (
                  <td 
                    key={periodIndex} 
                    className={`border p-0.5 text-xs h-16 align-top ${slot.isCurrentSlot ? 'ring-2 ring-blue-500 ring-inset' : ''} ${!slot.isBooked ? 'bg-green-50' : 'bg-blue-50'}`}
                  >
                    {/* ✅ CHANGED: Map over the assignments array to display all entries */}
                    {slot.isBooked ? (
                      <div className="flex flex-col h-full overflow-y-auto">
                        {slot.assignments.map((assignment, idx) => (
                          <div key={idx} className="bg-blue-100 rounded p-1 mb-1 last:mb-0 text-left">
                            <strong className="text-blue-800 block truncate leading-tight">{assignment.classroomName || 'Unknown Class'}</strong>
                            <span className="text-gray-600 block truncate leading-tight">{assignment.subject || 'No Subject'}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        Free
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};