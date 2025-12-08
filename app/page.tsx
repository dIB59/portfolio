import { Hero } from "@/components/hero" // adjust path
import { getProjects } from "@/lib/supabase/projects"
import { getProjectUpdates } from "@/lib/supabase/project-updates"
import type { TimelineEntry } from "@/lib/projects-data"
import { Timeline } from "@/components/timeline/timeline"
import ParticlesComponent, { ThreeBackground } from "@/components/three-background"

export default async function PortfolioPage() {
  // 1. Fetch data on the server (in parallel)
  const [projects, updates] = await Promise.all([getProjects(), getProjectUpdates()])

  // 2. Prepare the data (Same logic you had in useEffect)
  const timelineEntries: TimelineEntry[] = [
    ...projects.map((p) => ({
      type: "project" as const,
      id: p.id,
      year: p.year,
      month: p.month,
      data: p,
    })),
    ...updates.map((u) => ({
      type: "update" as const,
      id: u.id,
      year: u.year,
      month: u.month,
      data: u,
    })),
  ]

  const monthOrder: Record<string, number> = {
    January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
    July: 7, August: 8, September: 9, October: 10, November: 11, December: 12,
  }

  timelineEntries.sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year
    const aMonth = a.month ? monthOrder[a.month] || 0 : 0
    const bMonth = b.month ? monthOrder[b.month] || 0 : 0
    return bMonth - aMonth
  })

  return (
    <main>
      <div className="relative z-10">
        <ParticlesComponent className={""} />

        <Hero />
        {/* 3. Pass data down as props */}
        <Timeline initialEntries={timelineEntries} />
      </div>
    </main>
  )
}