import { NextResponse } from "next/server";
import { logout } from "@/lib/db/auth";

export async function POST() {
  await logout();
  return NextResponse.json({ ok: true });
}
