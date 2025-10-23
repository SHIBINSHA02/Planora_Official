// frontend/src/Components/tables/ScheduleTable.jsx
"use client"

import React, { useState, useRef, useEffect } from "react"
import { TeacherScheduleGrid } from "./teachergrid" // Keep this import

const ScheduleTable = ({
  scheduleData,
  days,
  periods,
  teachers = [],
  subjects = [],
  onUpdateSchedule, // This will be provided by the parent and is the key to saving data
  type = "classroom",
  // All other props from your original component are kept
  onAddAssignment,
  onRemoveAssignment,
}) => {
  // Your state hooks are kept
  const [isMultiSelect, setIsMultiSelect] = useState(false)
  const [isMultiAssign, setIsMultiAssign] = useState(false)
  const [hoveredTeacher, setHoveredTeacher] = useState(null)
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 })

  // Your CustomTeacherDropdown component with internal fixes
  const CustomTeacherDropdown = ({ value, onChange, teachers, rowIndex, colIndex }) => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)
    const hoverTimeoutRef = useRef(null)
    const hideTimeoutRef = useRef(null)

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false)
          setHoveredTeacher(null)
          if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
          if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
      }
    }, [])

    // --- FIX 1: Find teacher by `_id`, not `id` ---
    const selectedTeacher = teachers.find(t => t._id === value)

    const handleTeacherHover = (teacher, event) => {
      if (!isOpen) return
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
      hoverTimeoutRef.current = setTimeout(() => {
        if (isOpen) {
          const rect = event.target.getBoundingClientRect()
          setHoveredTeacher({ ...teacher, currentDayIndex: rowIndex, currentPeriodIndex: colIndex })
          setHoverPosition({ x: rect.right, y: rect.top })
        }
      }, 800)
    }

    const handleTeacherLeave = () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
      hideTimeoutRef.current = setTimeout(() => { setHoveredTeacher(null) }, 150)
    }

    const handleSelect = (teacherId) => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
      setHoveredTeacher(null)
      setIsOpen(false)
      onChange(teacherId)
    }

    const handleDropdownToggle = (e) => {
      e.preventDefault(); e.stopPropagation();
      if (isOpen) {
        setHoveredTeacher(null)
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
      }
      setIsOpen(!isOpen)
    }

    return (
      <div className="relative" ref={dropdownRef}>
        <button onClick={handleDropdownToggle} onMouseDown={(e) => e.preventDefault()} className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-left flex justify-between items-center">
          <span className="truncate">{selectedTeacher ? (selectedTeacher.teachername || selectedTeacher.name) : 'Select Teacher'}</span>
          <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
        </button>
        {isOpen && (
          <div className="absolute z-40 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-40 overflow-y-auto">
            <div className="px-2 py-1 text-xs hover:bg-gray-100 cursor-pointer" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSelect('') }}>
              Select Teacher
            </div>
            {teachers.map((teacher) => (
              // --- FIX 2: Use `_id` for key and selection ---
              <div key={teacher._id} className="px-2 py-1 text-xs hover:bg-blue-50 cursor-pointer border-b last:border-b-0" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSelect(teacher._id) }} onMouseEnter={(e) => setTimeout(() => handleTeacherHover(teacher, e), 100)} onMouseLeave={handleTeacherLeave}>
                <div className="font-medium">{teacher.teachername || teacher.name}</div>
                <div className="text-gray-500 text-xs">{teacher.subjects?.join(', ') || 'All subjects'}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderClassroomCell = (cell, rowIndex, colIndex) => {
    // Your `normalized` logic is kept
    const assignment = (Array.isArray(cell) && cell.length > 0) ? cell[0] : {};
    // --- FIX 3: Use the correct field `teacher_id` from your API data ---
    const currentTeacherId = assignment.teacher_id || "";
    const currentSubject = assignment.subject || "";

    // --- FIX 4: This is the crucial logic change to filter teachers based on availability ---
    const availableTeachers = teachers.filter(teacher => {
      const isTeacherFree = teacher.schedule_grid?.[rowIndex]?.[colIndex] === null;
      const isCurrentlyAssigned = teacher._id === currentTeacherId;
      return isTeacherFree || isCurrentlyAssigned;
    });

    // Your sorting logic is kept
    const sortedTeachers = [...availableTeachers].sort((a, b) => (a.teachername || '').localeCompare(b.teachername || ''))
    const sortedSubjects = [...subjects].sort((a, b) => a.localeCompare(b))

    const handleClear = () => {
      // --- FIX 5: Wire up the clear button to the main update function ---
      onUpdateSchedule(rowIndex, colIndex, "", "");
    }

    const handleTeacherChange = (newTeacherId) => {
      // --- FIX 6: Wire up teacher changes to the main update function ---
      // We check for `isMultiSelect` to preserve your feature's logic path
      if (isMultiSelect && onAddAssignment) {
        onAddAssignment(rowIndex, colIndex, { teacher_id: newTeacherId, subject: currentSubject });
      } else {
        onUpdateSchedule(rowIndex, colIndex, newTeacherId, currentSubject);
      }
    }

    const handleSubjectChange = (newSubject) => {
        // --- FIX 7: Wire up subject changes to the main update function ---
        if (isMultiAssign && onAddAssignment) {
            onAddAssignment(rowIndex, colIndex, { subject: newSubject, teacher_id: currentTeacherId });
        } else {
            onUpdateSchedule(rowIndex, colIndex, currentTeacherId, newSubject);
        }
    }

    return (
      <div className="space-y-1">
        {(currentTeacherId || currentSubject) && (
          <button onClick={handleClear} className="w-full px-2 py-1 text-xs bg-red-100 text-red-600 border border-red-200 rounded hover:bg-red-200">
            Clear
          </button>
        )}
        <div className="flex items-center space-x-2">
          {isMultiSelect && <span className="text-green-500 text-lg">+</span>}
          <div className="flex-1">
            <CustomTeacherDropdown value={currentTeacherId} onChange={handleTeacherChange} teachers={sortedTeachers} rowIndex={rowIndex} colIndex={colIndex}/>
          </div>
          {isMultiSelect && <span className="text-red-500 text-lg">−</span>}
        </div>
        <div className="flex items-center space-x-2">
          {isMultiAssign && <span className="text-green-500 text-lg">+</span>}
          <div className="flex-1">
            <select value={currentSubject} onChange={(e) => handleSubjectChange(e.target.value)} className="w-full px-2 py-1 text-xs border border-gray-200 rounded">
              <option value="">Select Subject</option>
              {sortedSubjects.map((subject) => (<option key={subject} value={subject}>{subject}</option>))}
            </select>
          </div>
          {isMultiAssign && <span className="text-red-500 text-lg">−</span>}
        </div>
        <div className="text-xs text-gray-500 pt-1">
          {availableTeachers.length} teacher{availableTeachers.length !== 1 ? "s" : ""} available
        </div>
      </div>
    )
  }

  // Your original renderTeacherCell function is untouched
  const renderTeacherCell = (cell) => {
    if (cell) {
      return (
        <div className="bg-blue-100 p-2 rounded text-xs">
          <div className="font-semibold text-blue-800">{cell.classroom}</div>
          <div className="text-blue-600">{cell.subject}</div>
          <div className="text-blue-500">{cell.grade}</div>
        </div>
      )
    }
    return <div className="text-gray-400 text-xs">Free</div>
  }

  return (
    <div className="overflow-x-auto shadow-lg rounded-lg relative">
      {/* Your UI for multi-select buttons is untouched */}
      {type === "classroom" && (
        <div className="mb-4 flex space-x-4 p-4 bg-gray-50 border-b">
          <button onClick={() => setIsMultiSelect(!isMultiSelect)} className={`px-4 py-2 text-sm font-medium rounded ${isMultiSelect ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}>
            {isMultiSelect ? "Disable Multi-Teacher" : "Enable Multi-Teacher"}
          </button>
          <button onClick={() => setIsMultiAssign(!isMultiAssign)} className={`px-4 py-2 text-sm font-medium rounded ${isMultiAssign ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}>
            {isMultiAssign ? "Disable Multi-Assign" : "Enable Multi-Assign"}
          </button>
        </div>
      )}
      <table className="min-w-full border-collapse border border-gray-300">
        <thead><tr className="bg-gray-100"><th className="border px-4 py-2 text-left font-semibold">Day/Period</th>{periods.map((period, index) => (<th key={index} className="border px-4 py-2 text-center font-semibold">{period}</th>))}</tr></thead>
        <tbody>
          {scheduleData && scheduleData.map((row, rowIndex) => (
            <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="border px-4 py-2 font-semibold bg-gray-100 align-middle">{days[rowIndex]}</td>
              {row.map((cell, colIndex) => (<td key={`${rowIndex}-${colIndex}`} className="border p-2 text-center align-top">{type === "classroom" ? renderClassroomCell(cell, rowIndex, colIndex) : renderTeacherCell(cell)}</td>))}
            </tr>
          ))}
        </tbody>
      </table>
      {/* Your hover grid overlay is untouched and will work correctly */}
      {hoveredTeacher && (
        <TeacherScheduleGrid teacher={hoveredTeacher} position={hoverPosition} currentDayIndex={hoveredTeacher.currentDayIndex} currentPeriodIndex={hoveredTeacher.currentPeriodIndex} setHoveredTeacher={setHoveredTeacher} days={days} periods={periods}/>
      )}
    </div>
  )
}

export default React.memo(ScheduleTable)