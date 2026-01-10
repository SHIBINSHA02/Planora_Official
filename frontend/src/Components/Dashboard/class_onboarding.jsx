// frontend/src/Components/Dashboard/class_onboarding.jsx
import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { useOrganisationContext } from "../../context/useOrganisationContext";

const API_BASE = "http://localhost:3000";
const TEACHERS_API = `${API_BASE}/api/teachers`;
const CLASSROOM_API = `${API_BASE}/api/classrooms`;

const generateEmptySchedule = () => {
  return Array(5)
    .fill(0)
    .map(() => Array(6).fill(0).map(() => []));
};

const ClassOnboarding = () => {
  const { activeOrganisation, loading } = useOrganisationContext();

  const [className, setClassName] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [subject, setSubject] = useState("");
  const [count, setCount] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [assignedTeachers, setAssignedTeachers] = useState([]);

  const [teachers, setTeachers] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState(null);

  // ---------------- FETCH TEACHERS ----------------
  useEffect(() => {
    if (!activeOrganisation?.organisationId) return;

    const fetchTeachers = async () => {
      try {
        const res = await fetch(
          `${TEACHERS_API}?organisationId=${activeOrganisation.organisationId}`
        );

        if (!res.ok) {
          console.error("Failed to load teachers");
          return;
        }

        const data = await res.json();
        setTeachers(data);

        const allSubjects = Array.from(
          new Set(data.flatMap(t => t.subjects || []))
        );

        setAvailableSubjects(allSubjects);
      } catch (err) {
        console.error("Error fetching teachers:", err);
      }
    };

    fetchTeachers();

    const socket = io(API_BASE, {
      transports: ["websocket"],
    });

    socket.on("teacher_added", newTeacher => {
      setTeachers(prev => {
        const exists = prev.some(t => t._id === newTeacher._id);
        return exists ? prev : [...prev, newTeacher];
      });
    });

    return () => socket.disconnect();
  }, [activeOrganisation?.organisationId]);

  // ---------------- Derived Teacher Data ----------------
  const teacherNames = useMemo(
    () => teachers.map(t => t.teacherName || t.teachername),
    [teachers]
  );

  const selectedTeacher = useMemo(
    () => teachers.find(t => t.teacherName === teacherName || t.teachername === teacherName),
    [teacherName, teachers]
  );

  // ---------------- Subject Selection Logic ----------------
  useEffect(() => {
    if (!teacherName) {
      const allSubjects = Array.from(
        new Set(teachers.flatMap(t => t.subjects || []))
      );
      setAvailableSubjects(allSubjects);
      return;
    }

    if (selectedTeacher?.subjects) {
      setAvailableSubjects(selectedTeacher.subjects);
      if (!selectedTeacher.subjects.includes(subject)) setSubject("");
    }
  }, [teacherName, teachers, subject, selectedTeacher?.subjects]);

  // ---------------- Add Teacher ----------------
  const handleAddTeacher = () => {
    if (!teacherName || !subject || !count) {
      setSubmissionMessage({
        type: "error",
        text: "Select teacher, subject & hours"
      });
      return;
    }

    setAssignedTeachers(prev => [
      ...prev,
      {
        teacherName,
        teacherId: selectedTeacher?.teacherId,
        subject,
        count: Number(count),
      },
    ]);

    setTeacherName("");
    setSubject("");
    setCount("");
  };

  const handleRemoveTeacher = index =>
    setAssignedTeachers(prev => prev.filter((_, i) => i !== index));

  // ---------------- Submit ----------------
  const handleSubmit = async e => {
    e.preventDefault();

    if (!className || !adminEmail || assignedTeachers.length === 0) {
      setSubmissionMessage({
        type: "error",
        text: "Fill classroom, email & add teachers",
      });
      return;
    }

    const classroomId =
      className.toUpperCase().replace(/[^A-Z0-9]/g, "-") + "-" + Date.now();

    const payload = {
      organisationId: activeOrganisation.organisationId,
      classroomId,
      className,
      admin: adminEmail,
      subjects: assignedTeachers.map(t => ({
        subject: t.subject,
        teachername: t.teacherName,
        time: t.count,
      })),
      schedule: generateEmptySchedule(),
    };

    try {
      setIsSubmitting(true);

      const res = await fetch(CLASSROOM_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmissionMessage({
          type: "error",
          text: data.message || "Server Error",
        });
        return;
      }

      setSubmissionMessage({
        type: "success",
        text: "Classroom created successfully!",
      });

      setClassName("");
      setAssignedTeachers([]);
      setAdminEmail("");
    } catch {
      setSubmissionMessage({
        type: "error",
        text: "Network error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------- Render ----------------
  if (loading) return <p>Loading organisation…</p>;

  if (!activeOrganisation)
    return <p className="font-semibold text-red-600">
      No organisation selected
    </p>;

  return (
    <div>
   

      {submissionMessage && (
        <p
          className={`p-2 mb-3 rounded space-y-8 divide-y divide-gray-200 ${
            submissionMessage.type === "error"
              ? "bg-red-200 text-red-800"
              : "bg-green-200 text-green-800"
          }`}
        >
          {submissionMessage.text}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-gray-700">
        <div>
        <label className="block text-sm font-medium">Classroom Name</label>
        <input
          value={className}
          onChange={e => setClassName(e.target.value)}
          placeholder="Class Name"
          className="w-full px-3 py-2 mb-3 border rounded-md "
        />
        </div>
        <div>
          <label className="block text-sm font-medium">Admin Mail id</label>
        <input
          type="email"
          value={adminEmail}
          onChange={e => setAdminEmail(e.target.value)}
          placeholder="Admin Email"
          className="w-full p-2 mb-3 border"
        />
        </div>

        
        <div >
          <label className="block text-sm font-medium">Add teacher</label>
        <div className="p-3 mb-3 border rounded">
          <select
            value={teacherName}
            onChange={e => setTeacherName(e.target.value)}
            className="p-2 mr-2 border"
          >
            <option value="">Select Teacher</option>
            {teacherNames.map(n => (
              <option key={n}>{n}</option>
            ))}
          </select>

          <select
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className="p-2 mr-2 border"
            disabled={!teacherName}
          >
            <option value="">Select Subject</option>
            {availableSubjects.map(s => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <input
            type="number"
            value={count}
            onChange={e => setCount(e.target.value)}
            placeholder="Hours"
            className="w-24 p-2 mr-2 border"
          />

          <button type="button" onClick={handleAddTeacher} className="px-4 py-2 text-white bg-indigo-600 rounded">
            Add
          </button>
        </div>
        </div>

        {assignedTeachers.map((t, i) => (
          <div key={i} className="flex justify-between p-2 mb-1 border">
            <span>{t.teacherName} — {t.subject} ({t.count} hrs)</span>
            <button  className ="text-2xl text-gray-800" onClick={() => handleRemoveTeacher(i)} type="button">×</button>
          </div>
        ))}

        <button
          disabled={isSubmitting}
          className="w-full p-3 text-white bg-indigo-600 rounded"
        >
          {isSubmitting ? "Submitting..." : "Create Classroom"}
        </button>
      </form>
    </div>
  );
};

export default ClassOnboarding;
