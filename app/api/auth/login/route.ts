import { NextResponse } from "next/server";
import { login } from "@/lib/db/auth";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    if (typeof password !== "string" || password.length === 0) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 },
      );
    }

    const ok = await login(password);
    if (!ok) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
