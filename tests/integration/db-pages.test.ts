import { describe, it, expect } from "vitest";

const BASE = process.env.TEST_BASE_URL ?? "http://127.0.0.1:4321";
const DB_READY = process.env.TEST_DB_AVAILABLE === "1";

// These pages query Postgres. The DB probe lives in tests/global-setup.ts —
// when it can't reach Postgres (CI without DB, contributor without
// `kubectl port-forward`, etc.) the suite is marked **skipped** rather than
// silently passing, so a green run actually means these routes were hit.
describe.runIf(DB_READY)("DB-backed pages", () => {
  it("/story renders without crashing", async () => {
    const res = await fetch(`${BASE}/story`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toMatch(/<html/i);
    expect(html.toLowerCase()).not.toMatch(/internal server error/);
  });

  it("/leetcode renders without crashing", async () => {
    const res = await fetch(`${BASE}/leetcode`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toMatch(/<html/i);
    expect(html.toLowerCase()).not.toMatch(/internal server error/);
  });
});
