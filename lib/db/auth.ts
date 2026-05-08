import "server-only";
import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  isAdmin: boolean;
  email?: string;
}

// Defer the SESSION_PASSWORD check to first use (runtime) instead of module
// load (build time) — Next.js 16 evaluates server modules during `next build`
// to collect page data, when env vars aren't set yet.
function sessionOptions(): SessionOptions {
  const password = process.env.SESSION_PASSWORD ?? "";
  if (process.env.NODE_ENV === "production" && password.length < 32) {
    throw new Error(
      "SESSION_PASSWORD environment variable must be at least 32 characters in production.",
    );
  }
  return {
    password:
      password ||
      "dev-only-session-password-do-not-use-in-production-please",
    cookieName: "portfolio_session",
    cookieOptions: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    },
  };
}

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions());
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session.isAdmin === true;
}

export async function login(password: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || expected.length === 0) return false;
  if (password !== expected) return false;

  const session = await getSession();
  session.isAdmin = true;
  session.email = process.env.ADMIN_EMAIL ?? "admin";
  await session.save();
  return true;
}

export async function logout() {
  const session = await getSession();
  session.destroy();
}
