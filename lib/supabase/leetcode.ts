"use server";

import { getPool } from "../db/connection";
import type { Difficulty, LeetCodeProblem } from "@/lib/types/leetcode";

interface LeetCodeRow {
  id: string;
  name: string;
  problem_number: number | null;
  problem_type: string;
  difficulty: string;
  confidence: string;
  stuck_on: string | null;
  notes: string | null;
  image: string | null;
  hints: string[];
  solved_date: Date;
  created_at: Date;
  updated_at: Date;
}

function rowToProblem(row: LeetCodeRow): LeetCodeProblem {
  return {
    id: row.id,
    name: row.name,
    problemNumber: row.problem_number ?? undefined,
    difficulty: row.difficulty as Difficulty,
    type: row.problem_type,
    confidence: row.confidence as "green" | "yellow" | "red",
    stuckOn: row.stuck_on ?? undefined,
    notes: row.notes ?? undefined,
    image: row.image ?? undefined,
    hints: row.hints ?? [],
    solvedDate:
      row.solved_date instanceof Date
        ? row.solved_date.toISOString().slice(0, 10)
        : String(row.solved_date),
  };
}

export async function getLeetCodeProblems(): Promise<LeetCodeProblem[]> {
  const pool = await getPool();
  const { rows } = await pool.query<LeetCodeRow>(
    `SELECT * FROM leetcode_problems ORDER BY solved_date DESC`,
  );
  return rows.map(rowToProblem);
}

export async function addLeetCodeProblem(
  problem: Omit<LeetCodeProblem, "id">,
): Promise<LeetCodeProblem | null> {
  const pool = await getPool();
  const { rows } = await pool.query<LeetCodeRow>(
    `INSERT INTO leetcode_problems
       (name, problem_number, problem_type, difficulty, confidence, stuck_on, notes, image, hints, solved_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [
      problem.name,
      problem.problemNumber ?? null,
      problem.type,
      problem.difficulty,
      problem.confidence,
      problem.stuckOn ?? null,
      problem.notes ?? null,
      problem.image ?? null,
      problem.hints ?? [],
      problem.solvedDate,
    ],
  );
  return rows[0] ? rowToProblem(rows[0]) : null;
}

export async function updateLeetCodeProblem(
  id: string,
  problem: Partial<LeetCodeProblem>,
): Promise<boolean> {
  const pool = await getPool();
  const result = await pool.query(
    `UPDATE leetcode_problems SET
      name = COALESCE($2, name),
      problem_number = $3,
      problem_type = COALESCE($4, problem_type),
      difficulty = COALESCE($5, difficulty),
      confidence = COALESCE($6, confidence),
      stuck_on = $7,
      notes = $8,
      image = $9,
      hints = COALESCE($10, hints),
      solved_date = COALESCE($11, solved_date),
      updated_at = NOW()
     WHERE id = $1`,
    [
      id,
      problem.name ?? null,
      problem.problemNumber ?? null,
      problem.type ?? null,
      problem.difficulty ?? null,
      problem.confidence ?? null,
      problem.stuckOn ?? null,
      problem.notes ?? null,
      problem.image ?? null,
      problem.hints ?? null,
      problem.solvedDate ?? null,
    ],
  );
  return (result.rowCount ?? 0) > 0;
}

export async function deleteLeetCodeProblem(id: string): Promise<boolean> {
  const pool = await getPool();
  const result = await pool.query(
    `DELETE FROM leetcode_problems WHERE id = $1`,
    [id],
  );
  return (result.rowCount ?? 0) > 0;
}
