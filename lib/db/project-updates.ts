"use server";

import { getPool } from "../db/connection";
import type { ProjectUpdate } from "../projects-data";

interface ProjectUpdateRow {
  id: string;
  project_id: string;
  year: number;
  month: string | null;
  description: string;
  changes: string[];
  created_at: Date;
  updated_at: Date;
}

interface JoinedRow extends ProjectUpdateRow {
  project_title: string | null;
}

function rowToUpdate(
  row: ProjectUpdateRow,
  projectTitle?: string | null,
): ProjectUpdate {
  return {
    id: row.id,
    projectId: row.project_id,
    projectTitle: projectTitle ?? undefined,
    year: row.year,
    month: row.month ?? undefined,
    description: row.description,
    changes: row.changes ?? [],
  };
}

export async function getProjectUpdates(): Promise<ProjectUpdate[]> {
  const pool = await getPool();
  const { rows } = await pool.query<JoinedRow>(
    `SELECT u.*, p.title AS project_title
       FROM project_updates u
       LEFT JOIN projects p ON p.id = u.project_id
       ORDER BY u.year DESC, u.created_at DESC`,
  );
  return rows.map((r) => rowToUpdate(r, r.project_title));
}

export async function getProjectUpdatesByProjectId(
  projectId: string,
): Promise<ProjectUpdate[]> {
  const pool = await getPool();
  const { rows } = await pool.query<ProjectUpdateRow>(
    `SELECT * FROM project_updates
      WHERE project_id = $1
      ORDER BY year DESC, created_at DESC`,
    [projectId],
  );
  return rows.map((r) => rowToUpdate(r));
}

export async function addProjectUpdate(
  update: Omit<ProjectUpdate, "id" | "projectTitle">,
): Promise<ProjectUpdate | null> {
  const pool = await getPool();
  const { rows } = await pool.query<ProjectUpdateRow>(
    `INSERT INTO project_updates (project_id, year, month, description, changes)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      update.projectId,
      update.year,
      update.month ?? null,
      update.description,
      update.changes ?? [],
    ],
  );
  return rows[0] ? rowToUpdate(rows[0]) : null;
}

export async function updateProjectUpdate(
  id: string,
  update: Partial<ProjectUpdate>,
): Promise<boolean> {
  const pool = await getPool();
  const result = await pool.query(
    `UPDATE project_updates SET
      year = COALESCE($2, year),
      month = $3,
      description = COALESCE($4, description),
      changes = COALESCE($5, changes),
      updated_at = NOW()
     WHERE id = $1`,
    [
      id,
      update.year ?? null,
      update.month ?? null,
      update.description ?? null,
      update.changes ?? null,
    ],
  );
  return (result.rowCount ?? 0) > 0;
}

export async function deleteProjectUpdate(id: string): Promise<boolean> {
  const pool = await getPool();
  const result = await pool.query(
    `DELETE FROM project_updates WHERE id = $1`,
    [id],
  );
  return (result.rowCount ?? 0) > 0;
}
