import "server-only";
import { Pool } from "pg";
import { runMigrations } from "./migrate";

let pool: Pool | null = null;
let migrated = false;

/**
 * Returns a singleton pg Pool. node-postgres natively reads PGHOST/PGUSER/etc.
 * env vars; we prefer POSTGRES_URL when set.
 *
 * Migrations run on first access. They're idempotent (tracked in _migrations
 * table) so repeated container starts are cheap.
 */
export async function getPool(): Promise<Pool> {
  if (pool && migrated) return pool;

  if (!pool) {
    pool = new Pool(
      process.env.POSTGRES_URL
        ? { connectionString: process.env.POSTGRES_URL }
        : {},
    );
    pool.on("error", (err) => {
      console.error("Unexpected pg pool error:", err);
    });
  }

  if (!migrated) {
    await runMigrations(pool);
    migrated = true;
  }

  return pool;
}
