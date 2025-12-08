"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, LayoutGrid, List, Loader2 } from "lucide-react"
import type { LeetCodeProblem } from "@/lib/leetcode-types"
import { getLeetCodeProblems } from "@/lib/supabase/leetcode"
import { LeetCodeItem } from "./leetcode-item"
import { LeetCodeTable } from "./leetcode-table"
import { Button } from "@/components/ui/button"

// --- 1. Sub-component for the Timeline Logic ---
// We move the useScroll hook here so it only runs when this component is mounted (after loading).
function TimelineView({
  problems,
  groupedByMonth,
  sortedMonths,
}: {
  problems: LeetCodeProblem[]
  groupedByMonth: Record<string, LeetCodeProblem[]>
  sortedMonths: string[]
}) {
  const timelineRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 10%", "end 90%"],
  })

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  
  // Reset index for this view
  let globalIndex = 0

  return (
    <div className="relative max-w-4xl mx-auto" ref={timelineRef}>
      {/* Static background line - full height */}
      <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-1/2" />

      <motion.div
        className="absolute left-[19px] md:left-1/2 top-0 w-0.5 bg-foreground md:-translate-x-1/2"
        style={{ height: lineHeight }}
      />

      <div className="absolute left-[19px] md:left-1/2 top-0 w-3 h-3 rounded-full bg-foreground md:-translate-x-1/2 -translate-y-1/2 z-10" />

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
              <span className="text-lg font-semibold text-foreground bg-background px-4 relative z-10">
                {monthName}
              </span>
            </motion.div>

            {groupedByMonth[month].map((problem) => {
              const currentIndex = globalIndex++
              return (
                <LeetCodeItem
                  key={problem.id}
                  problem={problem}
                  index={currentIndex}
                  isAdmin={false}
                  onDelete={() => {}}
                />
              )
            })}
          </div>
        )
      })}

      {problems.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No problems tracked yet. Check back later!</div>
      ) : (
        /* End cap dot */
        <div className="absolute left-[19px] md:left-1/2 bottom-0 w-3 h-3 rounded-full bg-border md:-translate-x-1/2 translate-y-1/2" />
      )}
    </div>
  )
}

// --- 2. Main Component ---
export function LeetCodeSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [problems, setProblems] = useState<LeetCodeProblem[]>([])
  const [viewMode, setViewMode] = useState<"timeline" | "table">("timeline")
  const [isLoading, setIsLoading] = useState(true)

  // Removed useScroll from here because timelineRef isn't reliable at this level

  useEffect(() => {
    async function fetchProblems() {
      const data = await getLeetCodeProblems()
      setProblems(data)
      setIsLoading(false)
    }
    fetchProblems()
  }, [])

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
    <section className="py-20 px-4 relative min-h-screen" ref={containerRef}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">LeetCode Journey</h1>
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-2 mb-8"
        >
          <Button
            variant={viewMode === "timeline" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("timeline")}
            className="gap-2"
          >
            <LayoutGrid className="w-4 h-4" />
            Timeline
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
            className="gap-2"
          >
            <List className="w-4 h-4" />
            Table
          </Button>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : viewMode === "table" ? (
          <LeetCodeTable problems={problems} isAdmin={false} onDelete={() => {}} />
        ) : (
          <TimelineView 
            problems={problems} 
            groupedByMonth={groupedByMonth} 
            sortedMonths={sortedMonths} 
          />
        )}
      </div>
    </section>
  )
}