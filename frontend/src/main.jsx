// frontend/src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";

import "./index.css";
import App from "./App";

/* ================= CONTEXT PROVIDERS ================= */
import { AuthProvider } from "./context/AuthContext";
import { OrganisationProvider } from "./context/OrganisationContext";
import { TeacherProvider } from "./context/TeacherContext";
import { ClassroomProvider } from "./context/ClassroomContext";
import { ScheduleProvider } from "./context/ScheduleContext";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <BrowserRouter>
        <AuthProvider>
          <OrganisationProvider>
            <ClassroomProvider>
              <TeacherProvider>
                <ScheduleProvider>
                  
                    <App />
               
                </ScheduleProvider>
              </TeacherProvider>
            </ClassroomProvider>
          </OrganisationProvider>
        </AuthProvider>
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);
