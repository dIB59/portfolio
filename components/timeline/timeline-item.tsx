"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ProjectCard } from "./project-card"
import { ProjectModal } from "./project-modal"
import type { Project } from "@/lib/projects-data"

interface TimelineItemProps {
  project: Project
  index: number
  isLeft: boolean
}

export function TimelineItem({ project, index, isLeft }: TimelineItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true, margin: "-100px" }}
        className={`relative flex items-start gap-8 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} flex-row`}
      >
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          viewport={{ once: true }}
          className="absolute left-[19px] md:left-1/2 top-6 w-4 h-4 rounded-full bg-foreground border-2 border-background z-10 -translate-x-1/2"
        />

        {/* Year label */}
        <div className={`hidden md:block w-1/2 ${isLeft ? "text-right pr-12" : "text-left pl-12"}`}>
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-5xl font-bold text-foreground/10"
          >
            {project.year}
          </motion.span>
        </div>

        {/* Project card */}
        <div className={`ml-10 md:ml-0 md:w-1/2 ${isLeft ? "md:pl-12" : "md:pr-12"}`}>
          <ProjectCard project={project} onClick={() => setIsModalOpen(true)} />
        </div>
      </motion.div>

      <ProjectModal project={project} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
