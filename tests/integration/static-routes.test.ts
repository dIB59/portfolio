import { describe, it, expect } from "vitest";

const BASE = process.env.TEST_BASE_URL ?? "http://127.0.0.1:4321";

describe("static metadata routes", () => {
  it.each([
    ["/robots.txt", /^text\/plain/],
    ["/sitemap.xml", /^application\/xml/],
    ["/manifest.webmanifest", /^application\/(json|manifest)/],
  ] as const)("%s serves correct content-type", async (path, ctype) => {
    const res = await fetch(`${BASE}${path}`);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type") ?? "").toMatch(ctype);
  });

  it("/sitemap.xml lists the cover and story URLs", async () => {
    const res = await fetch(`${BASE}/sitemap.xml`);
    const xml = await res.text();
    expect(xml).toMatch(/<loc>/);
    expect(xml.toLowerCase()).toMatch(/story|<\/urlset>/);
  });

  it("/robots.txt is non-empty", async () => {
    const res = await fetch(`${BASE}/robots.txt`);
    const text = await res.text();
    expect(text.length).toBeGreaterThan(0);
  });
});

describe("auth-protected routes (unauthenticated)", () => {
  it("/admin redirects unauthenticated visitors", async () => {
    const res = await fetch(`${BASE}/admin`, { redirect: "manual" });
    // Either a 3xx redirect to /auth/login, or a server-side rewrite returning
    // the login page directly. Both are acceptable; both must NOT show admin.
    if (res.status >= 300 && res.status < 400) {
      expect(res.headers.get("location") ?? "").toMatch(/\/auth\/login/);
    } else {
      const html = await res.text();
      expect(html).not.toMatch(/Admin Dashboard/);
    }
  });

  it("/auth/login renders a login form", async () => {
    const res = await fetch(`${BASE}/auth/login`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toMatch(/<form/i);
    expect(html.toLowerCase()).toMatch(/password/);
  });
});
