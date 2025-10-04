// frontend/src/Components/Dashboard/class_onboarding.jsx
import React, { useEffect, useMemo, useState } from 'react';

// --- Mock Data and Utilities (Replacing API) ---
const MOCK_TEACHERS = [
  { teachername: "Alice Smith", subjects: ["Mathematics", "Physics"] },
  { teachername: "Bob Johnson", subjects: ["History", "English", "Literature"] },
  { teachername: "Charlie Brown", subjects: ["Science", "Chemistry"] },
];

const ALL_SUBJECTS = Array.from(new Set(MOCK_TEACHERS.flatMap(t => t.subjects)));

/**
 * Utility to simulate API submission delay and success/failure.
 * @param {object} payload - The data to "submit"
 */
const mockSubmitClassroom = (payload) => {
  console.log("Mock API Payload Submitted:", payload);
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate successful submission
      resolve({ success: true });
    }, 1500);
  });
};
// ------------------------------------------------

const ClassOnboarding = () => {
  // Form state
  const [className, setClassName] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [subject, setSubject] = useState('');
  const [count, setCount] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [assignedTeachers, setAssignedTeachers] = useState([]);

  // UI/Status state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState(null);

  // Data state (now using mock data instead of useEffect API fetch)
  const [teachers] = useState(MOCK_TEACHERS);
  const [availableSubjects, setAvailableSubjects] = useState(ALL_SUBJECTS);

  const teacherNames = useMemo(() => teachers.map(t => t.teachername), [teachers]);

  // Logic to update subjects list based on selected teacher (Kept for UI functionality)
  useEffect(() => {
    setSubmissionMessage(null); // Clear message on form change

    if (!teacherName) {
      setAvailableSubjects(ALL_SUBJECTS);
      return;
    }

    const t = teachers.find(x => x.teachername === teacherName);
    if (t && Array.isArray(t.subjects) && t.subjects.length > 0) {
      setAvailableSubjects(t.subjects);
      // If current subject not in teacher's list, reset it
      if (!t.subjects.includes(subject)) {
        setSubject('');
      }
    } else {
      setAvailableSubjects(ALL_SUBJECTS);
    }
  }, [teacherName, teachers, subject]);

  const handleAddTeacher = () => {
    const trimmedTeacher = String(teacherName || '').trim();
    const trimmedSubject = String(subject || '').trim();
    const numericCount = count ? Number(count) : 0;

    // Validation checks
    if (!trimmedTeacher || !trimmedSubject || numericCount <= 0) {
      setSubmissionMessage({ type: 'error', text: 'Please select a teacher, subject, and time count greater than 0.' });
      return;
    }

    const selectedTeacher = teachers.find(x => x.teachername === trimmedTeacher);
    const allowedSubjects = Array.isArray(selectedTeacher?.subjects) ? selectedTeacher.subjects : [];

    if (allowedSubjects.length > 0 && !allowedSubjects.includes(trimmedSubject)) {
      setSubmissionMessage({ type: 'error', text: `Error: ${trimmedSubject} is not taught by ${trimmedTeacher}.` });
      return;
    }

    // Check for duplicate assignments (same teacher and subject)
    const isDuplicate = assignedTeachers.some(
      (t) => t.teacherName === trimmedTeacher && t.subject === trimmedSubject
    );

    if (isDuplicate) {
      setSubmissionMessage({ type: 'error', text: 'This teacher/subject combination has already been added.' });
      return;
    }

    setAssignedTeachers(prev => [
      ...prev,
      { teacherName: trimmedTeacher, subject: trimmedSubject, count: numericCount },
    ]);

    // Clear fields after adding
    setTeacherName('');
    setSubject('');
    setCount('');
    setSubmissionMessage({ type: 'success', text: `Added ${trimmedTeacher} teaching ${trimmedSubject} for ${numericCount} hours.` });
  };

  const handleRemoveTeacher = (index) => {
    setAssignedTeachers(prev => prev.filter((_, i) => i !== index));
    setSubmissionMessage(null);
  };

  // Mock submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedClass = className.trim();
    const trimmedAdmin = adminEmail.trim();

    if (!trimmedClass || !trimmedAdmin || assignedTeachers.length === 0) {
      setSubmissionMessage({ type: 'error', text: 'Please fill class name, admin email, and add at least one teacher entry.' });
      return;
    }

    const subjectsPayload = assignedTeachers.map((t) => ({
      subject: t.subject,
      teachername: t.teacherName,
      time: Number(t.count) || 0,
    }));

    try {
      setIsSubmitting(true);
      setSubmissionMessage(null);

      // --- MOCK API CALL ---
      await mockSubmitClassroom({ classname: trimmedClass, admin: trimmedAdmin, subjects: subjectsPayload });
      // ---------------------

      // Reset form on success
      setClassName('');
      setTeacherName('');
      setSubject('');
      setCount('');
      setAdminEmail('');
      setAssignedTeachers([]);
      setSubmissionMessage({ type: 'success', text: 'Class schedule submitted successfully! (Mocked)' });

    } catch (err) {
      console.error('Mock Add schedule failed:', err);
      setSubmissionMessage({ type: 'error', text: 'Failed to submit schedule. (Mocked Error)' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper for status message styling
  const getMessageClasses = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-700 border-green-400';
      case 'error':
        return 'bg-red-100 text-red-700 border-red-400';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-400';
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-gray-50 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6 border-b pb-2">Class Schedule Onboarding</h2>

      {/* Status Message Box */}
      {submissionMessage && (
        <div className={`p-3 mb-4 rounded-lg border text-sm transition-opacity duration-300 ${getMessageClasses(submissionMessage.type)}`}>
          {submissionMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-gray-700">
        <div className="space-y-2">
          <label htmlFor="className" className="block text-sm font-medium text-gray-700">Class Name</label>
          <input
            id="className"
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="e.g., 9th Grade - Section A"
            className="w-full rounded-md bg-white border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 shadow-sm"
          />
        </div>

        {/* Teacher/Subject/Count Selection Block */}
        <div className="border border-gray-200 p-4 rounded-lg bg-white shadow-inner">
          <h3 className="text-md font-semibold text-indigo-600 mb-4">Assign Teacher & Time Slots</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="teacherName" className="block text-sm font-medium text-gray-700">Teacher</label>
              <select
                id="teacherName"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                className={`w-full rounded-md bg-white border border-gray-300 px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 shadow-sm appearance-none cursor-pointer ${
                  teacherName ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                <option value="" disabled>Select a teacher</option>
                {teacherNames.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
              <select
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={!teacherName}
                className={`w-full rounded-md bg-white border border-gray-300 px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 shadow-sm appearance-none cursor-pointer ${
                  subject ? 'text-gray-900' : 'text-gray-400'
                } ${!teacherName ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              >
                <option value="" disabled>Select subject</option>
                {availableSubjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="count" className="block text-sm font-medium text-gray-700">Time (Hours/Week)</label>
              <input
                id="count"
                type="number"
                min="1"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                placeholder="4"
                className="w-full rounded-md bg-white border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 shadow-sm"
              />
            </div>
          </div>
          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={handleAddTeacher}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
            >
              Add Assignment
            </button>
          </div>
        </div>
        {/* End Teacher/Subject/Count Selection Block */}


        {assignedTeachers.length > 0 && (
          <div className="pt-2">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Current Assignments ({assignedTeachers.length})</h3>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-inner">
              <ul className="divide-y divide-gray-100">
                {assignedTeachers.map((t, idx) => (
                  <li key={`${t.teacherName}-${t.subject}-${idx}`} className="flex justify-between items-center p-3 text-sm transition-colors duration-150 hover:bg-gray-50">
                    <span className="text-gray-800 font-medium">
                      {t.teacherName}
                    </span>
                    <span className="text-gray-600 mx-4">
                      teaches <strong className="text-indigo-600">{t.subject}</strong>
                    </span>
                    <span className="text-gray-600">
                      for <strong className="font-semibold">{t.count} hours/week</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTeacher(idx)}
                      className="text-red-500 hover:text-red-700 text-lg ml-4 transition-colors"
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

        <div className="space-y-2">
          <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700">Admin Email</label>
          <input
            id="adminEmail"
            type="email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            placeholder="administrator@school.edu"
            className="w-full rounded-md bg-white border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 shadow-sm"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full font-semibold py-3 rounded-lg transition-colors duration-200 shadow-lg ${
              isSubmitting
                ? 'bg-indigo-400 text-white cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-xl'
            }`}
          >
            {isSubmitting ? 'Submitting Mock Data…' : 'Submit Class Schedule'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClassOnboarding;