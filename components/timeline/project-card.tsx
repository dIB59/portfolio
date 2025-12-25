"use client";

import { m } from "framer-motion";
import type { Project } from "@/lib/projects-data";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface ProjectCardProps {
    project: Project;
    onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
    return (
        <m.div
            onClick={onClick}
            whileHover={{
                scale: 1.02,
                rotateX: 2,
                rotateY: -2,
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group cursor-pointer bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-xl transition-shadow duration-300"
            style={{ transformStyle: "preserve-3d" }}
        >
            {/* Mobile year badge */}
            <span className="md:hidden text-xs font-medium text-muted-foreground mb-2 block">
                {project.year}
            </span>

            {/* Image */}
            {project.image && (
                <div className="relative overflow-hidden rounded-lg mb-4 aspect-video bg-muted">
                    <m.div
                        className="w-full h-full"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </m.div>
                </div>
            )}

            {/* Content */}
            <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-foreground/80 transition-colors">
                        {project.title}
                    </h3>
                    <m.div
                        initial={{ opacity: 0, x: -10 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ArrowUpRight className="w-5 h-5 text-muted-foreground" />
                    </m.div>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                    {project.description}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-2 pt-2">
                    {project.techStack.slice(0, 4).map((tech) => (
                        <span
                            key={tech}
                            className="px-2.5 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full"
                        >
                            {tech}
                        </span>
                    ))}
                    {project.techStack.length > 4 && (
                        <span className="px-2.5 py-1 text-xs font-medium text-muted-foreground">
                            +{project.techStack.length - 4} more
                        </span>
                    )}
                </div>
            </div>
        </m.div>
    );
}
