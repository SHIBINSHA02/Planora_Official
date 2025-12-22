import React from "react";
import { Calendar, Clock, BookOpen, Users } from "lucide-react";

const Profile = () => {
  // 🔹 Sample data (replace with API later)
  const teacher = {
    name: "Anjali Sharma",
    email: "anjali@planora.edu",
    subject: "Mathematics",
    department: "Science",
    workingDays: 5,
    periodsPerWeek: 18,
  };

  const schedule = [
    { day: "Monday", period: "9:00 – 9:45", class: "10-A", subject: "Math" },
    { day: "Monday", period: "11:00 – 11:45", class: "9-B", subject: "Math" },
    { day: "Wednesday", period: "10:00 – 10:45", class: "10-C", subject: "Math" },
    { day: "Friday", period: "12:00 – 12:45", class: "8-A", subject: "Math" },
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ================= PROFILE HEADER ================= */}
        <div className="p-6 bg-white shadow rounded-2xl">
          <h1 className="text-2xl font-bold text-gray-800">
            Teacher Profile
          </h1>

          <div className="grid gap-6 mt-6 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-lg font-semibold">{teacher.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg font-semibold">{teacher.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Subject</p>
              <p className="text-lg font-semibold">{teacher.subject}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Department</p>
              <p className="text-lg font-semibold">{teacher.department}</p>
            </div>
          </div>
        </div>

        {/* ================= WORKLOAD SUMMARY ================= */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="p-5 bg-white shadow rounded-xl">
            <div className="flex items-center gap-3">
              <Calendar className="text-indigo-600" />
              <h3 className="font-semibold">Working Days</h3>
            </div>
            <p className="mt-3 text-2xl font-bold">
              {teacher.workingDays} days/week
            </p>
          </div>

          <div className="p-5 bg-white shadow rounded-xl">
            <div className="flex items-center gap-3">
              <Clock className="text-indigo-600" />
              <h3 className="font-semibold">Periods</h3>
            </div>
            <p className="mt-3 text-2xl font-bold">
              {teacher.periodsPerWeek} / week
            </p>
          </div>

          <div className="p-5 bg-white shadow rounded-xl">
            <div className="flex items-center gap-3">
              <Users className="text-indigo-600" />
              <h3 className="font-semibold">Classes Handled</h3>
            </div>
            <p className="mt-3 text-2xl font-bold">
              4 classes
            </p>
          </div>
        </div>

        {/* ================= SCHEDULE TABLE ================= */}
        <div className="p-6 bg-white shadow rounded-2xl">
          <h2 className="mb-4 text-xl font-semibold">
            Weekly Schedule
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="text-gray-600 border-b">
                  <th className="py-2">Day</th>
                  <th className="py-2">Period</th>
                  <th className="py-2">Class</th>
                  <th className="py-2">Subject</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((item, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="py-2">{item.day}</td>
                    <td className="py-2">{item.period}</td>
                    <td className="py-2">{item.class}</td>
                    <td className="py-2">{item.subject}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= SIMPLE CHART (VISUAL SUMMARY) ================= */}
        <div className="p-6 bg-white shadow rounded-2xl">
          <h2 className="mb-4 text-xl font-semibold">
            Teaching Load (Visual)
          </h2>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Math</p>
              <div className="w-full h-3 bg-gray-200 rounded-full">
                <div className="h-3 bg-indigo-600 rounded-full w-[75%]" />
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600">Free Periods</p>
              <div className="w-full h-3 bg-gray-200 rounded-full">
                <div className="h-3 bg-green-500 rounded-full w-[25%]" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
