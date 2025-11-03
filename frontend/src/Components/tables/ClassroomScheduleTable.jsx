// frontend/src/Components/tables/ClassroomScheduleTable.jsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { TeacherScheduleGrid } from "./teachergrid"; // Ensure this component exists

const ClassroomScheduleTable = ({
  scheduleData,
  days,
  periods,
  teachers = [],
  subjects = [],
  classroomSubjects = [],
  onUpdateSchedule,
}) => {
  
  const [hoveredTeacher, setHoveredTeacher] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  // ====================================================================================
  // 🔹 CUSTOM TEACHER DROPDOWN
  // ====================================================================================
  const CustomTeacherDropdown = ({ value, onChange, teachers, rowIndex, colIndex }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const hoverTimeoutRef = useRef(null);
    const hideTimeoutRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
          setHoveredTeacher(null);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      };
    }, []);

    const selectedTeacher = teachers.find((t) => t._id === value);

    const handleTeacherHover = (teacher, event) => {
      if (!isOpen) return;
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);

      hoverTimeoutRef.current = setTimeout(() => {
        if (isOpen) {
          const rect = event.target.getBoundingClientRect();
          setHoveredTeacher({
            ...teacher,
            currentDayIndex: rowIndex,
            currentPeriodIndex: colIndex,
          });
          setHoverPosition({ x: rect.right + 10, y: rect.top });
        }
      }, 700);
    };

    const handleTeacherLeave = () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      hideTimeoutRef.current = setTimeout(() => {
        setHoveredTeacher(null);
      }, 200);
    };

    const handleSelect = (teacherId) => {
      setHoveredTeacher(null);
      setIsOpen(false);
      onChange(teacherId);
    };

    const handleDropdownToggle = (e) => {
      e.stopPropagation();
      setIsOpen(!isOpen);
      if (isOpen) {
        setHoveredTeacher(null);
      }
    };

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={handleDropdownToggle}
          className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-left flex justify-between items-center"
        >
          <span className="truncate">
            {selectedTeacher ? selectedTeacher.teachername : "Select Teacher"}
          </span>
          <span
            className={`transform transition-transform text-gray-500 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-40 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
            <div
              className="px-2 py-1.5 text-xs text-gray-500 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect("")}
            >
              -- None --
            </div>
            {teachers.map((teacher) => (
              <div
                key={teacher._id}
                className="px-2 py-1.5 text-xs hover:bg-indigo-50 cursor-pointer border-t border-gray-100"
                onClick={() => handleSelect(teacher._id)}
                onMouseEnter={(e) => handleTeacherHover(teacher, e)}
                onMouseLeave={handleTeacherLeave}
              >
                <div className="font-medium text-gray-800">{teacher.teachername}</div>
                <div className="text-gray-500 text-xs">
                  {teacher.subjects?.join(", ") || "No subjects specified"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ====================================================================================
  // 🔹 MULTI-SLOT HANDLERS
  // ====================================================================================
  const handleAddAssignment = (rowIndex, colIndex) => {
    const updatedCell = [...(scheduleData[rowIndex][colIndex] || [])];
    updatedCell.push({ teacher_id: "", teacher_name: "", subject: "" });
    onUpdateSchedule(rowIndex, colIndex, updatedCell);
  };

  const handleRemoveAssignment = (rowIndex, colIndex, index) => {
    const updatedCell = [...(scheduleData[rowIndex][colIndex] || [])];
    updatedCell.splice(index, 1);
    onUpdateSchedule(rowIndex, colIndex, updatedCell);
  };

  const handleTeacherChange = (rowIndex, colIndex, index, newTeacherId) => {
    const updatedCell = [...(scheduleData[rowIndex][colIndex] || [])];
    const newTeacher = teachers.find((t) => t._id === newTeacherId);
    updatedCell[index] = {
      ...updatedCell[index],
      teacher_id: newTeacherId,
      teacher_name: newTeacher ? newTeacher.teachername : "",
    };
    onUpdateSchedule(rowIndex, colIndex, updatedCell);
  };

  const handleSubjectChange = (rowIndex, colIndex, index, newSubject) => {
    const updatedCell = [...(scheduleData[rowIndex][colIndex] || [])];
    updatedCell[index] = {
      ...updatedCell[index],
      subject: newSubject,
    };
    onUpdateSchedule(rowIndex, colIndex, updatedCell);
  };

  // ====================================================================================
  // 🔹 CELL RENDERING
  // ====================================================================================
  const renderCell = (cell, rowIndex, colIndex) => {
    const assignments = Array.isArray(cell) ? cell : [];
    const filteredSubjects =
      classroomSubjects.length > 0 ? classroomSubjects : subjects;

    return (
      <div className="space-y-2">
        {assignments.map((assignment, index) => {
          const currentTeacherId = assignment.teacher_id || "";
          const currentSubject = assignment.subject || "";

          const sortedTeachers = [...teachers].sort((a, b) =>
            (a.teachername || "").localeCompare(b.teachername || "")
          );
          const sortedSubjects = [...filteredSubjects].sort((a, b) =>
            a.localeCompare(b)
          );

          return (
            <div key={index} className="border rounded-md p-2 mb-2 bg-gray-50">
              <CustomTeacherDropdown
                value={currentTeacherId}
                onChange={(newTeacherId) =>
                  handleTeacherChange(rowIndex, colIndex, index, newTeacherId)
                }
                teachers={sortedTeachers}
                rowIndex={rowIndex}
                colIndex={colIndex}
              />

              <select
                value={currentSubject}
                onChange={(e) =>
                  handleSubjectChange(rowIndex, colIndex, index, e.target.value)
                }
                className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">Select Subject</option>
                {/* ✅ KEY FIX: Use index to create a unique key */}
                {sortedSubjects.map((subject, idx) => (
                  <option key={`${subject}-${idx}`} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>

              <button
                onClick={() =>
                  handleRemoveAssignment(rowIndex, colIndex, index)
                }
                className="mt-1 w-full px-2 py-1 text-xs bg-red-100 text-red-700 border border-red-200 rounded hover:bg-red-200"
              >
                Remove
              </button>
            </div>
          );
        })}

        <button
          onClick={() => handleAddAssignment(rowIndex, colIndex)}
          className="w-full px-2 py-1 text-xs bg-green-100 text-green-700 border border-green-200 rounded hover:bg-green-200"
        >
          + Add Assignment
        </button>

        <div className="text-xs text-gray-500 pt-1 text-center">
          {assignments.length} assignment{assignments.length !== 1 ? "s" : ""}
        </div>
      </div>
    );
  };

  // ====================================================================================
  // 🔹 MAIN RENDER
  // ====================================================================================
  return (
    <div className="overflow-x-auto shadow-lg rounded-lg relative">
      

      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left font-semibold">
              Day/Period
            </th>
            {periods.map((period, index) => (
              <th
                key={index}
                className="border px-4 py-2 text-center font-semibold"
              >
                {period}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {scheduleData &&
            scheduleData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="border px-4 py-2 font-semibold bg-gray-100 align-middle">
                  {days[rowIndex]}
                </td>
                {row.map((cell, colIndex) => (
                  <td
                    key={`${rowIndex}-${colIndex}`}
                    className="border p-2 text-center align-top"
                  >
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