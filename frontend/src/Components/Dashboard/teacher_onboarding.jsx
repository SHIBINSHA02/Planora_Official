// frontend/src/Components/Dashboard/teacher_onboarding.jsx
import React, { useState } from 'react';
import Papa from 'papaparse';

const TeacherOnboarding = () => {
  const [teacherName, setTeacherName] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [subjectInput, setSubjectInput] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleAddSubject = () => {
    const trimmed = subjectInput.trim();
    if (!trimmed) return;
    // prevent duplicates (case-insensitive)
    const exists = subjects.some(s => s.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      setSubjectInput('');
      return;
    }
    setSubjects(prev => [...prev, trimmed]);
    setSubjectInput('');
  };

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
      teachername: trimmedName,
      mailid: trimmedEmail,
      subjects: subjects,
    };

    try {
      const res = await fetch(`${API_BASE}/api/teachers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to add teacher');
      }

      // reset form on success
      setTeacherName('');
      setTeacherEmail('');
      setSubjects([]);
      alert('Teacher added successfully');
    } catch (err) {
      console.error('Add teacher failed:', err);
      alert('Failed to add teacher');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length) {
      setCsvFile(e.target.files[0]);
    }
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
          teachername: row.teachername,
          mailid: row.mailid,
          // Assuming subjects are in a comma-separated string in the CSV
          subjects: row.subjects ? row.subjects.split(',').map(s => s.trim()) : []
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
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(teacher),
            });

            if (res.ok) {
              successCount++;
            } else {
              errorCount++;
            }
          } catch (err) {
            console.error('Failed to add teacher from CSV:', err);
            errorCount++;
          }
        }

        setIsUploading(false);
        setCsvFile(null);
        // Clear the file input
        document.getElementById('csv-input').value = '';

        alert(`CSV processing complete.\nSuccessfully added: ${successCount}\nFailed: ${errorCount}`);
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
      {/* Manual Onboarding Form */}
      <form onSubmit={handleManualSubmit} className="space-y-6 text-gray-700">
        <h2 className="text-xl font-semibold text-gray-900">Add a Single Teacher</h2>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Teacher Name</label>
          <input
            type="text"
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
            placeholder="Enter teacher name"
            className="w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Teacher Email</label>
          <input
            type="email"
            value={teacherEmail}
            onChange={(e) => setTeacherEmail(e.target.value)}
            placeholder="Enter teacher email"
            className="w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Subjects</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
              placeholder="Add a subject"
              className="flex-1 rounded-md bg-white border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
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
              className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 rounded-md transition-colors duration-200 shadow"
            >
              Add
            </button>
          </div>

          {subjects.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {subjects.map((s, idx) => (
                <span
                  key={`${s}-${idx}`}
                  className="inline-flex items-center gap-2 rounded-md bg-gray-100 text-gray-800 text-sm px-3 py-1"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 shadow"
          >
            Submit
          </button>
        </div>
      </form>

      {/* CSV Upload Onboarding */}
      <div className="space-y-6 pt-8">
         <h2 className="text-xl font-semibold text-gray-900">Bulk Onboard with CSV</h2>
         <p className="text-sm text-gray-500">
           Upload a CSV file with the columns: <code>teachername</code>, <code>mailid</code>, and <code>subjects</code> (comma-separated).
         </p>
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Upload CSV File</label>
            <input
                id="csv-input"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />
        </div>

        <div className="pt-2">
            <button
                type="button"
                onClick={handleCsvSubmit}
                disabled={isUploading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 shadow disabled:bg-gray-400"
            >
                {isUploading ? 'Uploading...' : 'Upload and Onboard Teachers'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherOnboarding;