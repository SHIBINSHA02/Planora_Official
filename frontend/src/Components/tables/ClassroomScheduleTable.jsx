// frontend/src/Components/tables/ClassroomScheduleTable.jsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { TeacherScheduleGrid } from "./teachergrid"; // Make sure this component exists and is correctly imported

const ClassroomScheduleTable = ({
  scheduleData,
  days,
  periods,
  teachers = [],
  // The 'subjects' prop is now used as a fallback if classroomSubjects is not provided
  subjects = [], 
  // NEW PROP: Pass the subjects specific to this classroom
  classroomSubjects = [], 
  onUpdateSchedule, // Callback to update the parent component's state
}) => {
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [isMultiAssign, setIsMultiAssign] = useState(false);
  const [hoveredTeacher, setHoveredTeacher] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  // ====================================================================================
  // 🔹 FULL IMPLEMENTATION OF THE CUSTOM TEACHER DROPDOWN
  // This component is nested because its logic is tightly coupled with the table's state.
  // ====================================================================================
  const CustomTeacherDropdown = ({ value, onChange, teachers, rowIndex, colIndex }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const hoverTimeoutRef = useRef(null); // Ref to manage hover delay timer
    const hideTimeoutRef = useRef(null); // Ref to manage hide delay timer

    // Effect to handle clicks outside the dropdown to close it
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
          setHoveredTeacher(null); // Clear any hovered teacher preview
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        // Clear timers on cleanup
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      };
    }, []);

    const selectedTeacher = teachers.find(t => t._id === value);

    // Show teacher's schedule on hover after a short delay
    const handleTeacherHover = (teacher, event) => {
      if (!isOpen) return;
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);

      hoverTimeoutRef.current = setTimeout(() => {
        if (isOpen) { // Double check if still open before showing
          const rect = event.target.getBoundingClientRect();
          setHoveredTeacher({ ...teacher, currentDayIndex: rowIndex, currentPeriodIndex: colIndex });
          setHoverPosition({ x: rect.right + 10, y: rect.top });
        }
      }, 700); // 700ms delay before showing
    };

    // Hide teacher's schedule on mouse leave after a short delay
    const handleTeacherLeave = () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      hideTimeoutRef.current = setTimeout(() => {
        setHoveredTeacher(null);
      }, 200);
    };

    // Handle selecting a teacher from the list
    const handleSelect = (teacherId) => {
      setHoveredTeacher(null); // Clear hover preview
      setIsOpen(false);
      onChange(teacherId); // Trigger the parent's update logic
    };

    const handleDropdownToggle = (e) => {
      e.stopPropagation();
      setIsOpen(!isOpen);
      if (isOpen) {
        setHoveredTeacher(null); // Clear hover if closing
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
  // 🔹 CELL RENDERING LOGIC (UPDATED WITH DEPENDENT FILTERING)
  // This function prepares the data for each cell, including filtering for available teachers.
  // ====================================================================================
  const renderCell = (cell, rowIndex, colIndex) => {
    // Determine the current assignment for this cell
    const assignment = (Array.isArray(cell) && cell.length > 0) ? cell[0] : {};
    const currentTeacherId = assignment.teacher_id || "";
    const currentSubject = assignment.subject || "";

    // CRITICAL LOGIC: Filter teachers to show only those available for this specific slot.
    const baseAvailableTeachers = teachers.filter((teacher) => {
      // A teacher is available if their schedule grid for this day/period is null.
      const isTeacherFree = teacher.schedule_grid?.[rowIndex]?.[colIndex] === null;
      // Also, the teacher currently assigned to this slot should be considered available to allow re-selection or changes.
      const isCurrentlyAssigned = teacher._id === currentTeacherId;
      return isTeacherFree || isCurrentlyAssigned;
    });

    // ====================================================================================
    // 🔹 DEPENDENT DROPDOWN LOGIC
    // ====================================================================================
    let filteredTeachers = baseAvailableTeachers;
    // Use classroom-specific subjects if available, otherwise fall back to all subjects
    let filteredSubjects = classroomSubjects.length > 0 ? classroomSubjects : subjects;

    // If a subject is selected, filter teachers to only those who can teach that subject.
    if (currentSubject) {
      filteredTeachers = baseAvailableTeachers.filter(
        (teacher) => teacher.subjects && teacher.subjects.includes(currentSubject)
      );
    }

    // If a teacher is selected, filter subjects to only those taught by the teacher AND belonging to the classroom.
    if (currentTeacherId) {
      const selectedTeacher = teachers.find((t) => t._id === currentTeacherId);
      if (selectedTeacher && Array.isArray(selectedTeacher.subjects)) {
        const teacherSubjects = selectedTeacher.subjects;
        // Find the intersection of the classroom's subjects and the teacher's subjects.
        filteredSubjects = filteredSubjects.filter((subject) =>
          teacherSubjects.includes(subject)
        );
      }
    }

    // Sort the final filtered lists for consistent display
    const sortedTeachers = [...filteredTeachers].sort((a, b) => (a.teachername || "").localeCompare(b.teachername || ""));
    const sortedSubjects = [...filteredSubjects].sort((a, b) => a.localeCompare(b));

    // Handlers that call the parent's `onUpdateSchedule` function
    const handleClear = () => {
      onUpdateSchedule(rowIndex, colIndex, "", ""); // Clear both teacher and subject
    };

    const handleTeacherChange = (newTeacherId) => {
        const newTeacher = teachers.find(t => t._id === newTeacherId);
        let subjectToSet = currentSubject;
    
        // UX Improvement: If the currently selected subject is not taught by the new teacher, clear the subject.
        if (newTeacher && newTeacher.subjects && !newTeacher.subjects.includes(currentSubject)) {
            subjectToSet = "";
        }
        onUpdateSchedule(rowIndex, colIndex, newTeacherId, subjectToSet);
    };
    
    const handleSubjectChange = (newSubject) => {
        const currentTeacher = teachers.find(t => t._id === currentTeacherId);
        let teacherToSet = currentTeacherId;
    
        // UX Improvement: If the currently selected teacher cannot teach the new subject, clear the teacher.
        if (currentTeacher && currentTeacher.subjects && !currentTeacher.subjects.includes(newSubject)) {
            teacherToSet = "";
        }
        onUpdateSchedule(rowIndex, colIndex, teacherToSet, newSubject);
    };

    return (
      <div className="space-y-2">
        {/* The "Clear" button only appears if there is an assignment */}
        {(currentTeacherId || currentSubject) && (
          <button
            onClick={handleClear}
            className="w-full px-2 py-1 text-xs bg-red-100 text-red-700 border border-red-200 rounded hover:bg-red-200"
          >
            Clear
          </button>
        )}

        {/* Teacher Dropdown */}
        <CustomTeacherDropdown
          value={currentTeacherId}
          onChange={handleTeacherChange}
          teachers={sortedTeachers} // Pass the dynamically filtered and sorted teachers
          rowIndex={rowIndex}
          colIndex={colIndex}
        />

        {/* Subject Dropdown */}
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

        {/* Display the count of available teachers */}
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
        {/* These buttons are for future multi-select functionality and can be removed if not needed */}
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
                    {/* The call to renderCell doesn't need to be changed here as it's in the component's scope */}
                    {renderCell(cell, rowIndex, colIndex)}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
      {/* The hover grid overlay for previewing a teacher's schedule */}
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