import { createClient } from "./client"
import type { LeetCodeProblem } from "../leetcode-types"

export async function getLeetCodeProblems(): Promise<LeetCodeProblem[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("leetcode_problems")
    .select("*")
    .order("solved_date", { ascending: false })

  if (error) {
    console.error("Error fetching leetcode problems:", error)
    return []
  }

  return data.map((p) => ({
    id: p.id,
    name: p.name,
    problemNumber: p.problem_number || undefined,
    type: p.problem_type,
    confidence: p.confidence as "green" | "yellow" | "red",
    stuckOn: p.stuck_on || undefined,
    notes: p.notes || undefined,
    image: p.image || undefined,
    solvedDate: p.solved_date,
  }))
}

export async function addLeetCodeProblem(problem: Omit<LeetCodeProblem, "id">): Promise<LeetCodeProblem | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("leetcode_problems")
    .insert({
      name: problem.name,
      problem_number: problem.problemNumber || null,
      problem_type: problem.type,
      confidence: problem.confidence,
      stuck_on: problem.stuckOn || null,
      notes: problem.notes || null,
      image: problem.image || null,
      solved_date: problem.solvedDate,
    })
    .select()
    .single()

  if (error) {
    console.error("Error adding leetcode problem:", error)
    return null
  }

  return {
    id: data.id,
    name: data.name,
    problemNumber: data.problem_number || undefined,
    type: data.problem_type,
    confidence: data.confidence as "green" | "yellow" | "red",
    stuckOn: data.stuck_on || undefined,
    notes: data.notes || undefined,
    image: data.image || undefined,
    solvedDate: data.solved_date,
  }
}

export async function updateLeetCodeProblem(id: string, problem: Partial<LeetCodeProblem>): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase
    .from("leetcode_problems")
    .update({
      name: problem.name,
      problem_number: problem.problemNumber || null,
      problem_type: problem.type,
      confidence: problem.confidence,
      stuck_on: problem.stuckOn || null,
      notes: problem.notes || null,
      image: problem.image || null,
      solved_date: problem.solvedDate,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating leetcode problem:", error)
    return false
  }
  return true
}

export async function deleteLeetCodeProblem(id: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase.from("leetcode_problems").delete().eq("id", id)

  if (error) {
    console.error("Error deleting leetcode problem:", error)
    return false
  }
  return true
}
