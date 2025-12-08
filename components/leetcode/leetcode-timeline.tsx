"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import type { LeetCodeProblem } from "@/lib/leetcode-types"
import { getProblems, isAuthenticated } from "@/lib/leetcode-store"
import { LeetCodeItem } from "./leetcode-item"
import { LeetCodeAdmin } from "./leetcode-admin"

export function LeetCodeTimeline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [problems, setProblems] = useState<LeetCodeProblem[]>([])
  const [isAdmin, setIsAdmin] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  useEffect(() => {
    setProblems(getProblems())
    setIsAdmin(isAuthenticated())
  }, [])

  const refreshProblems = () => {
    setProblems(getProblems())
  }

  const groupedByMonth = problems.reduce(
    (acc, problem) => {
      const date = new Date(problem.solvedDate)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      if (!acc[key]) acc[key] = []
      acc[key].push(problem)
      return acc
    },
    {} as Record<string, LeetCodeProblem[]>,
  )

  const sortedMonths = Object.keys(groupedByMonth).sort((a, b) => b.localeCompare(a))

  return (
    <section id="leetcode" className="py-20 px-4 relative" ref={containerRef}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">LeetCode Journey</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tracking my problem-solving progress, one algorithm at a time.
          </p>

          <div className="flex justify-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-muted-foreground">Confident</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-sm text-muted-foreground">Needs Review</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm text-muted-foreground">Struggled</span>
            </div>
          </div>
        </motion.div>

        <LeetCodeAdmin isAdmin={isAdmin} setIsAdmin={setIsAdmin} onProblemAdded={refreshProblems} />

        <div className="relative">
          <motion.div
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border origin-top md:-translate-x-1/2"
            style={{ scaleY }}
          />

          {sortedMonths.map((month, monthIndex) => {
            const [year, monthNum] = month.split("-")
            const monthName = new Date(Number.parseInt(year), Number.parseInt(monthNum) - 1).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })

            return (
              <div key={month} className="mb-12">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: monthIndex * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="pl-12 md:pl-0 md:text-center mb-6"
                >
                  <span className="text-lg font-semibold text-foreground bg-background px-4 relative z-10 mt-1">
                    {monthName}
                  </span>
                </motion.div>

                {groupedByMonth[month].map((problem, index) => (
                  <LeetCodeItem
                    key={problem.id}
                    problem={problem}
                    index={index}
                    isAdmin={isAdmin}
                    onDelete={refreshProblems}
                  />
                ))}
              </div>
            )
          })}

          {problems.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No problems tracked yet. {isAdmin ? "Add your first problem above!" : "Check back later!"}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
