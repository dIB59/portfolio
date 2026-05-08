"use server";

import { getDb } from "../db/connection";
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
  hints: string;
  solved_date: string;
  created_at: string;
  updated_at: string;
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
    hints: JSON.parse(row.hints || "[]"),
    solvedDate: row.solved_date,
  };
}

export async function getLeetCodeProblems(): Promise<LeetCodeProblem[]> {
  const db = getDb();
  const rows = db
    .prepare(`SELECT * FROM leetcode_problems ORDER BY solved_date DESC`)
    .all() as LeetCodeRow[];
  return rows.map(rowToProblem);
}

export async function addLeetCodeProblem(
  problem: Omit<LeetCodeProblem, "id">,
): Promise<LeetCodeProblem | null> {
  const db = getDb();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO leetcode_problems (id, name, problem_number, problem_type, difficulty, confidence, stuck_on, notes, image, hints, solved_date, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    problem.name,
    problem.problemNumber ?? null,
    problem.type,
    problem.difficulty,
    problem.confidence,
    problem.stuckOn ?? null,
    problem.notes ?? null,
    problem.image ?? null,
    JSON.stringify(problem.hints ?? []),
    problem.solvedDate,
    now,
    now,
  );

  const row = db
    .prepare(`SELECT * FROM leetcode_problems WHERE id = ?`)
    .get(id) as LeetCodeRow;

  return rowToProblem(row);
}

export async function updateLeetCodeProblem(
  id: string,
  problem: Partial<LeetCodeProblem>,
): Promise<boolean> {
  const db = getDb();
  const now = new Date().toISOString();

  const result = db
    .prepare(
      `UPDATE leetcode_problems SET
        name = COALESCE(?, name),
        problem_number = ?,
        problem_type = COALESCE(?, problem_type),
        difficulty = COALESCE(?, difficulty),
        confidence = COALESCE(?, confidence),
        stuck_on = ?,
        notes = ?,
        image = ?,
        hints = COALESCE(?, hints),
        solved_date = COALESCE(?, solved_date),
        updated_at = ?
       WHERE id = ?`,
    )
    .run(
      problem.name ?? null,
      problem.problemNumber ?? null,
      problem.type ?? null,
      problem.difficulty ?? null,
      problem.confidence ?? null,
      problem.stuckOn ?? null,
      problem.notes ?? null,
      problem.image ?? null,
      problem.hints ? JSON.stringify(problem.hints) : null,
      problem.solvedDate ?? null,
      now,
      id,
    );

  return result.changes > 0;
}

export async function deleteLeetCodeProblem(id: string): Promise<boolean> {
  const db = getDb();
  const result = db
    .prepare(`DELETE FROM leetcode_problems WHERE id = ?`)
    .run(id);
  return result.changes > 0;
}
