/**
 * Compatibility shim — Supabase has been replaced with SQLite + iron-session.
 * Retained because admin-dashboard.tsx still imports createClient() to call
 * supabase.auth.signOut(). We expose a minimal stub that issues a logout
 * request to /api/auth/logout instead.
 */

interface AuthShim {
  signOut: () => Promise<{ error: null }>;
}

interface ClientShim {
  auth: AuthShim;
}

export function createClient(): ClientShim {
  return {
    auth: {
      signOut: async () => {
        try {
          await fetch("/api/auth/logout", { method: "POST" });
        } catch {
          // Best-effort; redirect happens on the caller side.
        }
        return { error: null };
      },
    },
  };
}
