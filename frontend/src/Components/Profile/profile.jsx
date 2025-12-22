// frontend/src/Components/Profile/profile.jsx
import React from "react";
import { Calendar, Clock, BookOpen, Users } from "lucide-react";
import Footer from "../Footer/Footer";
import { SideNavbar } from "./SideNavbar";
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
  <div className="flex flex-col min-h-screen bg-gray-50">
    <div className="flex flex-col lg:flex-row">
    {/* ================= SIDEBAR ================= */}
    <SideNavbar />

    {/* ================= MAIN CONTENT ================= */}
    <div className="flex flex-col flex-1">
      
      {/* Page Content */}
      <div className="flex-1 p-6 font-sans">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* ================= PROFILE HEADER ================= */}
          <div className="p-6 bg-white border border-blue-600 shadow rounded-3xl">
            <h1 className="text-2xl font-semibold text-blue-600">
              Teacher Profile
            </h1>

            <div className="grid gap-6 mt-6 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-lg font-medium">{teacher.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-lg font-medium">{teacher.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Subject</p>
                <p className="text-lg font-medium">{teacher.subject}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="text-lg font-medium">{teacher.department}</p>
              </div>
            </div>
          </div>

          {/* ================= WORKLOAD SUMMARY ================= */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-5 bg-white border border-blue-600 shadow rounded-3xl">
              <div className="flex items-center gap-3">
                <Calendar className="text-indigo-600" />
                <h3 className="font-semibold">Working Days</h3>
              </div>
              <p className="mt-3 text-2xl font-semibold">
                {teacher.workingDays} days/week
              </p>
            </div>

            <div className="p-5 bg-white border border-blue-600 shadow rounded-3xl">
              <div className="flex items-center gap-3">
                <Clock className="text-indigo-600" />
                <h3 className="font-semibold">Periods</h3>
              </div>
              <p className="mt-3 text-2xl font-semibold">
                {teacher.periodsPerWeek} / week
              </p>
            </div>

            <div className="p-5 bg-white border border-blue-600 shadow rounded-3xl">
              <div className="flex items-center gap-3">
                <Users className="text-indigo-600" />
                <h3 className="font-semibold">Classes Handled</h3>
              </div>
              <p className="mt-3 text-2xl font-semibold">
                4 classes
              </p>
            </div>
          </div>

          {/* ================= SCHEDULE TABLE ================= */}
          <div className="p-6 bg-white border border-blue-600 shadow rounded-3xl">
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

          {/* ================= VISUAL LOAD ================= */}
          <div className="p-6 bg-white border border-blue-600 shadow rounded-3xl">
            <h2 className="mb-4 text-xl font-medium">
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
                  <div className="h-3 bg-indigo-800 rounded-full w-[25%]" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer stays outside scroll area */}
      
    </div>
    </div>
    <Footer />
  </div>
);

};

export default Profile;
