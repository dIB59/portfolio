export type InterludeKind = "triangle" | "particles";

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
    // Chapter fields. The /story page reads these directly; the projects admin
    // edits them inline. A project without `chapterOrder` is appended to the
    // end of the story.
    pullQuote?: string;
    narrative?: string;
    transitionAfter?: string;
    chapterOrder?: number;
    interludeAfter?: InterludeKind;
}

// Default projects data — fetched from Postgres.
export const projectsData: Project[] = [];
