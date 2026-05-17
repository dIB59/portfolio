"use server";

import { getPool } from "../db/connection";
import type { InterludeKind, Project } from "../projects-data";

interface ProjectRow {
  id: string;
  title: string;
  year: number;
  month: string | null;
  description: string;
  tech_stack: string[];
  image: string | null;
  achievements: string[];
  live_url: string | null;
  github_url: string | null;
  pull_quote: string | null;
  narrative: string | null;
  transition_after: string | null;
  chapter_order: number | null;
  interlude_after: string | null;
  created_at: Date;
  updated_at: Date;
}

function toInterlude(value: string | null): InterludeKind | undefined {
  return value === "triangle" || value === "particles" ? value : undefined;
}

function rowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    year: row.year,
    month: row.month ?? undefined,
    description: row.description,
    techStack: row.tech_stack ?? [],
    image: row.image ?? undefined,
    achievements: row.achievements ?? [],
    liveUrl: row.live_url ?? undefined,
    githubUrl: row.github_url ?? undefined,
    pullQuote: row.pull_quote ?? undefined,
    narrative: row.narrative ?? undefined,
    transitionAfter: row.transition_after ?? undefined,
    chapterOrder: row.chapter_order ?? undefined,
    interludeAfter: toInterlude(row.interlude_after),
  };
}

export async function getProjects(): Promise<Project[]> {
  const pool = await getPool();
  const { rows } = await pool.query<ProjectRow>(
    `SELECT * FROM projects ORDER BY year DESC, created_at DESC`,
  );
  return rows.map(rowToProject);
}

export async function addProject(
  project: Omit<Project, "id">,
): Promise<Project | null> {
  const pool = await getPool();
  const { rows } = await pool.query<ProjectRow>(
    `INSERT INTO projects (
       title, year, month, description, tech_stack, image, achievements,
       live_url, github_url, pull_quote, narrative, transition_after,
       chapter_order, interlude_after
     )
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
     RETURNING *`,
    [
      project.title,
      project.year,
      project.month ?? null,
      project.description,
      project.techStack ?? [],
      project.image ?? null,
      project.achievements ?? [],
      project.liveUrl ?? null,
      project.githubUrl ?? null,
      project.pullQuote ?? null,
      project.narrative ?? null,
      project.transitionAfter ?? null,
      project.chapterOrder ?? null,
      project.interludeAfter ?? null,
    ],
  );
  return rows[0] ? rowToProject(rows[0]) : null;
}

export async function updateProject(
  id: string,
  project: Partial<Project>,
): Promise<boolean> {
  const pool = await getPool();
  const result = await pool.query(
    `UPDATE projects SET
      title            = COALESCE($2,  title),
      year             = COALESCE($3,  year),
      month            = $4,
      description      = COALESCE($5,  description),
      tech_stack       = COALESCE($6,  tech_stack),
      image            = $7,
      achievements     = COALESCE($8,  achievements),
      live_url         = $9,
      github_url       = $10,
      pull_quote       = $11,
      narrative        = $12,
      transition_after = $13,
      chapter_order    = $14,
      interlude_after  = $15,
      updated_at       = NOW()
     WHERE id = $1`,
    [
      id,
      project.title ?? null,
      project.year ?? null,
      project.month ?? null,
      project.description ?? null,
      project.techStack ?? null,
      project.image ?? null,
      project.achievements ?? null,
      project.liveUrl ?? null,
      project.githubUrl ?? null,
      project.pullQuote ?? null,
      project.narrative ?? null,
      project.transitionAfter ?? null,
      project.chapterOrder ?? null,
      project.interludeAfter ?? null,
    ],
  );
  return (result.rowCount ?? 0) > 0;
}

export async function deleteProject(id: string): Promise<boolean> {
  const pool = await getPool();
  const result = await pool.query(`DELETE FROM projects WHERE id = $1`, [id]);
  return (result.rowCount ?? 0) > 0;
}
