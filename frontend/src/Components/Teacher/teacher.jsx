// frontend/src/Components/Teacher/teacher.jsx
import React, { useEffect, useState } from "react";
import ScheduleTable from "../tables/ScheduleTable";

const Teacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const periods = ["Period 1", "Period 2", "Period 3", "Period 4", "Period 5", "Period 6"];

  // 🔹 1. Fetch all teachers when component mounts
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/teachers/");
        if (!response.ok) throw new Error(`Failed to fetch teachers: ${response.statusText}`);
        const data = await response.json();
        setTeachers(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load teacher list. Please check your server.");
      }
    };
    fetchTeachers();
  }, []);

  // 🔹 2. Fetch selected teacher’s schedule
  useEffect(() => {
    const fetchTeacherSchedule = async () => {
      if (!selectedTeacherId) return;
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`http://localhost:3000/api/teachers/${selectedTeacherId}`);
        if (!response.ok) throw new Error("Failed to fetch teacher details");
        const teacher = await response.json();

        // ✅ Update schedule grid dynamically from backend
        setScheduleData(teacher.schedule_grid || []);
      } catch (err) {
        console.error(err);
        setError("Error fetching teacher schedule. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherSchedule();
  }, [selectedTeacherId]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Teacher</h1>

      {/* Teacher Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
        <div className="relative w-[400px]">
          <select
            value={selectedTeacherId}
            onChange={(e) => setSelectedTeacherId(e.target.value)}
            className={`w-full appearance-none rounded-md bg-white border border-gray-300 px-3 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 ${
              selectedTeacherId ? "text-gray-900" : "text-gray-400"
            }`}
          >
            <option value="" disabled>
              Select a teacher
            </option>
            {teachers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.teachername}
              </option>
            ))}
          </select>

          {/* Dropdown Icon */}
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
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
      {loading && <p className="text-gray-600 mb-2">Loading schedule...</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}

      {/* Schedule Table */}
      {selectedTeacherId && !loading && (
        <>
          <div className="mb-2 text-gray-700 font-medium">Weekly Schedule Overview</div>
          <ScheduleTable
            scheduleData={scheduleData.length ? scheduleData : Array(5).fill(Array(6).fill(null))}
            days={days}
            periods={periods}
            teachers={teachers}
            onUpdateSchedule={() => {}}
            type="teacher"
            teacherSchedules={{}}
          />
        </>
      )}
    </div>
  );
};

export default Teacher;
