import type { Project } from "./projects-data";

export interface ChapterCopy {
    /** Single memorable line, shown oversized as the chapter pull-quote. */
    pullQuote: string;
    /** Long-form narrative shown beside the project. Two paragraphs max. */
    narrative: string;
    /** Bridge line shown between this chapter and the next. Omit on the last. */
    transitionAfter?: string;
}

/**
 * Build the chapter copy for a project. Pull-quote / narrative fall back to
 * the short description so a freshly-added project still renders something
 * reasonable until the admin fills in the chapter fields.
 */
export function chapterCopyFor(project: Project): ChapterCopy {
    return {
        pullQuote: project.pullQuote ?? project.description,
        narrative: project.narrative ?? project.description,
        transitionAfter: project.transitionAfter,
    };
}

/**
 * Sort projects into chapter order. Projects with an explicit `chapterOrder`
 * come first (ascending). Anything without an order is appended in
 * chronological order (oldest first) so the story never breaks if a project
 * is added before its chapter fields are filled in.
 */
export function sortIntoChapters(projects: Project[]): Project[] {
    return [...projects].sort((a, b) => {
        const ao = a.chapterOrder ?? Number.POSITIVE_INFINITY;
        const bo = b.chapterOrder ?? Number.POSITIVE_INFINITY;
        if (ao !== bo) return ao - bo;
        return a.year - b.year;
    });
}
