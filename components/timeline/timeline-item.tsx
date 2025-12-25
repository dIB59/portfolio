"use client";

import { useState } from "react";
import { m } from "framer-motion";
import { ProjectCard } from "./project-card";
import type { Project } from "@/lib/projects-data";
import dynamic from "next/dynamic";

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

export function TimelineItem({ project, index, isLeft }: TimelineItemProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <m.div
                initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true, margin: "-50px", amount: 0.2 }}
                className={`relative flex items-start gap-8 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} flex-row`}
            >
                <m.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 + 0.2 }}
                    viewport={{ once: true }}
                    className="absolute left-[19px] md:left-1/2 top-6 w-4 h-4 rounded-full bg-foreground border-2 border-background z-10 -translate-x-1/2"
                />

                {/* Month and year label */}
                <div
                    className={`hidden md:block w-1/2 ${isLeft ? "text-right pr-12" : "text-left pl-12"}`}
                >
                    <m.span
                        initial={{ opacity: 0, filter: "blur(4px)" }}
                        whileInView={{ opacity: 1, filter: "blur(0px)" }}
                        transition={{ duration: 0.4, delay: index * 0.05 + 0.3 }}
                        viewport={{ once: true }}
                        className="text-4xl font-bold text-foreground"
                    >
                        {project.month ? `${project.month.substring(0, 3)} ` : ""}{project.year}
                    </m.span>
                </div>

                {/* Project card */}
                <div
                    className={`ml-10 md:ml-0 md:w-1/2 ${isLeft ? "md:pl-12" : "md:pr-12"}`}
                >
                    <ProjectCard
                        project={project}
                        onClick={() => setIsModalOpen(true)}
                    />
                </div>
            </m.div>

            <ProjectModal
                project={project}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
