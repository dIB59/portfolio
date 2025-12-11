"use client";

import { useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import type { Project } from "@/lib/projects-data";
import { X, ExternalLink, Github } from "lucide-react";

interface ProjectModalProps {
    project: Project;
    isOpen: boolean;
    onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEsc);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-background/90 z-50"
                    />

                    {/* Modal */}
                    <m.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{
                            duration: 0.3,
                            ease: "easeOut",
                        }}
                        className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-2xl md:w-full md:max-h-[85vh] bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <div>
                                <span className="text-sm text-muted-foreground">
                                    {project.year}
                                </span>
                                <h2 className="text-2xl font-bold text-foreground">
                                    {project.title}
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-secondary transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {project.image && (
                                <div className="relative overflow-hidden rounded-xl aspect-video bg-muted">
                                    <img
                                        src={
                                            project.image || "/placeholder.svg"
                                        }
                                        alt={project.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-foreground mb-2">
                                        About
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {project.fullDescription ||
                                            project.description}
                                    </p>
                                </div>

                                {project.achievements && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-foreground mb-2">
                                            Key Achievements
                                        </h3>
                                        <ul className="space-y-2">
                                            {project.achievements.map(
                                                (achievement, i) => (
                                                    <li
                                                        key={i}
                                                        className="flex items-start gap-2 text-muted-foreground"
                                                    >
                                                        <span className="w-1.5 h-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                                                        {achievement}
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-sm font-semibold text-foreground mb-2">
                                        Tech Stack
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.techStack.map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-full"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-border flex gap-3">
                            {project.liveUrl && (
                                <a
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90 transition-colors"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    View Live
                                </a>
                            )}
                            {project.githubUrl && (
                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-border rounded-lg font-medium hover:bg-secondary transition-colors"
                                >
                                    <Github className="w-4 h-4" />
                                    Source Code
                                </a>
                            )}
                        </div>
                    </m.div>
                </>
            )}
        </AnimatePresence>
    );
}
