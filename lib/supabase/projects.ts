"use server";

import { getDb } from "../db/connection";
import type { Project } from "../projects-data";

interface ProjectRow {
  id: string;
  title: string;
  year: number;
  month: string | null;
  description: string;
  tech_stack: string;
  image: string | null;
  achievements: string;
  live_url: string | null;
  github_url: string | null;
  created_at: string;
  updated_at: string;
}

function rowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    year: row.year,
    month: row.month ?? undefined,
    description: row.description,
    techStack: JSON.parse(row.tech_stack || "[]"),
    image: row.image ?? undefined,
    achievements: JSON.parse(row.achievements || "[]"),
    liveUrl: row.live_url ?? undefined,
    githubUrl: row.github_url ?? undefined,
  };
}

export async function getProjects(): Promise<Project[]> {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT * FROM projects ORDER BY year DESC, created_at DESC`,
    )
    .all() as ProjectRow[];
  return rows.map(rowToProject);
}

export async function addProject(
  project: Omit<Project, "id">,
): Promise<Project | null> {
  const db = getDb();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO projects (id, title, year, month, description, tech_stack, image, achievements, live_url, github_url, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    project.title,
    project.year,
    project.month ?? null,
    project.description,
    JSON.stringify(project.techStack ?? []),
    project.image ?? null,
    JSON.stringify(project.achievements ?? []),
    project.liveUrl ?? null,
    project.githubUrl ?? null,
    now,
    now,
  );

  const row = db
    .prepare(`SELECT * FROM projects WHERE id = ?`)
    .get(id) as ProjectRow;

  return rowToProject(row);
}

export async function updateProject(
  id: string,
  project: Partial<Project>,
): Promise<boolean> {
  const db = getDb();
  const now = new Date().toISOString();

  const result = db
    .prepare(
      `UPDATE projects SET
        title = COALESCE(?, title),
        year = COALESCE(?, year),
        month = ?,
        description = COALESCE(?, description),
        tech_stack = COALESCE(?, tech_stack),
        image = ?,
        achievements = COALESCE(?, achievements),
        live_url = ?,
        github_url = ?,
        updated_at = ?
       WHERE id = ?`,
    )
    .run(
      project.title ?? null,
      project.year ?? null,
      project.month ?? null,
      project.description ?? null,
      project.techStack ? JSON.stringify(project.techStack) : null,
      project.image ?? null,
      project.achievements ? JSON.stringify(project.achievements) : null,
      project.liveUrl ?? null,
      project.githubUrl ?? null,
      now,
      id,
    );

  return result.changes > 0;
}

export async function deleteProject(id: string): Promise<boolean> {
  const db = getDb();
  const result = db.prepare(`DELETE FROM projects WHERE id = ?`).run(id);
  return result.changes > 0;
}
