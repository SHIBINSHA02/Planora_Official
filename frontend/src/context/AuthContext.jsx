// frontend/src/context/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useSyncUser } from "../hooks/useSyncUser";

/**
 * Global Auth Context
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user: clerkUser } = useUser();

  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Sync Clerk user → backend DB user
  useSyncUser((userFromDb) => {
    setDbUser(userFromDb);
    setLoading(false);
  });

  // Handle logged-out users safely
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      setDbUser(null);
      setLoading(false);
    }
  }, [isLoaded, isSignedIn]);

  // Display name fallback (never undefined)
  const displayName = useMemo(() => {
    return (
      dbUser?.name ||
      dbUser?.email ||
      clerkUser?.fullName ||
      clerkUser?.primaryEmailAddress?.emailAddress ||
      ""
    );
  }, [dbUser, clerkUser]);

  const value = {
    isSignedIn: Boolean(isSignedIn),
    loading,
    user: dbUser,
    displayName,
    role: dbUser?.role || null,
    organisationId: dbUser?.organisationId || null,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * ✅ THIS EXPORT WAS MISSING
 */
export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }
  return ctx;
};
