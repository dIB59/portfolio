import { createClient } from "./client"
import type { ProjectUpdate } from "../projects-data"

export async function getProjectUpdates(): Promise<ProjectUpdate[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("project_updates")
    .select(`
      *,
      projects (title)
    `)
    .order("year", { ascending: false })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching project updates:", error)
    return []
  }

  return data.map((u) => ({
    id: u.id,
    projectId: u.project_id,
    projectTitle: u.projects?.title,
    year: u.year,
    month: u.month || undefined,
    description: u.description,
    changes: u.changes || [],
  }))
}

export async function getProjectUpdatesByProjectId(projectId: string): Promise<ProjectUpdate[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("project_updates")
    .select("*")
    .eq("project_id", projectId)
    .order("year", { ascending: false })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching project updates:", error)
    return []
  }

  return data.map((u) => ({
    id: u.id,
    projectId: u.project_id,
    year: u.year,
    month: u.month || undefined,
    description: u.description,
    changes: u.changes || [],
  }))
}

export async function addProjectUpdate(
  update: Omit<ProjectUpdate, "id" | "projectTitle">,
): Promise<ProjectUpdate | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("project_updates")
    .insert({
      project_id: update.projectId,
      year: update.year,
      month: update.month || null,
      description: update.description,
      changes: update.changes || [],
    })
    .select()
    .single()

  if (error) {
    console.error("Error adding project update:", error)
    return null
  }

  return {
    id: data.id,
    projectId: data.project_id,
    year: data.year,
    month: data.month || undefined,
    description: data.description,
    changes: data.changes || [],
  }
}

export async function updateProjectUpdate(id: string, update: Partial<ProjectUpdate>): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase
    .from("project_updates")
    .update({
      year: update.year,
      month: update.month || null,
      description: update.description,
      changes: update.changes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating project update:", error)
    return false
  }
  return true
}

export async function deleteProjectUpdate(id: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase.from("project_updates").delete().eq("id", id)

  if (error) {
    console.error("Error deleting project update:", error)
    return false
  }
  return true
}
