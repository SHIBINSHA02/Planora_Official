// frontend/src/Components/Dashboard/teacher_onboarding.jsx
import React, { useState } from 'react';
import Papa from 'papaparse';
import { useOrganisationContext } from "../../context/useOrganisationContext";

const TeacherOnboarding = () => {
  const { activeOrganisation, loading } = useOrganisationContext();

  const [teacherName, setTeacherName] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [subjectInput, setSubjectInput] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  if (loading) {
    return <p className="text-gray-700">Loading organisation...</p>;
  }

  if (!activeOrganisation) {
    return <p className="font-semibold text-red-600">
      No organisation selected. Please select an organisation.
    </p>;
  }

  /* ================= SUBJECT ADD ================= */
  const handleAddSubject = () => {
    const trimmed = subjectInput.trim();
    if (!trimmed) return;

    const exists = subjects.some(s => s.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      setSubjectInput('');
      return;
    }

    setSubjects(prev => [...prev, trimmed]);
    setSubjectInput('');
  };

  /* ================= MANUAL SUBMIT ================= */
  const handleManualSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = teacherName.trim();
    const trimmedEmail = teacherEmail.trim();

    if (!trimmedName || !trimmedEmail || subjects.length === 0) {
      alert('Please fill name, email, and at least one subject.');
      return;
    }

    const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

    const payload = {
      organisationId: activeOrganisation.organisationId,
      teachername: trimmedName,
      mailid: trimmedEmail,
      subjects
    };

    try {
      const res = await fetch(`${API_BASE}/api/teachers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      setTeacherName('');
      setTeacherEmail('');
      setSubjects([]);

      alert('Teacher added successfully');
    } catch (err) {
      console.error('Add teacher failed:', err);
      alert('Failed to add teacher');
    }
  };

  /* ================= CSV ================= */
  const handleFileChange = (e) => {
    if (e.target.files.length) setCsvFile(e.target.files[0]);
  };

  const handleCsvSubmit = () => {
    if (!csvFile) {
      alert('Please select a CSV file to upload.');
      return;
    }

    setIsUploading(true);

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const teachers = results.data.map(row => ({
          organisationId: activeOrganisation.organisationId,
          teachername: row.teachername,
          mailid: row.mailid,
          subjects: row.subjects
            ? row.subjects.split(',').map(s => s.trim())
            : []
        }));

        const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

        let successCount = 0;
        let errorCount = 0;

        for (const teacher of teachers) {
          if (!teacher.teachername || !teacher.mailid || !teacher.subjects.length) {
            console.warn('Skipping invalid row:', teacher);
            errorCount++;
            continue;
          }

          try {
            const res = await fetch(`${API_BASE}/api/teachers`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(teacher),
            });

            res.ok ? successCount++ : errorCount++;
          } catch (err) {
            console.error('Failed to add teacher from CSV:', err);
            errorCount++;
          }
        }

        setIsUploading(false);
        setCsvFile(null);
        document.getElementById('csv-input').value = '';

        alert(`CSV processing complete.
Successfully added: ${successCount}
Failed: ${errorCount}`);
      },

      error: (error) => {
        setIsUploading(false);
        console.error('Error parsing CSV:', error);
        alert('Failed to parse CSV file.');
      }
    });
  };

  return (
    <div className="space-y-8 divide-y divide-gray-200">
      <h1 className="text-2xl font-bold text-gray-900">
        Active Organisation: {activeOrganisation.organisationName}
      </h1>

      {/* ================= MANUAL FORM ================= */}
      <form onSubmit={handleManualSubmit} className="space-y-6 text-gray-700">
        <h2 className="text-xl font-semibold">Add a Single Teacher</h2>

        <div>
          <label className="block text-sm font-medium">Teacher Name</label>
          <input
            type="text"
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
            placeholder="Enter teacher name"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Teacher Email</label>
          <input
            type="email"
            value={teacherEmail}
            onChange={(e) => setTeacherEmail(e.target.value)}
            placeholder="Enter teacher email"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Subjects</label>

          <div className="flex gap-3">
            <input
              type="text"
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
              placeholder="Add a subject"
              className="flex-1 px-3 py-2 border rounded-md"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSubject();
                }
              }}
            />

            <button
              type="button"
              onClick={handleAddSubject}
              className="px-4 text-white bg-indigo-600 rounded-md"
            >
              Add
            </button>
          </div>

          {subjects.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {subjects.map((s, idx) => (
                <span key={idx} className="px-3 py-1 text-sm bg-gray-200 rounded-md">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 text-white bg-indigo-600 rounded-lg"
        >
          Submit
        </button>
      </form>

      {/* ================= CSV ================= */}
      <div className="pt-8 space-y-4">
        <h2 className="text-xl font-semibold">Bulk Onboard with CSV</h2>

        <input
          id="csv-input"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="block w-full"
        />

        <button
          type="button"
          onClick={handleCsvSubmit}
          disabled={isUploading}
          className="w-full py-3 text-white bg-indigo-600 rounded-lg disabled:bg-gray-400"
        >
          {isUploading ? 'Uploading...' : 'Upload and Onboard Teachers'}
        </button>
      </div>
    </div>
  );
};

export default TeacherOnboarding;
