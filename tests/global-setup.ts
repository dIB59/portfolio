import { spawn, type ChildProcess } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { createServer } from "node:net";

const PORT = Number(process.env.TEST_PORT ?? 4321);
const BASE = `http://127.0.0.1:${PORT}`;

let server: ChildProcess | null = null;

async function isUp(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/`, { redirect: "manual" });
    return res.status < 500;
  } catch {
    return false;
  }
}

function portInUse(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const probe = createServer();
    probe.once("error", () => resolve(true));
    probe.once("listening", () => probe.close(() => resolve(false)));
    probe.listen(port, "127.0.0.1");
  });
}

export async function setup() {
  // next.config.mjs sets `output: 'standalone'`, so `next build` emits a
  // self-contained server at .next/standalone/server.js. Plain `next start`
  // doesn't work for that build; we run the standalone server directly.
  const standaloneDir = join(process.cwd(), ".next", "standalone");
  const serverJs = join(standaloneDir, "server.js");
  if (!existsSync(serverJs)) {
    throw new Error(
      `No standalone build at ${serverJs}. Run \`npm run build\` first, or use \`npm run test:integration\` which builds for you.`,
    );
  }

  // Fail fast if the port is busy. Without this, the spawn fails silently,
  // tests hit whatever server is already listening (possibly one with prod
  // credentials), and you get mysterious 401s.
  if (await portInUse(PORT)) {
    throw new Error(
      `Port ${PORT} is already in use. Free it (e.g. \`lsof -ti:${PORT} | xargs kill -9\`) before running tests, or set TEST_PORT.`,
    );
  }

  // Override prod-sensitive env so tests cannot accidentally authenticate as a
  // real admin or share a session cookie with a real user. The Postgres URL is
  // inherited from the environment so DB-dependent tests can decide whether to
  // skip themselves.
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    NODE_ENV: "production",
    PORT: String(PORT),
    HOSTNAME: "127.0.0.1",
    ADMIN_PASSWORD: "test-admin-password",
    ADMIN_EMAIL: "test@example.com",
    SESSION_PASSWORD:
      "test-session-password-must-be-at-least-32-chars-long-xx",
  };

  server = spawn(process.execPath, [serverJs], {
    cwd: standaloneDir,
    env,
    stdio: ["ignore", "pipe", "pipe"],
  });

  let serverErr = "";
  server.stderr?.on("data", (b) => {
    serverErr += b.toString();
  });
  server.on("exit", (code) => {
    if (code !== null && code !== 0) {
      // eslint-disable-next-line no-console
      console.error(`next start exited with code ${code}\n${serverErr}`);
    }
  });

  for (let i = 0; i < 120; i++) {
    if (await isUp()) {
      process.env.TEST_BASE_URL = BASE;
      process.env.TEST_DB_AVAILABLE = (await probePostgres()) ? "1" : "0";
      return;
    }
    await sleep(500);
  }
  throw new Error(`Server did not start on ${BASE}\n${serverErr}`);
}

async function probePostgres(): Promise<boolean> {
  if (!process.env.POSTGRES_URL) return false;
  try {
    const { Client } = await import("pg");
    const client = new Client({ connectionString: process.env.POSTGRES_URL });
    try {
      await client.connect();
      await client.query("SELECT 1");
      return true;
    } finally {
      await client.end().catch(() => {});
    }
  } catch {
    return false;
  }
}

export async function teardown() {
  if (!server || server.killed) return;
  server.kill("SIGTERM");
  await new Promise<void>((resolve) => {
    const t = setTimeout(() => {
      server?.kill("SIGKILL");
      resolve();
    }, 5000);
    server!.once("exit", () => {
      clearTimeout(t);
      resolve();
    });
  });
}
