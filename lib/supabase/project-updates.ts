"use server";

import { getDb } from "../db/connection";
import type { ProjectUpdate } from "../projects-data";

interface ProjectUpdateRow {
  id: string;
  project_id: string;
  year: number;
  month: string | null;
  description: string;
  changes: string;
  created_at: string;
  updated_at: string;
}

interface JoinedRow extends ProjectUpdateRow {
  project_title: string | null;
}

function rowToUpdate(row: ProjectUpdateRow, projectTitle?: string | null): ProjectUpdate {
  return {
    id: row.id,
    projectId: row.project_id,
    projectTitle: projectTitle ?? undefined,
    year: row.year,
    month: row.month ?? undefined,
    description: row.description,
    changes: JSON.parse(row.changes || "[]"),
  };
}

export async function getProjectUpdates(): Promise<ProjectUpdate[]> {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT u.*, p.title AS project_title
         FROM project_updates u
         LEFT JOIN projects p ON p.id = u.project_id
         ORDER BY u.year DESC, u.created_at DESC`,
    )
    .all() as JoinedRow[];

  return rows.map((r) => rowToUpdate(r, r.project_title));
}

export async function getProjectUpdatesByProjectId(
  projectId: string,
): Promise<ProjectUpdate[]> {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT * FROM project_updates
        WHERE project_id = ?
        ORDER BY year DESC, created_at DESC`,
    )
    .all(projectId) as ProjectUpdateRow[];

  return rows.map((r) => rowToUpdate(r));
}

export async function addProjectUpdate(
  update: Omit<ProjectUpdate, "id" | "projectTitle">,
): Promise<ProjectUpdate | null> {
  const db = getDb();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO project_updates (id, project_id, year, month, description, changes, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    update.projectId,
    update.year,
    update.month ?? null,
    update.description,
    JSON.stringify(update.changes ?? []),
    now,
    now,
  );

  const row = db
    .prepare(`SELECT * FROM project_updates WHERE id = ?`)
    .get(id) as ProjectUpdateRow;

  return rowToUpdate(row);
}

export async function updateProjectUpdate(
  id: string,
  update: Partial<ProjectUpdate>,
): Promise<boolean> {
  const db = getDb();
  const now = new Date().toISOString();

  const result = db
    .prepare(
      `UPDATE project_updates SET
        year = COALESCE(?, year),
        month = ?,
        description = COALESCE(?, description),
        changes = COALESCE(?, changes),
        updated_at = ?
       WHERE id = ?`,
    )
    .run(
      update.year ?? null,
      update.month ?? null,
      update.description ?? null,
      update.changes ? JSON.stringify(update.changes) : null,
      now,
      id,
    );

  return result.changes > 0;
}

export async function deleteProjectUpdate(id: string): Promise<boolean> {
  const db = getDb();
  const result = db.prepare(`DELETE FROM project_updates WHERE id = ?`).run(id);
  return result.changes > 0;
}
