// frontend/src/Components/tables/ClassroomScheduleTable.jsx
"use client";

import React from "react";
import { TeacherScheduleGrid } from "./teachergrid";

// This is a new, focused component for the classroom schedule.
const ClassroomScheduleTable = ({
  scheduleData,
  days,
  periods,
  teachers = [],
  subjects = [],
  onUpdateSchedule,
}) => {
  const [isMultiSelect, setIsMultiSelect] = React.useState(false);
  const [isMultiAssign, setIsMultiAssign] = React.useState(false);
  const [hoveredTeacher, setHoveredTeacher] = React.useState(null);
  const [hoverPosition, setHoverPosition] = React.useState({ x: 0, y: 0 });

  // Your CustomTeacherDropdown component remains here as it's specific to the classroom view.
  const CustomTeacherDropdown = ({
    value,
    onChange,
    teachers,
    rowIndex,
    colIndex,
  }) => {
    // ... (The CustomTeacherDropdown implementation remains unchanged)
  };

  const renderCell = (cell, rowIndex, colIndex) => {
    const assignment = (Array.isArray(cell) && cell.length > 0) ? cell[0] : {};
    const currentTeacherId = assignment.teacher_id || "";
    const currentSubject = assignment.subject || "";

    const availableTeachers = teachers.filter((teacher) => {
      const isTeacherFree = teacher.schedule_grid?.[rowIndex]?.[colIndex] === null;
      const isCurrentlyAssigned = teacher._id === currentTeacherId;
      return isTeacherFree || isCurrentlyAssigned;
    });

    const sortedTeachers = [...availableTeachers].sort((a, b) => (a.teachername || "").localeCompare(b.teachername || ""));
    const sortedSubjects = [...subjects].sort((a, b) => a.localeCompare(b));

    const handleClear = () => {
      onUpdateSchedule(rowIndex, colIndex, "", "");
    };

    const handleTeacherChange = (newTeacherId) => {
      onUpdateSchedule(rowIndex, colIndex, newTeacherId, currentSubject);
    };

    const handleSubjectChange = (newSubject) => {
      onUpdateSchedule(rowIndex, colIndex, currentTeacherId, newSubject);
    };

    return (
      <div className="space-y-1">
        {(currentTeacherId || currentSubject) && (
          <button
            onClick={handleClear}
            className="w-full px-2 py-1 text-xs bg-red-100 text-red-600 border border-red-200 rounded hover:bg-red-200"
          >
            Clear
          </button>
        )}
        <div className="flex items-center space-x-2">
          {isMultiSelect && <span className="text-green-500 text-lg">+</span>}
          <div className="flex-1">
            <CustomTeacherDropdown
              value={currentTeacherId}
              onChange={handleTeacherChange}
              teachers={sortedTeachers}
              rowIndex={rowIndex}
              colIndex={colIndex}
            />
          </div>
          {isMultiSelect && <span className="text-red-500 text-lg">−</span>}
        </div>
        <div className="flex items-center space-x-2">
          {isMultiAssign && <span className="text-green-500 text-lg">+</span>}
          <div className="flex-1">
            <select
              value={currentSubject}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-200 rounded"
            >
              <option value="">Select Subject</option>
              {sortedSubjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
          {isMultiAssign && <span className="text-red-500 text-lg">−</span>}
        </div>
        <div className="text-xs text-gray-500 pt-1">
          {availableTeachers.length} teacher{availableTeachers.length !== 1 ? "s" : ""} available
        </div>
      </div>
    );
  };

  return (
    <div className="overflow-x-auto shadow-lg rounded-lg relative">
      <div className="mb-4 flex space-x-4 p-4 bg-gray-50 border-b">
        <button
          onClick={() => setIsMultiSelect(!isMultiSelect)}
          className={`px-4 py-2 text-sm font-medium rounded ${isMultiSelect ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
        >
          {isMultiSelect ? "Disable Multi-Teacher" : "Enable Multi-Teacher"}
        </button>
        <button
          onClick={() => setIsMultiAssign(!isMultiAssign)}
          className={`px-4 py-2 text-sm font-medium rounded ${isMultiAssign ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
        >
          {isMultiAssign ? "Disable Multi-Assign" : "Enable Multi-Assign"}
        </button>
      </div>
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
                    {renderCell(cell, rowIndex, colIndex)}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
      {hoveredTeacher && (
        <TeacherScheduleGrid
          teacher={hoveredTeacher}
          position={hoverPosition}
          currentDayIndex={hoveredTeacher.currentDayIndex}
          currentPeriodIndex={hoveredTeacher.currentPeriodIndex}
          setHoveredTeacher={setHoveredTeacher}
          days={days}
          periods={periods}
        />
      )}
    </div>
  );
};

export default React.memo(ClassroomScheduleTable);