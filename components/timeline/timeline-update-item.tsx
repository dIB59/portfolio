"use client";

import { RefreshCw } from "lucide-react";
import type { ProjectUpdate } from "@/lib/projects-data";
import { useState } from "react";
import dynamic from "next/dynamic";
import {
    TimelineItemContainer,
    TimelineMarker,
    TimelineLabel,
    TimelineContent
} from "./timeline-base";

// Lazy load modal
const ProjectModal = dynamic(
    () => import("./project-modal").then((mod) => ({ default: mod.ProjectModal })),
    { ssr: false }
);

interface TimelineUpdateItemProps {
    update: ProjectUpdate;
    index: number;
    isLeft: boolean;
}

/**
 * TimelineUpdateItem - A composed timeline entry for project updates.
 * Leverages timeline primitives for a professional, senior-level architecture.
 */
export function TimelineUpdateItem({
    update,
    index,
    isLeft,
}: TimelineUpdateItemProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Map ProjectUpdate to a structure ProjectModal can use
    const projectProxy = {
        id: update.id,
        title: update.projectTitle || "Update",
        description: update.description,
        year: update.month ? `${update.month} ${update.year}` : update.year.toString(),
        techStack: [],
        achievements: update.changes,
    } as any;

    const labelText = update.month ? `${update.month.substring(0, 3)} ${update.year}` : update.year.toString();

    return (
        <TimelineItemContainer index={index} isLeft={isLeft}>
            <TimelineMarker index={index} />

            <TimelineLabel index={index} isLeft={isLeft}>
                {labelText}
            </TimelineLabel>

            <TimelineContent isLeft={isLeft}>
                <UpdateCard
                    update={update}
                    onClick={() => setIsModalOpen(true)}
                />
            </TimelineContent>

            <ProjectModal
                project={projectProxy}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                aboutLabel="Description"
                achievementsLabel="Changes and Improvements"
            />
        </TimelineItemContainer>
    );
}

/**
 * Internal helper for the update card UI
 */
function UpdateCard({
    update,
    onClick
}: {
    update: ProjectUpdate;
    onClick: () => void;
}) {
    return (
        <div
            onClick={onClick}
            className="group cursor-pointer bg-card/60 backdrop-blur-sm rounded-xl border border-primary/20 p-5 shadow-sm hover:border-primary/40 hover:shadow-md transition-all duration-300 active:scale-[0.99]"
        >
            <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 shrink-0 transition-colors group-hover:bg-primary/20">
                    <RefreshCw className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                            Update
                        </span>
                    </div>
                    <h4 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {update.projectTitle}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {update.description}
                    </p>
                </div>
            </div>
        </div>
    );
}
