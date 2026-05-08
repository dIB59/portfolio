/**
 * Compatibility shim — Supabase has been replaced with SQLite + iron-session.
 * No callers should import this in the SQLite version of the app; kept as a
 * no-op to avoid hard import failures if a stale call slips through.
 */

export async function createClient() {
  throw new Error(
    "lib/supabase/server.ts is no longer functional. Use lib/db/auth.ts (getSession) instead.",
  );
}
