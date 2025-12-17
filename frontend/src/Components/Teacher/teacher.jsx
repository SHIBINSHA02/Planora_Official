// frontend/src/Components/Teacher/teacher.jsx
import React, { useEffect, useState } from "react";
import TeacherScheduleTable from "../tables/TeacherScheduleTable";

const Teacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const periods = ["Period 1", "Period 2", "Period 3", "Period 4", "Period 5", "Period 6"];

  // Effect 1: Fetch all teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        // ✅ FIX: Removed "http://localhost:3000" to use the Vite Proxy
        const response = await fetch("/api/teachers/");

        if (!response.ok) {
          throw new Error(`Failed to fetch teachers: ${response.statusText}`);
        }
        const data = await response.json();
        setTeachers(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load teacher list. Please check the server.");
      }
    };
    fetchTeachers();
  }, []);

  // Effect 2: Fetch the selected teacher’s schedule
  useEffect(() => {
    const fetchTeacherSchedule = async () => {
      if (!selectedTeacherId) {
        setScheduleData([]);
        return;
      }

      setLoading(true);
      setError("");

      try {
        // ✅ FIX: Removed "http://localhost:3000" to use the Vite Proxy
        const response = await fetch(`/api/teachers/${selectedTeacherId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch teacher details");
        }
        const teacher = await response.json();

        setScheduleData(teacher.schedule_grid || []);
      } catch (err) {
        console.error(err);
        setError("Error fetching teacher schedule. Please try again.");
        setScheduleData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherSchedule();
  }, [selectedTeacherId]);

  return (
    <div className="p-6  min-h-full">
      <h1 className="text-xl font-semibold  text-gray-900 mb-6">Teacher Schedule Viewer</h1>

      {/* Teacher Selection Dropdown */}
      <div className="mb-6">
        <label htmlFor="teacher-select" className="block text-sm font-medium text-gray-700 mb-1">
          Select a Teacher
        </label>
        <div className="relative w-full max-w-sm">
          <select
            id="teacher-select"
            value={selectedTeacherId}
            onChange={(e) => setSelectedTeacherId(e.target.value)}
            className={`w-full appearance-none rounded-md bg-white border border-gray-300 px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${selectedTeacherId ? "text-gray-900" : "text-gray-400"
              }`}
          >
            <option value="" disabled>
              -- Select a teacher --
            </option>
            {teachers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.teachername}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.114l3.71-3.884a.75.75 0 111.08 1.04l-4.24 4.44a.75.75 0 01-1.08 0l-4.24-4.44a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>
      </div>
          
      {/* Loading & Error States */}
      {loading && <p className="text-gray-600">Loading schedule...</p>}
      {error && <p className="text-red-600 font-medium">{error}</p>}

      {/* Schedule Table */}
      {selectedTeacherId && !loading && !error && (
        <>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Weekly Schedule Overview</h2>
          <TeacherScheduleTable
            scheduleData={scheduleData.length ? scheduleData : Array(5).fill(Array(6).fill(null))}
            days={days}
            periods={periods}
          />
        </>
      )}
    </div>
  );
};

export default Teacher;