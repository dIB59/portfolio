"use client";

import { useState } from "react";
import type { Project } from "@/lib/projects-data";
import { ProjectCard } from "./project-card";
import dynamic from "next/dynamic";
import {
    TimelineItemContainer,
    TimelineMarker,
    TimelineLabel,
    TimelineContent
} from "./timeline-base";

// Lazy load modal (only loads when first opened)
const ProjectModal = dynamic(
    () => import("./project-modal").then((mod) => ({ default: mod.ProjectModal })),
    { ssr: false }
);

interface TimelineItemProps {
    project: Project;
    index: number;
    isLeft: boolean;
}

/**
 * TimelineItem - A composed timeline entry for projects.
 * Leverages timeline primitives for a professional, senior-level architecture.
 */
export function TimelineItem({ project, index, isLeft }: TimelineItemProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const labelText = project.month ? `${project.month.substring(0, 3)} ${project.year} ` : project.year.toString();

    return (
        <TimelineItemContainer index={index} isLeft={isLeft}>
            <TimelineMarker index={index} />

            <TimelineLabel index={index} isLeft={isLeft}>
                {labelText}
            </TimelineLabel>

            <TimelineContent isLeft={isLeft}>
                <ProjectCard
                    project={project}
                    onClick={() => setIsModalOpen(true)}
                />
            </TimelineContent>

            <ProjectModal
                project={project}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </TimelineItemContainer>
    );
}
