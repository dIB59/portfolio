-- Initial schema. UUIDs are TEXT (populated by app via crypto.randomUUID()).
-- Postgres TEXT[] arrays become JSON-encoded TEXT columns; the app parses/stringifies.
-- TIMESTAMPTZ becomes ISO 8601 TEXT.

CREATE TABLE IF NOT EXISTS projects (
  id           TEXT PRIMARY KEY,
  title        TEXT NOT NULL,
  year         INTEGER NOT NULL,
  month        TEXT,
  description  TEXT NOT NULL,
  tech_stack   TEXT NOT NULL DEFAULT '[]',
  image        TEXT,
  achievements TEXT NOT NULL DEFAULT '[]',
  live_url     TEXT,
  github_url   TEXT,
  created_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS leetcode_problems (
  id             TEXT PRIMARY KEY,
  name           TEXT NOT NULL,
  problem_number INTEGER,
  problem_type   TEXT NOT NULL,
  difficulty     TEXT NOT NULL DEFAULT 'easy',
  confidence     TEXT NOT NULL CHECK (confidence IN ('green', 'yellow', 'red')),
  stuck_on       TEXT,
  notes          TEXT,
  image          TEXT,
  hints          TEXT NOT NULL DEFAULT '[]',
  solved_date    TEXT NOT NULL,
  created_at     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS project_updates (
  id          TEXT PRIMARY KEY,
  project_id  TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  year        INTEGER NOT NULL,
  month       TEXT,
  description TEXT NOT NULL,
  changes     TEXT NOT NULL DEFAULT '[]',
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_project_updates_project_id ON project_updates(project_id);
CREATE INDEX IF NOT EXISTS idx_project_updates_year       ON project_updates(year DESC);
