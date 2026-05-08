-- Initial schema. Plain Postgres — no Supabase RLS / auth roles, since auth
-- is handled at the app layer (iron-session admin cookie).

CREATE TABLE IF NOT EXISTS projects (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  year         INTEGER NOT NULL,
  month        TEXT,
  description  TEXT NOT NULL,
  tech_stack   TEXT[] NOT NULL DEFAULT '{}',
  image        TEXT,
  achievements TEXT[] NOT NULL DEFAULT '{}',
  live_url     TEXT,
  github_url   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leetcode_problems (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT NOT NULL,
  problem_number INTEGER,
  problem_type   TEXT NOT NULL,
  difficulty     TEXT NOT NULL DEFAULT 'easy',
  confidence     TEXT NOT NULL CHECK (confidence IN ('green', 'yellow', 'red')),
  stuck_on       TEXT,
  notes          TEXT,
  image          TEXT,
  hints          TEXT[] NOT NULL DEFAULT '{}',
  solved_date    DATE NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_updates (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  year        INTEGER NOT NULL,
  month       TEXT,
  description TEXT NOT NULL,
  changes     TEXT[] NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_updates_project_id ON project_updates(project_id);
CREATE INDEX IF NOT EXISTS idx_project_updates_year       ON project_updates(year DESC);
