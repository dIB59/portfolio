export interface Project {
    id: string;
    title: string;
    year: number;
    month?: string;
    description: string;
    fullDescription?: string;
    techStack: string[];
    image?: string;
    achievements?: string[];
    liveUrl?: string;
    githubUrl?: string;
}

export interface ProjectUpdate {
    id: string;
    projectId: string;
    projectTitle?: string; // Populated from join
    year: number;
    month?: string;
    description: string;
    changes: string[];
}

export interface TimelineEntry {
    type: "project" | "update";
    id: string;
    year: number;
    month?: string;
    data: Project | ProjectUpdate;
}

// Default projects data - now fetched from Supabase
export const projectsData: Project[] = [];
