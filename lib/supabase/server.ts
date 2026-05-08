/**
 * Compatibility shim — Supabase has been replaced with Postgres + iron-session.
 * Throws if anything tries to use it; nothing should.
 */

export async function createClient() {
  throw new Error(
    "lib/supabase/server.ts is no longer functional. Use lib/db/auth.ts (getSession) instead.",
  );
}
