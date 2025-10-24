// frontend/src/Components/tables/TeacherScheduleTable.jsx
// frontend/src/Components/tables/TeacherScheduleTable.jsx
import React from "react";

const TeacherScheduleTable = ({ scheduleData, days, periods }) => {
  const renderCell = (cell) => {
    if (cell) {
      return (
        <div className="bg-blue-100 p-2 rounded text-xs">
          <div className="font-semibold text-blue-800">{cell.classroomName}</div>
          <div className="text-blue-600">{cell.subject}</div>
          <div className="text-blue-500">{cell.grade}</div>
        </div>
      );
    }
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
          {scheduleData &&
            scheduleData.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="border px-4 py-2 font-semibold bg-gray-100 align-middle">{days[rowIndex]}</td>
                {row.map((cell, colIndex) => (
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