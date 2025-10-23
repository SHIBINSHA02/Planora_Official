// frontend/src/Components/Classroom/classroom.jsx
// frontend/src/Components/Classroom/Classroom.jsx
import React, { useState, useEffect, useCallback } from "react";
import ClassroomScheduleView from "./ClassroomScheduleView.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";
import axios from "axios";

const CLASSROOM_API_URL = "http://localhost:3000/api/classrooms";
const TEACHER_API_URL = "http://localhost:3000/api/teachers";

const Classroom = () => {
  const [selectedClassroom, setSelectedClassroom] = useState("");
  const [classrooms, setClassrooms] = useState([]);
  const [classSchedules, setClassSchedules] = useState({});
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const classroomApiClient = axios.create({ baseURL: CLASSROOM_API_URL });
  const teacherApiClient = axios.create({ baseURL: TEACHER_API_URL });

  const fetchClassrooms = useCallback(async () => {
    try {
      const response = await classroomApiClient.get("/");
      const data = response.data?.data || [];
      setClassrooms(data);
      if (data.length > 0 && data[0].classroom_id) {
        setSelectedClassroom(data[0].classroom_id);
      }
    } catch (err) {
      console.error("❌ Error fetching classrooms:", err);
      setError("Failed to fetch classrooms. Please ensure the backend server is running.");
      setClassrooms([]);
    }
  }, []);

  const fetchTeachers = useCallback(async () => {
    try {
      const response = await teacherApiClient.get("/");
      setTeachers(response.data || []);
    } catch (err) {
      console.error("❌ Error fetching teachers:", err);
      // Non-critical error, so we just log it and show a warning
      setError("Warning: Could not fetch the teacher list.");
    }
  }, []);

  const fetchSchedule = useCallback(async (classroomId) => {
    if (!classroomId || classSchedules[classroomId]) return;
    try {
      setLoading(true);
      setError(null);
      const response = await classroomApiClient.get(`/${classroomId}/schedule`);
      const data = response.data?.schedule || [];
      setClassSchedules((prev) => ({ ...prev, [classroomId]: data }));
    } catch (err) {
      console.error(`❌ Error fetching schedule for ${classroomId}:`, err);
      setError("Failed to fetch the schedule for the selected classroom.");
    } finally {
      setLoading(false);
    }
  }, [classSchedules]);

  const handleUpdateSchedule = async (classroomId, dayIndex, periodIndex, teacherId, subject) => {
    const originalSchedule = classSchedules[classroomId];
    if (!originalSchedule) return;

    // Deep copy the schedule to avoid direct state mutation
    const newSchedule = JSON.parse(JSON.stringify(originalSchedule));

    // Update the specific cell. An empty teacher/subject clears the slot.
    if (!teacherId && !subject) {
      newSchedule[dayIndex][periodIndex] = []; // Clear the slot
    } else {
      newSchedule[dayIndex][periodIndex] = [{
        teacher_id: teacherId || null,
        subject: subject || null,
      }];
    }

    // Optimistically update the UI for a responsive feel
    setClassSchedules(prev => ({ ...prev, [classroomId]: newSchedule }));

    try {
      // Send the entire updated schedule object to the backend
      await classroomApiClient.put(`/${classroomId}`, {
        schedule: newSchedule,
      });
      // On success, no further action is needed as the UI is already updated.
    } catch (err) {
      console.error("❌ Failed to update schedule on the server:", err);
      setError("Failed to save the schedule. Your changes have been reverted.");
      // If the API call fails, revert the state to the original schedule
      setClassSchedules(prev => ({ ...prev, [classroomId]: originalSchedule }));
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchClassrooms(), fetchTeachers()]).finally(() => {
      setLoading(false);
    });
  }, [fetchClassrooms, fetchTeachers]);

  useEffect(() => {
    if (selectedClassroom) {
      fetchSchedule(selectedClassroom);
    }
  }, [selectedClassroom, fetchSchedule]);

  return (
    <ErrorBoundary>
      <div className="p-4 md:p-6 lg:p-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">📚 Classroom Management</h2>

        {loading && <p className="text-center p-4 text-blue-500">Loading...</p>}
        {error && <p className="text-red-500 bg-red-100 p-3 rounded-md my-4">{error}</p>}

        <div className="mb-6">
          <label htmlFor="classroom-select" className="block text-lg font-semibold mb-2 text-gray-700">
            Select a Classroom:
          </label>
          {classrooms.length > 0 ? (
            <select
              id="classroom-select"
              value={selectedClassroom}
              onChange={(e) => setSelectedClassroom(e.target.value)}
              className="block w-full md:w-1/2 lg:w-1/3 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            >
              {classrooms.map((cls) => (
                <option key={cls._id} value={cls.classroom_id}>
                  {cls.classname}
                </option>
              ))}
            </select>
          ) : (
            !loading && <p className="text-gray-500">No classrooms available to select.</p>
          )}
        </div>

        {selectedClassroom && !error && classSchedules[selectedClassroom] && (
          <ClassroomScheduleView
            classrooms={classrooms}
            selectedClassroom={selectedClassroom}
            classSchedules={classSchedules}
            setSelectedClassroom={setSelectedClassroom}
            teachers={teachers}
            handleUpdateSchedule={handleUpdateSchedule}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Classroom;