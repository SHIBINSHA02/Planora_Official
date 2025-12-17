import React, { useEffect, useState } from "react";
import TeacherScheduleTable from "../tables/TeacherScheduleTable";
import { useTeachers } from "../../context/TeacherContext";
import { useSchedule } from "../../context/ScheduleContext";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const periods = ["Period 1", "Period 2", "Period 3", "Period 4", "Period 5", "Period 6"];

const Teacher = () => {
  const { teachers } = useTeachers();
  const { fetchTeacherSchedule } = useSchedule();

  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [scheduleGrid, setScheduleGrid] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedTeacherId) {
      setScheduleGrid([]);
      return;
    }

    const loadSchedule = async () => {
      try {
        setLoading(true);
        setError("");

        const slots = await fetchTeacherSchedule(selectedTeacherId);

        // Convert ScheduleSlot[] → 5x6 grid
        const grid = Array.from({ length: 5 }, () =>
          Array.from({ length: 6 }, () => [])
        );

        for (const slot of slots) {
          grid[slot.day][slot.period].push(slot);
        }

        setScheduleGrid(grid);

      } catch (err) {
        console.error(err);
        setError("Failed to load teacher schedule");
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
  }, [selectedTeacherId]);

  return (
    <div className="p-6 min-h-full">
      <h1 className="text-xl font-semibold mb-6">Teacher Schedule Viewer</h1>

      {/* Teacher Dropdown */}
      <select
        value={selectedTeacherId}
        onChange={(e) => setSelectedTeacherId(e.target.value)}
        className="border p-2 rounded mb-6"
      >
        <option value="" disabled>
          -- Select a teacher --
        </option>
        {teachers.map((t) => (
          <option key={t.teacherId} value={t.teacherId}>
            {t.teacherName}
          </option>
        ))}
      </select>

      {loading && <p>Loading schedule...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && selectedTeacherId && (
        <TeacherScheduleTable
          scheduleData={
            scheduleGrid.length
              ? scheduleGrid
              : Array(5).fill(Array(6).fill([]))
          }
          days={days}
          periods={periods}
        />
      )}
    </div>
  );
};

export default Teacher;
