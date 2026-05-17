"use server";

import fs from "node:fs/promises";
import path from "node:path";

const UPLOADS_DIR =
  process.env.UPLOADS_DIR ?? path.join(process.cwd(), "data", "uploads");

/**
 * Receives a File from a client component (via Server Action FormData) and
 * writes it into the local uploads directory on the persistent volume.
 * Returns a public URL like /uploads/<filename>, served by
 * app/uploads/[filename]/route.ts.
 */
export async function uploadImage(file: File): Promise<string | null> {
  try {
    if (!file || file.size === 0) return null;

    await fs.mkdir(UPLOADS_DIR, { recursive: true });

    const ext = (file.name.split(".").pop() || "bin").toLowerCase();
    const random = Math.random().toString(36).slice(2);
    const filename = `${random}-${Date.now()}.${ext}`;
    const dest = path.join(UPLOADS_DIR, filename);

    const arrayBuffer = await file.arrayBuffer();
    await fs.writeFile(dest, Buffer.from(arrayBuffer));

    return `/uploads/${filename}`;
  } catch (err) {
    console.error("Upload error:", err);
    return null;
  }
}
