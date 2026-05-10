import { Hero } from "@/components/hero";
import { AboutManifesto } from "@/components/about-manifesto";
import { getProjects } from "@/lib/supabase/projects";
import { getProjectUpdates } from "@/lib/supabase/project-updates";
import type { TimelineEntry } from "@/lib/projects-data";
import { Timeline } from "@/components/timeline/timeline";
import { TimelineSkeleton } from "@/components/timeline/timeline-skeleton";
import { Analytics } from "@vercel/analytics/next";
import nextDynamic from "next/dynamic";
import { Suspense } from "react";
import { ContactForm } from "@/components/contact/contact-form";
import { SiteFooter } from "@/components/site-footer";

// Lazy-load particles client-side; sits behind everything via fixed inset-0 z-0.
const ParticlesComponent = nextDynamic(
    () => import("@/components/three-background"),
    { loading: () => null },
);

// Render per-request — the timeline pulls live data from Postgres, which
// isn't reachable at build time.
export const dynamic = "force-dynamic";

async function TimelineData() {
    const [projects, updates] = await Promise.all([
        getProjects(),
        getProjectUpdates(),
    ]);

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
        January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
        July: 7, August: 8, September: 9, October: 10, November: 11, December: 12,
    };

    timelineEntries.sort((a, b) => {
        if (b.year !== a.year) return b.year - a.year;
        const aMonth = a.month ? monthOrder[a.month] || 0 : 0;
        const bMonth = b.month ? monthOrder[b.month] || 0 : 0;
        return bMonth - aMonth;
    });

    return <Timeline initialEntries={timelineEntries} />;
}

export default function PortfolioPage() {
    return (
        <>
            <ParticlesComponent className="" />
            <main className="relative z-10">
                <Hero />

                <AboutManifesto />

                <Suspense fallback={<TimelineSkeleton />}>
                    <TimelineData />
                </Suspense>

                <ContactForm />
            </main>
            <SiteFooter />
            <Analytics />
        </>
    );
}
