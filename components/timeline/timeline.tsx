"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { TimelineItem } from "./timeline-item"
import { TimelineUpdateItem } from "./timeline-update-item"
import type { Project, ProjectUpdate, TimelineEntry } from "@/lib/projects-data"

interface TimelineProps {
  initialEntries: TimelineEntry[]
}

export function Timeline({ initialEntries }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 20%", "end 95%"],
  })

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  if (initialEntries.length === 0) {
    return (
      <section className="py-20 px-6 text-center text-muted-foreground">
        No projects yet. Check back later!
      </section>
    )
  }

  return (
    <section id="timeline" className="py-20 px-6" ref={containerRef}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Career Journey</h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          A timeline of my professional milestones and key projects
        </p>
      </motion.div>

      {/* Since there is no loading state, this ref is ALWAYS rendered immediately */}
      <div className="relative max-w-4xl mx-auto" ref={timelineRef}>
        <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-1/2" />

        <motion.div
          className="absolute left-[19px] md:left-1/2 top-0 w-0.5 bg-foreground md:-translate-x-1/2"
          style={{ height: lineHeight }}
        />

        <div className="absolute left-[19px] md:left-1/2 top-0 w-3 h-3 rounded-full bg-foreground md:-translate-x-1/2 -translate-y-1/2 z-10" />

        <div className="space-y-12 md:space-y-16">
          {initialEntries.map((entry, index) =>
            entry.type === "project" ? (
              <TimelineItem
                key={`project-${entry.id}`}
                project={entry.data as Project}
                index={index}
                isLeft={index % 2 === 0}
              />
            ) : (
              <TimelineUpdateItem
                key={`update-${entry.id}`}
                update={entry.data as ProjectUpdate}
                index={index}
                isLeft={index % 2 === 0}
              />
            ),
          )}
        </div>

        <div className="absolute left-[19px] md:left-1/2 bottom-0 w-3 h-3 rounded-full bg-border md:-translate-x-1/2 translate-y-1/2" />
      </div>
    </section>
  )
}