"use client"

import { motion } from "framer-motion"
import { RefreshCw } from "lucide-react"
import type { ProjectUpdate } from "@/lib/projects-data"

interface TimelineUpdateItemProps {
  update: ProjectUpdate
  index: number
  isLeft: boolean
}

export function TimelineUpdateItem({ update, index, isLeft }: TimelineUpdateItemProps) {
  return (
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
        className="absolute left-[19px] md:left-1/2 top-6 w-3 h-3 rounded-full bg-primary/50 border-2 border-primary z-10 -translate-x-1/2"
      />

      {/* Year label */}
      <div className={`hidden md:block w-1/2 ${isLeft ? "text-right pr-12" : "text-left pl-12"}`}>
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-foreground/10"
        >
          {update.year}
        </motion.span>
      </div>

      {/* Update card */}
      <div className={`ml-10 md:ml-0 md:w-1/2 ${isLeft ? "md:pl-12" : "md:pr-12"}`}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-card/60 backdrop-blur-sm rounded-xl border border-primary/20 p-5 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10 shrink-0">
              <RefreshCw className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">Update</span>
                <span className="text-xs text-muted-foreground">
                  {update.month ? `${update.month} ` : ""}
                  {update.year}
                </span>
              </div>
              <h4 className="font-semibold text-foreground mb-1">{update.projectTitle}</h4>
              <p className="text-sm text-muted-foreground mb-3">{update.description}</p>

              {update.changes.length > 0 && (
                <ul className="space-y-1">
                  {update.changes.map((change, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
