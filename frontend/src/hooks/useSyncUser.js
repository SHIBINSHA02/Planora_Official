// frontend/src/hooks/useSyncUser.js
import { useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";

/**
 * Sync Clerk user → backend DB user
 * Calls onUserSynced(dbUser) if provided
 */
export function useSyncUser(onUserSynced) {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user: clerkUser } = useUser();

  const hasSyncedRef = useRef(false);

  useEffect(() => {
    // Wait for Clerk to load
    if (!isLoaded) return;

    // Not signed in → reset sync flag
    if (!isSignedIn || !clerkUser) {
      hasSyncedRef.current = false;
      return;
    }

    // Prevent duplicate sync
    if (hasSyncedRef.current) return;

    const syncUser = async () => {
      try {
        const token = await getToken();

        const res = await fetch("/api/auth/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: clerkUser.fullName,
            email: clerkUser.primaryEmailAddress?.emailAddress,
          }),
        });

        if (!res.ok) {
          throw new Error("User sync failed");
        }

        const dbUser = await res.json();

        // ✅ SAFETY CHECK (THIS FIXES YOUR ERROR)
        if (typeof onUserSynced === "function") {
          onUserSynced(dbUser);
        }

        hasSyncedRef.current = true;
      } catch (err) {
        console.error("User sync failed:", err);
      }
    };

    syncUser();
  }, [isLoaded, isSignedIn, clerkUser, getToken, onUserSynced]);
}
