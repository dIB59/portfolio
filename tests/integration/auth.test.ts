import { describe, it, expect } from "vitest";

const BASE = process.env.TEST_BASE_URL ?? "http://127.0.0.1:4321";

// global-setup.ts forces these into the server's env before spawning.
const TEST_PASSWORD = "test-admin-password";

async function postJson(path: string, body: unknown, cookie?: string) {
  return fetch(`${BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: JSON.stringify(body),
    redirect: "manual",
  });
}

function sessionCookie(setCookie: string | null): string | null {
  if (!setCookie) return null;
  // Some Node fetch impls fold multiple Set-Cookie into a comma-joined string;
  // grab just the portfolio_session pair, name=value, before any attribute.
  const match = setCookie.match(/portfolio_session=[^;,\s]+/);
  return match ? match[0] : null;
}

describe("POST /api/auth/login", () => {
  it("rejects requests with no password (400)", async () => {
    const res = await postJson("/api/auth/login", {});
    expect(res.status).toBe(400);
  });

  it("rejects requests with empty password (400)", async () => {
    const res = await postJson("/api/auth/login", { password: "" });
    expect(res.status).toBe(400);
  });

  it("rejects wrong password (401)", async () => {
    const res = await postJson("/api/auth/login", { password: "wrong" });
    expect(res.status).toBe(401);
    expect(res.headers.get("set-cookie") ?? "").not.toMatch(
      /portfolio_session=[^;]+/,
    );
  });

  it("accepts the right password and sets a session cookie", async () => {
    const res = await postJson("/api/auth/login", {
      password: TEST_PASSWORD,
    });
    expect(res.status).toBe(200);
    const cookie = sessionCookie(res.headers.get("set-cookie"));
    expect(cookie).not.toBeNull();
    // Smoke: the value past `=` is non-trivial (iron-session produces a long
    // signed payload, not a 1-char placeholder).
    const value = cookie!.split("=")[1];
    expect(value.length).toBeGreaterThan(20);
  });
});

describe("admin access after login", () => {
  it("the session cookie unlocks /admin", async () => {
    const loginRes = await postJson("/api/auth/login", {
      password: TEST_PASSWORD,
    });
    const cookie = sessionCookie(loginRes.headers.get("set-cookie"));
    expect(cookie).not.toBeNull();

    const res = await fetch(`${BASE}/admin`, {
      headers: { Cookie: cookie! },
      redirect: "manual",
    });
    // With a valid session we expect a successful render (200), not a redirect
    // back to the login page.
    expect(res.status).toBe(200);
    const location = res.headers.get("location") ?? "";
    expect(location).not.toMatch(/\/auth\/login/);
  });
});

describe("POST /api/auth/logout", () => {
  it("clears the session cookie", async () => {
    const login = await postJson("/api/auth/login", {
      password: TEST_PASSWORD,
    });
    const cookie = sessionCookie(login.headers.get("set-cookie"));
    expect(cookie).not.toBeNull();

    const res = await postJson("/api/auth/logout", {}, cookie!);
    expect(res.status).toBeLessThan(400);
    // The Set-Cookie response should either clear portfolio_session or omit
    // it entirely (iron-session destroy sets an empty/expired cookie).
    const after = res.headers.get("set-cookie") ?? "";
    if (after.includes("portfolio_session")) {
      // Cleared cookie: empty value OR an expiry in the past.
      const cleared =
        /portfolio_session=;/.test(after) ||
        /portfolio_session=[^;]*;[^,]*expires=/i.test(after);
      expect(cleared).toBe(true);
    }
  });
});
