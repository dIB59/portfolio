"use client";

import { Chapter } from "@/components/chapter";
import type { Project } from "@/lib/projects-data";
import type { ChapterCopy } from "@/lib/story";

interface ChapterSpreadProps {
    project: Project;
    copy: ChapterCopy;
    /** 1-based number, zero-padded — "01", "02", … */
    chapterNumber: string;
    /** Used for the alternating Body layout. */
    index: number;
    isLast: boolean;
}

/**
 * The standard editorial layout for a project chapter.
 *
 * This file exists so Server Components can render chapters without losing
 * the `<Chapter.X>` namespace — the property accessors on `Object.assign`'d
 * exports don't survive Next's server/client boundary, but they work fine
 * inside a Client Component like this one.
 *
 * If a chapter ever needs a non-standard layout, import the `Chapter`
 * primitive family from `@/components/chapter` directly in a new client
 * component and compose it however you like.
 */
export function ChapterSpread({
    project,
    copy,
    chapterNumber,
    index,
    isLast,
}: ChapterSpreadProps) {
    const date = project.month
        ? `${project.month} ${project.year}`
        : `${project.year}`;
    const flip = index % 2 !== 0;
    const hasOutcomes = (project.achievements?.length ?? 0) > 0;
    const hasMeta =
        project.techStack.length > 0 ||
        !!project.liveUrl ||
        !!project.githubUrl;

    return (
        <Chapter id={`chapter-${index + 1}`} flip={flip}>
            <Chapter.Header>
                <Chapter.Number>{chapterNumber}</Chapter.Number>
                <Chapter.Heading>
                    <Chapter.Eyebrow>
                        Chapter {chapterNumber} · {date}
                    </Chapter.Eyebrow>
                    <Chapter.Title>{project.title}</Chapter.Title>
                </Chapter.Heading>
            </Chapter.Header>

            <Chapter.PullQuote>{copy.pullQuote}</Chapter.PullQuote>

            <Chapter.Body>
                <Chapter.Prose>
                    <Chapter.Narrative>{copy.narrative}</Chapter.Narrative>

                    {hasOutcomes && (
                        <Chapter.Outcomes>
                            {project.achievements!.map((a, i) => (
                                <Chapter.Outcome key={i}>{a}</Chapter.Outcome>
                            ))}
                        </Chapter.Outcomes>
                    )}

                    {hasMeta && (
                        <Chapter.Meta>
                            <Chapter.Tech items={project.techStack} />
                            {project.liveUrl && (
                                <Chapter.LiveLink href={project.liveUrl} />
                            )}
                            {project.githubUrl && (
                                <Chapter.SourceLink href={project.githubUrl} />
                            )}
                        </Chapter.Meta>
                    )}
                </Chapter.Prose>

                {project.image && (
                    <Chapter.Figure
                        src={project.image}
                        alt={`Preview of ${project.title}`}
                    />
                )}
            </Chapter.Body>

            {!isLast && copy.transitionAfter && (
                <Chapter.Transition>{copy.transitionAfter}</Chapter.Transition>
            )}
        </Chapter>
    );
}
