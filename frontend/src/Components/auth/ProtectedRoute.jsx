// frontend/src/Components/auth/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

export default function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null; // or loader

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
