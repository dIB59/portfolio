import { Hero } from "@/components/hero";
import { getProjects } from "@/lib/supabase/projects";

import { getProjectUpdates } from "@/lib/supabase/project-updates";
import type { TimelineEntry } from "@/lib/projects-data";
import { Timeline } from "@/components/timeline/timeline";
import { TimelineSkeleton } from "@/components/timeline/timeline-skeleton";
import { Analytics } from "@vercel/analytics/next";
import nextDynamic from "next/dynamic";
import { Suspense } from "react";
import { ContactForm } from "@/components/contact/contact-form";

// Lazy load particles (client-side component)
const ParticlesComponent = nextDynamic(() => import("@/components/three-background"), {
    loading: () => null,
});

// Separate async component for data fetching
// This allows streaming - Hero renders immediately, Timeline streams in
async function TimelineData() {
    // Fetch data on the server (in parallel)
    const [projects, updates] = await Promise.all([
        getProjects(),
        getProjectUpdates(),
    ]);

    // Prepare the data
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
    ];

    const monthOrder: Record<string, number> = {
        January: 1,
        February: 2,
        March: 3,
        April: 4,
        May: 5,
        June: 6,
        July: 7,
        August: 8,
        September: 9,
        October: 10,
        November: 11,
        December: 12,
    };

    timelineEntries.sort((a, b) => {
        if (b.year !== a.year) return b.year - a.year;
        const aMonth = a.month ? monthOrder[a.month] || 0 : 0;
        const bMonth = b.month ? monthOrder[b.month] || 0 : 0;
        return bMonth - aMonth;
    });

    return <Timeline initialEntries={timelineEntries} />;
}

// Main page component - renders immediately
export default function PortfolioPage() {
    return (
        <main>
            <div className="relative z-10">
                <ParticlesComponent className={""} />

                {/* Hero renders instantly - no data dependencies */}
                <Hero />

                {/* Timeline streams in when data is ready */}
                <Suspense fallback={<TimelineSkeleton />}>
                    <TimelineData />
                </Suspense>

                <ContactForm />
            </div>
            <Analytics />
        </main>
    );
}
