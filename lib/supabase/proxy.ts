import { NextResponse, type NextRequest } from "next/server";
import { getIronSession, type SessionOptions } from "iron-session";

interface SessionData {
  isAdmin?: boolean;
}

// Defer reading env vars to runtime (next build evaluates this module).
function sessionOptions(): SessionOptions {
  return {
    password:
      process.env.SESSION_PASSWORD ||
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

/**
 * Edge-runtime middleware. Replaces the previous Supabase auth check.
 * Reads the iron-session cookie; redirects unauthenticated /admin requests
 * to /auth/login. The auth state itself lives in the cookie — no DB call.
 */
export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });

  if (request.nextUrl.pathname.startsWith("/admin")) {
    const session = await getIronSession<SessionData>(
      request,
      response,
      sessionOptions(),
    );

    if (!session.isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
  }

  return response;
}
