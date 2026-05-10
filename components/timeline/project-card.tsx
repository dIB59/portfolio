"use client";

import { m } from "framer-motion";
import type { Project } from "@/lib/projects-data";
import Image from "next/image";
import { ArrowUpRight, Check } from "lucide-react";

interface ProjectCardProps {
    project: Project;
    onClick: () => void;
    indexLabel?: string;
}

export function ProjectCard({ project, onClick, indexLabel }: ProjectCardProps) {
    const eyebrow = project.month
        ? `${project.month} ${project.year}`
        : `${project.year}`;
    const hasAchievements = (project.achievements?.length ?? 0) > 0;
    const hasLinks = !!(project.liveUrl || project.githubUrl);

    return (
        <m.div
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onClick();
                }
            }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="group cursor-pointer bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
        >
            {project.image && (
                <div className="relative overflow-hidden aspect-video bg-muted">
                    <m.div
                        className="w-full h-full"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Image
                            src={project.image}
                            alt={`Preview image for project: ${project.title}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </m.div>
                </div>
            )}

            <div className="p-7 md:p-8 space-y-5">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" aria-hidden="true" />
                        <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground truncate">
                            {eyebrow}
                        </span>
                    </div>
                    {indexLabel && (
                        <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground shrink-0">
                            {indexLabel}
                        </span>
                    )}
                </div>

                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display italic text-2xl text-foreground leading-tight">
                        {project.title}
                    </h3>
                    <ArrowUpRight
                        className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1"
                        aria-hidden="true"
                    />
                </div>

                <p className="text-muted-foreground text-base leading-relaxed">
                    {project.description}
                </p>

                {hasAchievements && (
                    <div className="space-y-2 pt-1">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Outcomes
                        </p>
                        <ul className="space-y-1.5">
                            {project.achievements!.slice(0, 4).map((achievement, i) => (
                                <li
                                    key={i}
                                    className="flex items-start gap-2 text-sm text-foreground/90"
                                >
                                    <Check
                                        className="w-4 h-4 text-primary mt-0.5 shrink-0"
                                        aria-hidden="true"
                                    />
                                    <span>{achievement}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {project.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.techStack.slice(0, 5).map((tech) => (
                            <span
                                key={tech}
                                className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider border border-border rounded-md text-muted-foreground bg-card"
                            >
                                {tech}
                            </span>
                        ))}
                        {project.techStack.length > 5 && (
                            <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                                +{project.techStack.length - 5}
                            </span>
                        )}
                    </div>
                )}

                {hasLinks && (
                    <div className="flex items-center gap-5 pt-2 text-sm">
                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-foreground hover:text-primary transition-colors"
                            >
                                Live
                                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                            </a>
                        )}
                        {project.githubUrl && (
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-foreground hover:text-primary transition-colors"
                            >
                                Source
                                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                            </a>
                        )}
                    </div>
                )}
            </div>
        </m.div>
    );
}
