// frontend/src/Components/Classroom/classroom.jsx
import React, { useState, useEffect, useCallback } from "react";
import ClassroomScheduleView from "./ClassroomScheduleView.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";
import axios from "axios";

// NOTE: Ensure your backend server is running on port 3000
const CLASSROOM_API_URL = "/api/classrooms";
const TEACHER_API_URL = "/api/teachers";

const Classroom = () => {
  const [selectedClassroom, setSelectedClassroom] = useState("");
  const [classrooms, setClassrooms] = useState([]);
  const [classSchedules, setClassSchedules] = useState({});
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ----------------------------------------------------
  // FIX IMPLEMENTED HERE: Adding withCredentials: true
  // ----------------------------------------------------
  const classroomApiClient = axios.create({
    baseURL: CLASSROOM_API_URL,
    withCredentials: true, // CRITICAL FIX for network/CORS issues with auth
  });
  const teacherApiClient = axios.create({
    baseURL: TEACHER_API_URL,
    withCredentials: true, // CRITICAL FIX for network/CORS issues with auth
  });

  // ... (fetchClassrooms, fetchTeachers, fetchSchedule functions remain unchanged)
  const fetchClassrooms = useCallback(async () => {
    try {
      // Using classroomApiClient
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
      // Using teacherApiClient
      const response = await teacherApiClient.get("/");
      setTeachers(response.data || []);
    } catch (err) {
      console.error("❌ Error fetching teachers:", err);
      setError("Warning: Could not fetch the teacher list.");
    }
  }, []);

  const fetchSchedule = useCallback(async (classroomId) => {
    if (!classroomId || classSchedules[classroomId]) return;
    try {
      setLoading(true);
      setError(null);
      // Using classroomApiClient
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


  const handleUpdateSchedule = async (classroomId, dayIndex, periodIndex, updatedAssignmentsArray) => {
    const originalClassroomSchedule = classSchedules[classroomId];
    const originalTeachersState = teachers;
    if (!originalClassroomSchedule) return;

    const validAssignments = updatedAssignmentsArray.filter(
      (assignment) => assignment.teacher_id && assignment.subject
    );

    const newUiSchedule = JSON.parse(JSON.stringify(originalClassroomSchedule));
    newUiSchedule[dayIndex][periodIndex] = updatedAssignmentsArray;

    const updatedTeachers = originalTeachersState.map((teacher) => {
      const newGrid = JSON.parse(JSON.stringify(teacher.schedule_grid));
      const currentClassroom = classrooms.find((c) => c.classroom_id === classroomId);
      const existingAssignmentsInSlot = teacher.schedule_grid[dayIndex][periodIndex] || [];
      const assignmentsFromOtherClasses = Array.isArray(existingAssignmentsInSlot)
        ? existingAssignmentsInSlot.filter(asgn => asgn.classroomId !== classroomId)
        : [];
      const newAssignmentsFromCurrentClass = validAssignments
        .filter(a => a.teacher_id === teacher._id)
        .map(assignment => ({
          classroomId: classroomId,
          classroomName: currentClassroom?.classname || "Unknown",
          subject: assignment.subject,
        }));
      const combinedAssignments = [...assignmentsFromOtherClasses, ...newAssignmentsFromCurrentClass];
      if (combinedAssignments.length > 0) {
        newGrid[dayIndex][periodIndex] = combinedAssignments;
      } else {
        newGrid[dayIndex][periodIndex] = null;
      }
      return { ...teacher, schedule_grid: newGrid };
    });

    setClassSchedules((prev) => ({ ...prev, [classroomId]: newUiSchedule }));
    setTeachers(updatedTeachers);

    try {
      const backendSchedule = JSON.parse(JSON.stringify(originalClassroomSchedule));
      backendSchedule[dayIndex][periodIndex] = validAssignments;

      const apiPromises = [];
      apiPromises.push(classroomApiClient.put(`/${classroomId}`, { schedule: backendSchedule }));

      // ✅ Logic for teachers who were affected remains correct
      // 1. Get teachers from the ORIGINAL state of the slot.
      const originalAssignments = originalClassroomSchedule[dayIndex][periodIndex] || [];
      const originalTeacherIds = originalAssignments.map(a => a.teacher_id);

      // 2. Get teachers from the NEW state of the slot.
      const newTeacherIds = validAssignments.map(a => a.teacher_id);

      // 3. Combine them and get a unique list of every teacher whose schedule might have changed.
      const allAffectedTeacherIds = [...new Set([...originalTeacherIds, ...newTeacherIds])];

      // 4. Loop through this complete list to send updates.
      for (const teacherId of allAffectedTeacherIds) {
        const teacherToUpdate = updatedTeachers.find((t) => t._id === teacherId);
        // The teacherToUpdate object already contains the correctly cleared or updated schedule grid.
        if (teacherToUpdate && teacherToUpdate.teacherid) {
          apiPromises.push(teacherApiClient.put(`/${teacherToUpdate.teacherid}`, { schedule_grid: teacherToUpdate.schedule_grid }));
        }
      }

      await Promise.all(apiPromises);

    } catch (err) {
      console.error("❌ Synchronization Failed:", err);
      setError("Failed to save changes. Reverting.");
      setClassSchedules((prev) => ({ ...prev, [classroomId]: originalClassroomSchedule }));
      setTeachers(originalTeachersState);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchClassrooms(), fetchTeachers()]).finally(() => setLoading(false));
  }, [fetchClassrooms, fetchTeachers]);

  useEffect(() => {
    if (selectedClassroom) fetchSchedule(selectedClassroom);
  }, [selectedClassroom, fetchSchedule]);

  // ... (return statement with JSX remains unchanged)
  return (
    <ErrorBoundary>
      <div className="p-4 md:p-6 lg:p-8">
        {loading && <p className="text-center p-4 text-blue-500">Loading...</p>}
        {error && <p className="text-red-500 bg-red-100 p-3 rounded-md my-4">{error}</p>}

        <div className="mb-6">
          <label
            htmlFor="classroom-select"
            className="block text-lg font-semibold mb-2 text-gray-700"
          >
            Select a Classroom:
          </label>

          {classrooms.length > 0 ? (
            <select
              id="classroom-select"
              value={selectedClassroom}
              onChange={(e) => setSelectedClassroom(e.target.value)}
              className="block w-full md:w-1/2 lg:w-1/3 p-2 border border-gray-300 rounded-md shadow-sm"
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
            teachers={teachers}
            handleUpdateSchedule={handleUpdateSchedule}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Classroom;