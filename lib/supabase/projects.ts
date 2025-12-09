import { createClient } from "./client";
import type { Project } from "../projects-data";

export async function getProjects(): Promise<Project[]> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("year", { ascending: false })
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching projects:", error);
        return [];
    }

    return data.map((p) => ({
        id: p.id,
        title: p.title,
        year: p.year,
        month: p.month || undefined,
        description: p.description,
        techStack: p.tech_stack || [],
        image: p.image || undefined,
        achievements: p.achievements || [],
        liveUrl: p.live_url || undefined,
        githubUrl: p.github_url || undefined,
    }));
}

export async function addProject(
    project: Omit<Project, "id">,
): Promise<Project | null> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("projects")
        .insert({
            title: project.title,
            year: project.year,
            month: project.month || null,
            description: project.description,
            tech_stack: project.techStack,
            image: project.image || null,
            achievements: project.achievements || [],
            live_url: project.liveUrl || null,
            github_url: project.githubUrl || null,
        })
        .select()
        .single();

    if (error) {
        console.error("Error adding project:", error);
        return null;
    }

    return {
        id: data.id,
        title: data.title,
        year: data.year,
        month: data.month || undefined,
        description: data.description,
        techStack: data.tech_stack || [],
        image: data.image || undefined,
        achievements: data.achievements || [],
        liveUrl: data.live_url || undefined,
        githubUrl: data.github_url || undefined,
    };
}

export async function updateProject(
    id: string,
    project: Partial<Project>,
): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase
        .from("projects")
        .update({
            title: project.title,
            year: project.year,
            month: project.month || null,
            description: project.description,
            tech_stack: project.techStack,
            image: project.image || null,
            achievements: project.achievements,
            live_url: project.liveUrl || null,
            github_url: project.githubUrl || null,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id);

    if (error) {
        console.error("Error updating project:", error);
        return false;
    }
    return true;
}

export async function deleteProject(id: string): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
        console.error("Error deleting project:", error);
        return false;
    }
    return true;
}
