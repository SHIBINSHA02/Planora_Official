// frontend/src/hooks/useSyncUser.js
import { useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";

/**
 * Sync Clerk user → backend DB user
 * Returns the DB user via callback
 */
export function useSyncUser(onUserSynced) {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user: clerkUser } = useUser();

  const hasSyncedRef = useRef(false);

  useEffect(() => {
    // Wait for Clerk
    if (!isLoaded) return;

    // Not signed in → do nothing
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

        onUserSynced(dbUser);
        hasSyncedRef.current = true;
      } catch (err) {
        console.error("User sync failed:", err);
      }
    };

    syncUser();
  }, [isLoaded, isSignedIn, clerkUser, getToken, onUserSynced]);
}
