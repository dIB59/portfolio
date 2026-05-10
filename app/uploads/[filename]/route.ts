import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const UPLOADS_DIR =
  process.env.UPLOADS_DIR ?? path.join(process.cwd(), "data", "uploads");

// In local dev, when an uploaded file isn't present on disk, proxy from the
// deployed instance so cards have real images without needing to `kubectl cp`
// the PVC every time. Prod always reads from disk.
const UPLOADS_FALLBACK_BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.UPLOADS_FALLBACK_BASE_URL ??
      "https://portfolio.luminosity.work/uploads"
    : null;

const CONTENT_TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  avif: "image/avif",
};

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ filename: string }> },
) {
  const { filename } = await ctx.params;

  if (filename.includes("/") || filename.includes("..") || filename.startsWith(".")) {
    return new NextResponse("Bad request", {
      status: 400,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const filePath = path.join(UPLOADS_DIR, filename);

  try {
    const data = await fs.readFile(filePath);
    const ext = filename.split(".").pop()?.toLowerCase() ?? "";
    const contentType = CONTENT_TYPES[ext] ?? "application/octet-stream";

    return new NextResponse(new Uint8Array(data), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    if (UPLOADS_FALLBACK_BASE_URL) {
      try {
        const upstream = await fetch(`${UPLOADS_FALLBACK_BASE_URL}/${filename}`);
        if (upstream.ok) {
          const buf = await upstream.arrayBuffer();
          const ext = filename.split(".").pop()?.toLowerCase() ?? "";
          const contentType =
            CONTENT_TYPES[ext] ??
            upstream.headers.get("Content-Type") ??
            "application/octet-stream";
          return new NextResponse(new Uint8Array(buf), {
            status: 200,
            headers: {
              "Content-Type": contentType,
              // Don't cache the dev proxy at the browser level — easier to swap
              // in a real local file later without manual cache busting.
              "Cache-Control": "no-store",
            },
          });
        }
      } catch {
        // fall through to 404
      }
    }
    // Don't let Cloudflare cache 404s — file might appear later (e.g. after
    // restoring uploads) and we want freshly-added files to be accessible.
    return new NextResponse("Not found", {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
