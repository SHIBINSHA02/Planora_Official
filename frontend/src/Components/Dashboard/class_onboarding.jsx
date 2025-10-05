import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const API_BASE = "http://localhost:3000"; // backend base URL
const TEACHERS_API = `${API_BASE}/api/teachers`;
const CLASSROOM_API = `${API_BASE}/api/classrooms`;

// Utility: generate empty 5x6 schedule matrix
const generateEmptySchedule = () => {
  const DAYS = 5;
  const PERIODS = 6;
  return Array(DAYS)
    .fill(0)
    .map(() => Array(PERIODS).fill(0).map(() => []));
};

const ClassOnboarding = () => {
  // --- Form State ---
  const [className, setClassName] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [subject, setSubject] = useState("");
  const [count, setCount] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [assignedTeachers, setAssignedTeachers] = useState([]);

  // --- UI State ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState(null);

  // --- Data State ---
  const [teachers, setTeachers] = useState([]); // Initially empty
  const [availableSubjects, setAvailableSubjects] = useState([]);

  // --- SOCKET CONNECTION ---
  useEffect(() => {
    // Fetch initial teacher list from API
    const fetchTeachers = async () => {
      try {
        const response = await fetch(TEACHERS_API);
        if (response.ok) {
          const data = await response.json();
          setTeachers(data);
          const allSubjects = Array.from(new Set(data.flatMap(t => t.subjects || [])));
          setAvailableSubjects(allSubjects);
        } else {
          console.error("Failed to fetch teachers from API");
        }
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchTeachers();

    // Connect to Socket.IO backend
    const socket = io(API_BASE);

    socket.on("connect", () => {
      console.log("🟢 Connected to backend socket:", socket.id);
    });

    socket.on("teacher_added", (newTeacher) => {
      console.log("👩‍🏫 New teacher received via socket:", newTeacher);
      setTeachers(prev => {
        const exists = prev.some(t => t._id === newTeacher._id);
        return exists ? prev : [...prev, newTeacher];
      });
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // --- Memoized Data ---
  const teacherNames = useMemo(() => teachers.map(t => t.teachername), [teachers]);
  const selectedTeacher = useMemo(() => teachers.find(t => t.teachername === teacherName), [teacherName, teachers]);

  // --- Dynamic Subject Options ---
  useEffect(() => {
    setSubmissionMessage(null);

    if (!teacherName) {
      const allSubjects = Array.from(new Set(teachers.flatMap(t => t.subjects || [])));
      setAvailableSubjects(allSubjects);
      return;
    }

    if (selectedTeacher && Array.isArray(selectedTeacher.subjects)) {
      setAvailableSubjects(selectedTeacher.subjects);
      if (!selectedTeacher.subjects.includes(subject)) setSubject("");
    } else {
      const allSubjects = Array.from(new Set(teachers.flatMap(t => t.subjects || [])));
      setAvailableSubjects(allSubjects);
    }
  }, [teacherName, teachers, subject, selectedTeacher]);

  // --- Add Teacher Assignment ---
  const handleAddTeacher = () => {
    const trimmedTeacher = teacherName.trim();
    const trimmedSubject = subject.trim();
    const numericCount = Number(count);

    if (!trimmedTeacher || !trimmedSubject || numericCount <= 0) {
      setSubmissionMessage({ type: "error", text: "Please select a valid teacher, subject, and time." });
      return;
    }

    const isDuplicate = assignedTeachers.some(
      t => t.teacherName === trimmedTeacher && t.subject === trimmedSubject
    );

    if (isDuplicate) {
      setSubmissionMessage({ type: "error", text: "This teacher-subject combination already exists." });
      return;
    }

    setAssignedTeachers(prev => [
      ...prev,
      {
        teacherName: trimmedTeacher,
        teacherId: selectedTeacher.teacherid,
        subject: trimmedSubject,
        count: numericCount,
      },
    ]);

    setTeacherName("");
    setSubject("");
    setCount("");
    setSubmissionMessage({
      type: "success",
      text: `Added ${trimmedTeacher} for ${trimmedSubject} (${numericCount} hrs/week).`,
    });
  };

  // --- Remove Assignment ---
  const handleRemoveTeacher = index => {
    setAssignedTeachers(prev => prev.filter((_, i) => i !== index));
    setSubmissionMessage(null);
  };

  // --- Submit Form ---
  const handleSubmit = async e => {
    e.preventDefault();

    const trimmedClass = className.trim();
    const trimmedAdmin = adminEmail.trim();

    if (!trimmedClass || !trimmedAdmin || assignedTeachers.length === 0) {
      setSubmissionMessage({
        type: "error",
        text: "Class name, admin email, and at least one assignment are required.",
      });
      return;
    }

    const subjectsPayload = assignedTeachers.map(t => ({
      subject: t.subject,
      teachername: t.teacherName,
      time: Number(t.count),
    }));

    const payload = {
      classroom_id: trimmedClass.toUpperCase().replace(/[^A-Z0-9]/g, "-") + "-ID",
      classname: trimmedClass,
      admin: trimmedAdmin,
      subjects: subjectsPayload,
      schedule: generateEmptySchedule(),
    };

    try {
      setIsSubmitting(true);
      setSubmissionMessage(null);

      const response = await fetch(CLASSROOM_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setClassName("");
        setAdminEmail("");
        setAssignedTeachers([]);
        setSubmissionMessage({
          type: "success",
          text: `Classroom created successfully! ID: ${result.classroom_id || payload.classroom_id}`,
        });
      } else {
        setSubmissionMessage({
          type: "error",
          text: result.message || "Server error while creating classroom.",
        });
      }
    } catch (err) {
      console.error("Error submitting data:", err);
      setSubmissionMessage({ type: "error", text: "Network error: Cannot reach server." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Styling Helper ---
  const getMessageClasses = type => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-700 border-green-400";
      case "error":
        return "bg-red-100 text-red-700 border-red-400";
      default:
        return "bg-blue-100 text-blue-700 border-blue-400";
    }
  };
  // --- Render UI ---
  return (
    <div className="p-6 max-w-2xl mx-auto bg-gray-50 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6 border-b pb-2">
        Class Schedule Onboarding
      </h2>

      {submissionMessage && (
        <div
          className={`p-3 mb-4 rounded-lg border text-sm transition-opacity duration-300 ${getMessageClasses(
            submissionMessage.type
          )}`}
        >
          {submissionMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-gray-700">
        {/* Class Name */}
        <div className="space-y-2">
          <label htmlFor="className" className="block text-sm font-medium text-gray-700">
            Class Name
          </label>
          <input
            id="className"
            type="text"
            value={className}
            onChange={e => setClassName(e.target.value)}
            placeholder="e.g., 9th Grade - Section A"
            className="w-full rounded-md bg-white border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 shadow-sm"
          />
        </div>

        {/* Admin Email */}
        <div className="space-y-2">
          <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700">
            Admin Email
          </label>
          <input
            id="adminEmail"
            type="email"
            value={adminEmail}
            onChange={e => setAdminEmail(e.target.value)}
            placeholder="administrator@school.edu"
            className="w-full rounded-md bg-white border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 shadow-sm"
          />
        </div>

        {/* Assignment Section */}
        <div className="border border-gray-200 p-4 rounded-lg bg-white shadow-inner">
          <h3 className="text-md font-semibold text-indigo-600 mb-4">Assign Teacher & Hours</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="teacherName" className="block text-sm font-medium text-gray-700">
                Teacher
              </label>
              <select
                id="teacherName"
                value={teacherName}
                onChange={e => setTeacherName(e.target.value)}
                className="w-full rounded-md bg-white border border-gray-300 px-4 py-2 pr-8 focus:ring-2 focus:ring-indigo-600 shadow-sm"
              >
                <option value="">Select a teacher</option>
                {teacherNames.map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <select
                id="subject"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                disabled={!teacherName}
                className={`w-full rounded-md border border-gray-300 px-4 py-2 pr-8 focus:ring-2 focus:ring-indigo-600 shadow-sm ${
                  !teacherName ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                }`}
              >
                <option value="">Select subject</option>
                {availableSubjects.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="count" className="block text-sm font-medium text-gray-700">
                Hours/Week
              </label>
              <input
                id="count"
                type="number"
                min="1"
                value={count}
                onChange={e => setCount(e.target.value)}
                placeholder="e.g. 4"
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600 shadow-sm"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={handleAddTeacher}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 shadow-md"
            >
              Add Assignment
            </button>
          </div>
        </div>

        {/* Display Assigned Teachers */}
        {assignedTeachers.length > 0 && (
          <div className="pt-2">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Current Assignments ({assignedTeachers.length})
            </h3>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-inner">
              <ul className="divide-y divide-gray-100">
                {assignedTeachers.map((t, idx) => (
                  <li
                    key={`${t.teacherName}-${t.subject}-${idx}`}
                    className="flex justify-between items-center p-3 text-sm hover:bg-gray-50"
                  >
                    <span className="font-medium text-gray-800">
                      {t.teacherName} (ID: {t.teacherId})
                    </span>
                    <span className="text-gray-600">
                      teaches <strong className="text-indigo-600">{t.subject}</strong> for{" "}
                      <strong>{t.count} hrs/week</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTeacher(idx)}
                      className="text-red-500 hover:text-red-700 text-lg ml-4"
                      title="Remove assignment"
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full font-semibold py-3 rounded-lg shadow-lg ${
              isSubmitting
                ? "bg-indigo-400 text-white cursor-not-allowed flex items-center justify-center"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Class Schedule"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClassOnboarding;
