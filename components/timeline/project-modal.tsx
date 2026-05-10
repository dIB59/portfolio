"use client";

import type { Project } from "@/lib/projects-data";
import Image from "next/image";
import { Check, ExternalLink, Github } from "lucide-react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalSection
} from "./modal-base";

interface ProjectModalProps {
    project: Project;
    isOpen: boolean;
    onClose: () => void;
    aboutLabel?: string;
    achievementsLabel?: string;
}

/**
 * ProjectModal - A composed modal for project details and updates.
 * Demonstrates a senior engineering pattern of component composition.
 */
export function ProjectModal({
    project,
    isOpen,
    onClose,
    aboutLabel = "About",
    achievementsLabel = "Key Achievements",
}: ProjectModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader
                    title={project.title}
                    subtitle={project.year}
                    onClose={onClose}
                />

                <ModalBody>
                    {project.image && <ProjectMedia project={project} />}

                    <div className="space-y-6">
                        <ModalSection title={aboutLabel}>
                            <p className="leading-relaxed max-w-prose">
                                {project.fullDescription || project.description}
                            </p>
                        </ModalSection>

                        {project.achievements && project.achievements.length > 0 && (
                            <ModalSection title={achievementsLabel}>
                                <ul className="space-y-2">
                                    {project.achievements.map((achievement, i) => (
                                        <li key={i} className="flex items-start gap-2 text-foreground/90">
                                            <Check
                                                className="w-4 h-4 text-primary mt-0.5 shrink-0"
                                                aria-hidden="true"
                                            />
                                            <span>{achievement}</span>
                                        </li>
                                    ))}
                                </ul>
                            </ModalSection>
                        )}

                        {project.techStack.length > 0 && <ProjectTechStack techStack={project.techStack} />}
                    </div>
                </ModalBody>

                <ModalFooter>
                    <ProjectLinks project={project} />
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

/**
 * Internal helper for media display
 */
function ProjectMedia({ project }: { project: Project }) {
    return (
        <div className="relative overflow-hidden rounded-xl aspect-video bg-muted group-hover:shadow-inner transition-shadow">
            <Image
                src={project.image || "/placeholder.svg"}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 800px"
            />
        </div>
    );
}

/**
 * Internal helper for tech stack display
 */
function ProjectTechStack({ techStack }: { techStack: string[] }) {
    return (
        <ModalSection title="Tech Stack" className="space-y-3">
            <div className="flex flex-wrap gap-1.5 pt-1">
                {techStack.map((tech) => (
                    <span
                        key={tech}
                        className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider border border-border rounded-md text-muted-foreground bg-card"
                    >
                        {tech}
                    </span>
                ))}
            </div>
        </ModalSection>
    );
}

/**
 * Internal helper for link buttons
 */
function ProjectLinks({ project }: { project: Project }) {
    const hasLinks = project.liveUrl || project.githubUrl;

    if (!hasLinks) return null;

    return (
        <>
            {project.liveUrl && (
                <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-background rounded-xl font-semibold hover:bg-foreground/90 transition-all active:scale-[0.98]"
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
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-xl font-semibold hover:bg-secondary hover:border-primary/20 transition-all active:scale-[0.98]"
                >
                    <Github className="w-4 h-4" />
                    Source Code
                </a>
            )}
        </>
    );
}
