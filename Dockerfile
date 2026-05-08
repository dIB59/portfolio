# syntax=docker/dockerfile:1.7

# ─── Stage 1: install deps and build ─────────────────────────────────────────
FROM node:22-bookworm-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

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
ENV UPLOADS_DIR=/app/data/uploads

# Run as non-root.
RUN useradd --uid 1001 --user-group --create-home --shell /usr/sbin/nologin nextjs

# Next.js standalone output bundles only what's needed (including pg).
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static     ./.next/static
COPY --from=builder --chown=nextjs:nextjs /app/public           ./public
COPY --from=builder --chown=nextjs:nextjs /app/scripts/postgres ./scripts/postgres

# Persistent data directory (mounted as a PVC in K8s — used for image uploads).
RUN mkdir -p /app/data && chown -R nextjs:nextjs /app/data
VOLUME ["/app/data"]

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
