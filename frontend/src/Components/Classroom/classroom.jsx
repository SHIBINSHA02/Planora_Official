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

  const handleUpdateSchedule = async (classroomId, dayIndex, periodIndex, newTeacherMongoId, subject) => {
    const originalClassroomSchedule = classSchedules[classroomId];
    const originalTeachersState = teachers;
    if (!originalClassroomSchedule) return;

    const oldAssignment = (originalClassroomSchedule[dayIndex][periodIndex] || [])[0];
    const oldTeacherMongoId = oldAssignment ? oldAssignment.teacher_id : null;

    if (oldTeacherMongoId === newTeacherMongoId && oldAssignment?.subject === subject) return;

    const updatedTeachers = originalTeachersState.map(teacher => {
      // Case 1: This teacher is being assigned or updated in the slot.
      if (teacher._id === newTeacherMongoId) {
        const newGrid = JSON.parse(JSON.stringify(teacher.schedule_grid));
        const currentClassroom = classrooms.find(c => c.classroom_id === classroomId);
        
        newGrid[dayIndex][periodIndex] = {
          classroomId: classroomId,
          classroomName: currentClassroom?.classname || 'Unknown',
          subject: subject || 'Unassigned'
        };
        return { ...teacher, schedule_grid: newGrid };
      }
      // Case 2: This teacher is being removed from the slot.
      if (teacher._id === oldTeacherMongoId) {
        const newGrid = JSON.parse(JSON.stringify(teacher.schedule_grid));
        newGrid[dayIndex][periodIndex] = null;
        return { ...teacher, schedule_grid: newGrid };
      }
      return teacher;
    });

    const newClassroomSchedule = JSON.parse(JSON.stringify(originalClassroomSchedule));
    newClassroomSchedule[dayIndex][periodIndex] = (!newTeacherMongoId && !subject) ? [] : [{ teacher_id: newTeacherMongoId || null, subject: subject || null }];

    setClassSchedules(prev => ({ ...prev, [classroomId]: newClassroomSchedule }));
    setTeachers(updatedTeachers);

    try {
      const apiPromises = [];
      apiPromises.push(classroomApiClient.put(`/${classroomId}`, { schedule: newClassroomSchedule }));
      
      const oldTeacher = originalTeachersState.find(t => t._id === oldTeacherMongoId);
      const newTeacher = originalTeachersState.find(t => t._id === newTeacherMongoId);

      if (oldTeacher) {
        const updatedOldTeacher = updatedTeachers.find(t => t._id === oldTeacherMongoId);
        apiPromises.push(teacherApiClient.put(`/${oldTeacher.teacherid}`, { schedule_grid: updatedOldTeacher.schedule_grid }));
      }
      
      if (newTeacher && newTeacherMongoId !== oldTeacherMongoId) {
        const updatedNewTeacher = updatedTeachers.find(t => t._id === newTeacherMongoId);
        apiPromises.push(teacherApiClient.put(`/${newTeacher.teacherid}`, { schedule_grid: updatedNewTeacher.schedule_grid }));
      } else if (newTeacher && newTeacherMongoId === oldTeacherMongoId) {
         const updatedTeacher = updatedTeachers.find(t => t._id === newTeacherMongoId);
         apiPromises.push(teacherApiClient.put(`/${updatedTeacher.teacherid}`, { schedule_grid: updatedTeacher.schedule_grid }));
      }
      
      await Promise.all(apiPromises);

    } catch (err) {
      console.error("❌ Synchronization Failed:", err);
      setError("Failed to save changes. Reverting.");
      setClassSchedules(prev => ({ ...prev, [classroomId]: originalClassroomSchedule }));
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

  return (
    <ErrorBoundary>
      <div className="p-4 md:p-6 lg:p-8">
      
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
              className="block w-full md:w-1/2 lg:w-1/3 p-2 border border-gray-300 rounded-md shadow-sm"
              disabled={loading}
            >
              {classrooms.map((cls) => (
                <option key={cls._id} value={cls.classroom_id}>{cls.classname}</option>
              ))}
            </select>
          ) : (!loading && <p className="text-gray-500">No classrooms available to select.</p>)}
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