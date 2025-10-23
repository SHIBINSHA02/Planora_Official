// frontend/src/Components/Classroom/classroom.jsx
import React, { useState, useEffect } from "react";
import ClassroomScheduleView from "./ClassroomScheduleView.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/classrooms";

const Classroom = () => {
  const [selectedClassroom, setSelectedClassroom] = useState(""); // Will hold the 'classroom_id' like "S7R1-ID"
  const [classrooms, setClassrooms] = useState([]);
  const [classSchedules, setClassSchedules] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
  });

  const fetchClassrooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get("/");
      const data = response.data?.data || [];
      setClassrooms(data);
      
      if (data.length > 0 && data[0].classroom_id) {
        setSelectedClassroom(data[0].classroom_id);
      }
    } catch (err) {
      console.error("❌ Error fetching classrooms:", err);
      setError("Failed to fetch classrooms. Please check the connection.");
      setClassrooms([]);
    } finally {
      setLoading(false);
    }
  };


  const fetchSchedule = async (classroomId) => {
    if (!classroomId) {
      console.warn("⚠️ No classroom ID provided to fetch schedule");
      return;
    }
    if (classSchedules[classroomId]) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get(`/${classroomId}/schedule`);
      const data = response.data?.schedule || Array(5).fill(Array(6).fill([]));
      setClassSchedules((prev) => ({
        ...prev,
        [classroomId]: data,
      }));
    } catch (err) {
      console.error(`❌ Error fetching schedule for ${classroomId}:`, err);
      setError("Failed to fetch the schedule. Please ensure the classroom ID is correct.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  useEffect(() => {
    if (selectedClassroom) {
      fetchSchedule(selectedClassroom);
    }
  }, [selectedClassroom]);
  

  return (
    <ErrorBoundary>
      <div className="p-4 md:p-6 lg:p-8">
        

        {/* Display a single loading indicator for a better user experience */}
        {loading && <p className="text-center p-4 text-blue-500">Loading...</p>}
        
        {error && <p className="text-red-500 bg-red-100 p-3 rounded-md my-4">{error}</p>}

        

        {/* --- THIS IS THE FIX --- */}
        {/* Only render the schedule view IF the schedule for the selected classroom exists */}
        {selectedClassroom && !error && classSchedules[selectedClassroom] && (
          <ClassroomScheduleView
            classrooms={classrooms}
            selectedClassroom={selectedClassroom}
            classSchedules={classSchedules}
            setSelectedClassroom={setSelectedClassroom}
            fetchSchedule={fetchSchedule}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Classroom;