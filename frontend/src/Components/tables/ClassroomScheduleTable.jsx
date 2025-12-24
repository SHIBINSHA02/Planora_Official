// frontend/src/Components/tables/ClassroomScheduleTable.jsx
"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { TeacherScheduleGrid } from "./teachergrid"; 
import { useScheduleUI } from "../../context/ScheduleUIContext"; // Import the hook

const ClassroomScheduleTable = ({
  scheduleData: rawScheduleData = [],
  days,
  periods,
  teachers = [],
  subjects = [],
  classroomSubjects = [],
  onUpdateSchedule,
}) => {
  // Consume the new UI context
  const { hoveredTeacher, hoverPosition, showTeacherPreview, hideTeacherPreview } = useScheduleUI();

  // 🔹 DATA TRANSFORMER: Flat array to 2D Grid
  const scheduleGrid = useMemo(() => {
    const grid = days.map(() => periods.map(() => []));
    if (Array.isArray(rawScheduleData)) {
      rawScheduleData.forEach((slot) => {
        const d = Number(slot.day);
        const p = Number(slot.period);
        if (grid[d]?.[p]) {
          grid[d][p].push({
            _id: slot._id,
            teacher_id: slot.teacherId,
            subject: slot.subject,
          });
        }
      });
    }
    return grid;
  }, [rawScheduleData, days, periods]);

  // 🔹 SUB-COMPONENT: Custom Teacher Dropdown
  const CustomTeacherDropdown = ({ value, onChange, rowIndex, colIndex, filteredTeachers }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const hoverTimeoutRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
          hideTeacherPreview(); // Use context instead of local state
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedTeacher = teachers.find((t) => t._id === value);

    const handleTeacherHover = (teacher, event) => {
      if (!isOpen) return;
      clearTimeout(hoverTimeoutRef.current);

      hoverTimeoutRef.current = setTimeout(() => {
        const rect = event.target.getBoundingClientRect();
        // Use context to show preview
        showTeacherPreview(
          { ...teacher, currentDayIndex: rowIndex, currentPeriodIndex: colIndex },
          { x: rect.right + 10, y: rect.top }
        );
      }, 700);
    };

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
          className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-left flex justify-between items-center"
        >
          <span className="truncate">{selectedTeacher ? selectedTeacher.teachername : "Select Teacher"}</span>
          <span className={`transform transition-transform text-gray-500 ${isOpen ? "rotate-180" : ""}`}>▼</span>
        </button>
        {isOpen && (
          <div className="absolute z-40 w-full mt-1 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg max-h-48">
            <div className="px-2 py-1.5 text-xs text-gray-500 hover:bg-gray-100 cursor-pointer" onClick={() => { onChange(""); setIsOpen(false); }}>-- None --</div>
            {filteredTeachers.map((teacher) => (
              <div
                key={teacher._id}
                className="px-2 py-1.5 text-xs hover:bg-indigo-50 cursor-pointer border-t border-gray-100"
                onClick={() => { onChange(teacher._id); setIsOpen(false); hideTeacherPreview(); }}
                onMouseEnter={(e) => handleTeacherHover(teacher, e)}
                onMouseLeave={() => { clearTimeout(hoverTimeoutRef.current); hideTeacherPreview(); }}
              >
                <div className="font-medium text-gray-800">{teacher.teachername}</div>
                <div className="text-xs text-gray-500">{teacher.subjects?.join(", ")}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // 🔹 CELL RENDERER
  const renderCell = (assignments, rowIndex, colIndex) => {
    return (
      <div className="space-y-2">
        {assignments.map((assignment, index) => {
          const currentTeacherId = assignment.teacher_id || "";
          const currentSubject = assignment.subject || "";
          const availableTeachers = currentSubject ? teachers.filter(t => t.subjects?.includes(currentSubject)) : teachers;
          const baseSubjects = classroomSubjects.length > 0 ? classroomSubjects : subjects;
          const selectedTeacher = teachers.find(t => t._id === currentTeacherId);
          const availableSubjects = selectedTeacher?.subjects ? baseSubjects.filter(s => selectedTeacher.subjects.includes(s)) : baseSubjects;

          return (
            <div key={index} className="p-2 mb-2 text-left border rounded-md bg-gray-50">
              <CustomTeacherDropdown
                value={currentTeacherId}
                rowIndex={rowIndex}
                colIndex={colIndex}
                filteredTeachers={availableTeachers}
                onChange={(newId) => {
                  const updatedCell = [...scheduleGrid[rowIndex][colIndex]];
                  const item = { ...updatedCell[index], teacherId: newId, subject: updatedCell[index].subject };
                  onUpdateSchedule(rowIndex, colIndex, item);
                }}
              />
              <select
                value={currentSubject}
                onChange={(e) => {
                  const updatedCell = [...scheduleGrid[rowIndex][colIndex]];
                  const item = { ...updatedCell[index], teacherId: updatedCell[index].teacher_id, subject: e.target.value };
                  onUpdateSchedule(rowIndex, colIndex, item);
                }}
                className="w-full mt-1 px-2 py-1.5 text-xs border border-gray-300 rounded bg-white"
              >
                <option value="">Select Subject</option>
                {availableSubjects.map((s, idx) => (<option key={idx} value={s}>{s}</option>))}
              </select>
            </div>
          );
        })}
        <button
          onClick={() => onUpdateSchedule(rowIndex, colIndex, { teacherId: "", subject: "" })}
          className="w-full px-2 py-1 text-xs text-green-700 transition-colors border border-green-200 rounded bg-green-50 hover:bg-green-100"
        >
          + Assign
        </button>
      </div>
    );
  };

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-lg">
      <table className="min-w-full bg-white border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-300">
            <th className="w-32 px-4 py-3 text-sm font-bold text-left text-gray-700 border-r">Day / Period</th>
            {periods.map((p, i) => (<th key={i} className="px-4 py-3 text-sm font-bold text-center text-gray-700 border-r">{p}</th>))}
          </tr>
        </thead>
        <tbody>
          {scheduleGrid.map((row, rowIndex) => (
            <tr key={rowIndex} className="transition-colors border-b border-gray-200 hover:bg-gray-50">
              <td className="px-4 py-4 text-sm font-bold text-gray-800 border-r bg-gray-50">{days[rowIndex]}</td>
              {row.map((cell, colIndex) => (
                <td key={colIndex} className="border-r p-2 align-top min-w-[140px]">
                  {renderCell(cell, rowIndex, colIndex)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* RENDER THE GRID PREVIEW IF HOVERED */}
      {hoveredTeacher && (
        <TeacherScheduleGrid
          teacher={hoveredTeacher}
          position={hoverPosition}
          days={days}
          periods={periods}
          
        />
      )}
    </div>
  );
};

export default React.memo(ClassroomScheduleTable);