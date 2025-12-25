"use client";

import type { Project } from "@/lib/projects-data";
import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";
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
                            <p className="leading-relaxed">
                                {project.fullDescription || project.description}
                            </p>
                        </ModalSection>

                        {project.achievements && project.achievements.length > 0 && (
                            <ModalSection title={achievementsLabel}>
                                <ul className="space-y-3">
                                    {project.achievements.map((achievement, i) => (
                                        <li key={i} className="flex items-start gap-3 text-muted-foreground group/item">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0 transition-transform group-hover/item:scale-125" />
                                            {achievement}
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
            <div className="flex flex-wrap gap-2 pt-1">
                {techStack.map((tech) => (
                    <span
                        key={tech}
                        className="px-3 py-1.5 text-xs font-semibold bg-primary/5 text-primary border border-primary/10 rounded-full hover:bg-primary/10 transition-colors"
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
