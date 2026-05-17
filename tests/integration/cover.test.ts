import { describe, it, expect } from "vitest";
import { brotliCompressSync, constants } from "node:zlib";

const BASE = process.env.TEST_BASE_URL ?? "http://127.0.0.1:4321";

// The single non-negotiable constraint of this project (see CLAUDE.md).
// init_cwnd = 3 * ~1460 = ~4380 bytes; we set the budget conservatively to
// match what the docs promise users.
const BUDGET_BYTES = 4 * 1024;

describe("cover (/)", () => {
  it("returns 200 with text/html", async () => {
    const res = await fetch(`${BASE}/`);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type") ?? "").toMatch(/text\/html/);
  });

  it("renders above-the-fold content with no JS", async () => {
    const res = await fetch(`${BASE}/`);
    const html = await res.text();
    // Name + lede + primary nav link must be in the initial HTML.
    expect(html).toMatch(/Ibrahim/);
    expect(html).toMatch(/Stockholm/);
    expect(html).toMatch(/href="\/story/);
  });

  it("has no render-blocking external stylesheet on the critical path", async () => {
    const res = await fetch(`${BASE}/`);
    const html = await res.text();
    expect(html).not.toMatch(/<link[^>]+rel=["']?stylesheet/i);
  });

  it("fits within the 4KB Brotli budget", async () => {
    const res = await fetch(`${BASE}/`);
    const body = Buffer.from(await res.arrayBuffer());
    const compressed = brotliCompressSync(body, {
      params: {
        [constants.BROTLI_PARAM_QUALITY]: constants.BROTLI_MAX_QUALITY,
      },
    });
    expect(
      compressed.byteLength,
      `Cover is ${compressed.byteLength} bytes Brotli (budget ${BUDGET_BYTES}). Trim CSS/HTML.`,
    ).toBeLessThanOrEqual(BUDGET_BYTES);
  });
});
