// frontend/src/Components/tables/ClassroomScheduleTable.jsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { TeacherScheduleGrid } from "./teachergrid";

const ClassroomScheduleTable = ({
  scheduleData,
  days,
  periods,
  teachers = [],
  subjects = [], 
  classroomSubjects = [], 
  onUpdateSchedule, // Callback: (rowIndex, colIndex, teacherId, subject, teacherName) => void
}) => {
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [isMultiAssign, setIsMultiAssign] = useState(false);
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
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      };
    }, []);

    const selectedTeacher = teachers.find(t => t._id === value);

    const handleTeacherHover = (teacher, event) => {
      if (!isOpen) return;
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);

      hoverTimeoutRef.current = setTimeout(() => {
        if (isOpen) {
          const rect = event.target.getBoundingClientRect();
          setHoveredTeacher({ ...teacher, currentDayIndex: rowIndex, currentPeriodIndex: colIndex });
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
          <span className="truncate">{selectedTeacher ? selectedTeacher.teachername : 'Select Teacher'}</span>
          <span className={`transform transition-transform text-gray-500 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {isOpen && (
          <div className="absolute z-40 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
            <div
              className="px-2 py-1.5 text-xs text-gray-500 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect('')}
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
                <div className="text-gray-500 text-xs">{teacher.subjects?.join(', ') || 'No subjects specified'}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ====================================================================================
  // 🔹 CELL RENDERING LOGIC - UPDATED TO PASS TEACHER NAME
  // ====================================================================================
  const renderCell = (cell, rowIndex, colIndex) => {
    const assignment = (Array.isArray(cell) && cell.length > 0) ? cell[0] : {};
    const currentTeacherId = assignment.teacher_id || "";
    const currentSubject = assignment.subject || "";

    const baseAvailableTeachers = teachers.filter((teacher) => {
      const isTeacherFree = teacher.schedule_grid?.[rowIndex]?.[colIndex] === null;
      const isCurrentlyAssigned = teacher._id === currentTeacherId;
      return isTeacherFree || isCurrentlyAssigned;
    });

    let filteredTeachers = baseAvailableTeachers;
    let filteredSubjects = classroomSubjects.length > 0 ? classroomSubjects : subjects;

    if (currentSubject) {
      filteredTeachers = baseAvailableTeachers.filter(
        (teacher) => teacher.subjects && teacher.subjects.includes(currentSubject)
      );
    }

    if (currentTeacherId) {
      const selectedTeacher = teachers.find((t) => t._id === currentTeacherId);
      if (selectedTeacher && Array.isArray(selectedTeacher.subjects)) {
        const teacherSubjects = selectedTeacher.subjects;
        filteredSubjects = filteredSubjects.filter((subject) =>
          teacherSubjects.includes(subject)
        );
      }
    }

    const sortedTeachers = [...filteredTeachers].sort((a, b) => (a.teachername || "").localeCompare(b.teachername || ""));
    const sortedSubjects = [...filteredSubjects].sort((a, b) => a.localeCompare(b));

    const handleClear = () => {
      // Pass empty strings for teacher_id, subject, and teacher_name
      onUpdateSchedule(rowIndex, colIndex, "", "", "");
    };

    const handleTeacherChange = (newTeacherId) => {
      const newTeacher = teachers.find(t => t._id === newTeacherId);
      let subjectToSet = currentSubject;
      let teacherNameToSet = "";

      if (newTeacher) {
        teacherNameToSet = newTeacher.teachername || "";
        // Clear subject if new teacher doesn't teach it
        if (newTeacher.subjects && !newTeacher.subjects.includes(currentSubject)) {
          subjectToSet = "";
        }
      }
      
      // CRITICAL: Pass teacher name as the 5th parameter
      onUpdateSchedule(rowIndex, colIndex, newTeacherId, subjectToSet, teacherNameToSet);
    };
    
    const handleSubjectChange = (newSubject) => {
      const currentTeacher = teachers.find(t => t._id === currentTeacherId);
      let teacherToSet = currentTeacherId;
      let teacherNameToSet = currentTeacher?.teachername || "";

      // Clear teacher if they can't teach the new subject
      if (currentTeacher && currentTeacher.subjects && !currentTeacher.subjects.includes(newSubject)) {
        teacherToSet = "";
        teacherNameToSet = "";
      }
      
      // CRITICAL: Pass teacher name as the 5th parameter
      onUpdateSchedule(rowIndex, colIndex, teacherToSet, newSubject, teacherNameToSet);
    };

    return (
      <div className="space-y-2">
        {(currentTeacherId || currentSubject) && (
          <button
            onClick={handleClear}
            className="w-full px-2 py-1 text-xs bg-red-100 text-red-700 border border-red-200 rounded hover:bg-red-200"
          >
            Clear
          </button>
        )}

        <CustomTeacherDropdown
          value={currentTeacherId}
          onChange={handleTeacherChange}
          teachers={sortedTeachers}
          rowIndex={rowIndex}
          colIndex={colIndex}
        />

        <select
          value={currentSubject}
          onChange={(e) => handleSubjectChange(e.target.value)}
          className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="">Select Subject</option>
          {sortedSubjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>

        <div className="text-xs text-gray-500 pt-1 text-center">
          {sortedTeachers.length} teacher{sortedTeachers.length !== 1 ? "s" : ""} available
        </div>
      </div>
    );
  };

  // ====================================================================================
  // 🔹 MAIN COMPONENT RENDER
  // ====================================================================================
  return (
    <div className="overflow-x-auto shadow-lg rounded-lg relative">
      <div className="mb-4 flex space-x-4 p-4 bg-gray-50 border-b">
        <button
          onClick={() => setIsMultiSelect(!isMultiSelect)}
          className={`px-4 py-2 text-sm font-medium rounded ${isMultiSelect ? "bg-indigo-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
        >
          {isMultiSelect ? "Disable Multi-Teacher" : "Enable Multi-Teacher"}
        </button>
        <button
          onClick={() => setIsMultiAssign(!isMultiAssign)}
          className={`px-4 py-2 text-sm font-medium rounded ${isMultiAssign ? "bg-indigo-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
        >
          {isMultiAssign ? "Disable Multi-Assign" : "Enable Multi-Assign"}
        </button>
      </div>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left font-semibold">Day/Period</th>
            {periods.map((period, index) => (
              <th key={index} className="border px-4 py-2 text-center font-semibold">{period}</th>
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