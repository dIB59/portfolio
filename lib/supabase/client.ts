/**
 * Compatibility shim — Supabase has been replaced with Postgres + iron-session.
 * Kept because admin-dashboard.tsx still imports createClient() to call
 * supabase.auth.signOut(). We expose a minimal stub that posts to
 * /api/auth/logout instead.
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
          // best-effort
        }
        return { error: null };
      },
    },
  };
}
