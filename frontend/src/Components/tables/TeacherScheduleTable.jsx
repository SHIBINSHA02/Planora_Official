import React from "react";

const TeacherScheduleTable = ({ scheduleData, days, periods }) => {
  const renderCell = (cell) => {
    // This is the key logic. We check if 'cell' is a non-empty array.
    // This correctly handles cases where a teacher has multiple classes in one period.
    if (Array.isArray(cell) && cell.length > 0) {
      return (
        <div className="space-y-1">
          {/* We map over every assignment object in the cell's array... */}
          {cell.map((assignment, index) => (
            // ...and render a separate block for each one.
            // Using a unique key like `assignment.classroomId + assignment.subject` is slightly more robust.
            <div key={`${assignment.classroomId}-${assignment.subject}-${index}`} className="bg-indigo-100 p-2 rounded text-xs text-left">
              <div className="font-semibold text-indigo-800">{assignment.classroomName}</div>
              <div className="text-indigo-600">{assignment.subject}</div>
            </div>
          ))}
        </div>
      );
    }

    // If the cell is null, undefined, or an empty array, the teacher is free.
    return <div className="text-gray-400 text-xs">Free</div>;
  };

  return (
    <div className="overflow-x-auto shadow-lg rounded-lg">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left font-semibold">Day/Period</th>
            {periods.map((period, index) => (
              <th key={index} className="border px-4 py-2 text-center font-semibold">
                {period}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Ensure scheduleData is available before trying to map it */}
          {scheduleData &&
            scheduleData.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="border px-4 py-2 font-semibold bg-gray-100 align-middle">{days[rowIndex]}</td>
                {/* Ensure the row is an array before mapping */}
                {Array.isArray(row) && row.map((cell, colIndex) => (
                  <td key={`${rowIndex}-${colIndex}`} className="border p-2 text-center align-top">
                    {renderCell(cell)}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(TeacherScheduleTable);