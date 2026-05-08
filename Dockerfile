# syntax=docker/dockerfile:1.7

# ─── Stage 1: install deps and build ─────────────────────────────────────────
FROM node:22-bookworm-slim AS builder

# better-sqlite3 ships prebuilt binaries for linux-x64 in npm; build tools
# are kept on hand only as fallback if a prebuilt isn't found.
RUN apt-get update \
 && apt-get install -y --no-install-recommends python3 build-essential \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json* ./
# Using npm install instead of npm ci because the lockfile may be out of sync
# after the Supabase→SQLite migration and there's no local Node to regenerate
# it. Switch back to `npm ci` once the lockfile is committed in sync.
RUN npm install --no-audit --no-fund

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ─── Stage 2: minimal runtime ────────────────────────────────────────────────
FROM node:22-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV SQLITE_PATH=/app/data/portfolio.db
ENV UPLOADS_DIR=/app/data/uploads

# Run as non-root.
RUN useradd --uid 1001 --user-group --create-home --shell /usr/sbin/nologin nextjs

# Next.js standalone output bundles only what's needed.
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static     ./.next/static
COPY --from=builder --chown=nextjs:nextjs /app/public           ./public
COPY --from=builder --chown=nextjs:nextjs /app/scripts/sqlite   ./scripts/sqlite

# better-sqlite3's native binary lives in node_modules; standalone output
# already includes it via Next.js tracing — no extra copy needed.

# Persistent data directory (mounted as a PVC in K8s).
RUN mkdir -p /app/data && chown -R nextjs:nextjs /app/data
VOLUME ["/app/data"]

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
