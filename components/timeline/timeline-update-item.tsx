"use client";

import { m } from "framer-motion";
import { RefreshCw } from "lucide-react";
import type { ProjectUpdate } from "@/lib/projects-data";

import { useState } from "react";
import dynamic from "next/dynamic";

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
                    className="absolute left-[19px] md:left-1/2 top-6 w-3 h-3 rounded-full bg-primary/50 border-2 border-primary z-10 -translate-x-1/2"
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
                        {update.month ? `${update.month.substring(0, 3)} ` : ""}{update.year}
                    </m.span>
                </div>

                {/* Update card */}
                <div
                    className={`ml-10 md:ml-0 md:w-1/2 ${isLeft ? "md:pl-12" : "md:pr-12"}`}
                >
                    <m.div
                        whileHover={{ scale: 1.01 }}
                        onClick={() => setIsModalOpen(true)}
                        className="bg-card/60 backdrop-blur-sm rounded-xl border border-primary/20 p-5 shadow-sm cursor-pointer hover:border-primary/40 transition-colors"
                    >
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                                <RefreshCw className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                                        Update
                                    </span>
                                </div>
                                <h4 className="font-semibold text-foreground mb-1">
                                    {update.projectTitle}
                                </h4>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {update.description}
                                </p>
                            </div>
                        </div>
                    </m.div>
                </div>
            </m.div>

            <ProjectModal
                project={projectProxy}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                aboutLabel="Description"
                achievementsLabel="Changes and Improvements"
            />
        </>
    );
}
