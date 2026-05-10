"use client";

import { useRef, useMemo, memo } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import { TimelineItem } from "./timeline-item";
import { TimelineUpdateItem } from "./timeline-update-item";
import type {
    Project,
    ProjectUpdate,
    TimelineEntry,
} from "@/lib/projects-data";

interface TimelineProps {
    initialEntries: TimelineEntry[];
}

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
    Unknown: 0,
};

export const Timeline = memo(function Timeline({ initialEntries }: TimelineProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: timelineRef,
        offset: ["start 20%", "end 95%"],
    });

    const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

    // Memoize expensive grouping and sorting computation
    const memoizedTimelineData = useMemo(() => {
        const groupedByMonth: Record<string, TimelineEntry[]> = {};

        initialEntries.forEach((entry) => {
            const monthKey = entry.month
                ? `${entry.year}-${entry.month}`
                : `${entry.year}-Unknown`;

            if (!groupedByMonth[monthKey]) {
                groupedByMonth[monthKey] = [];
            }
            groupedByMonth[monthKey].push(entry);
        });

        const sortedKeys = Object.keys(groupedByMonth).sort((a, b) => {
            const [yearA, monthA] = a.split("-");
            const [yearB, monthB] = b.split("-");

            if (parseInt(yearB) !== parseInt(yearA)) {
                return parseInt(yearB) - parseInt(yearA);
            }

            return (monthOrder[monthB] || 0) - (monthOrder[monthA] || 0);
        });

        // Total count of project-type entries; we number them in display order
        // so the newest at the top is the largest (e.g. №07).
        const totalProjects = initialEntries.filter((e) => e.type === "project").length;

        return { groupedByMonth, sortedKeys, totalProjects };
    }, [initialEntries]);

    if (initialEntries.length === 0) {
        return (
            <section className="py-20 px-6 text-center text-muted-foreground">
                No projects yet. Check back later!
            </section>
        );
    }

    let globalIndex = 0;
    let projectCounter = memoizedTimelineData.totalProjects; // newest = highest number

    return (
        <section
            id="timeline"
            className="py-24 md:py-32 px-6 md:px-12 lg:px-20 border-t border-border/60"
            ref={containerRef}
        >
            <m.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="max-w-7xl mx-auto mb-16 md:mb-24 relative z-20 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16"
            >
                <div className="md:col-span-3">
                    <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
                        <span className="inline-block w-6 h-px bg-primary align-middle mr-2" />
                        02 / Journey
                    </p>
                </div>
                <div className="md:col-span-9 space-y-4">
                    <h2
                        className="font-display italic text-foreground leading-[0.95] tracking-[-0.02em]"
                        style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)" }}
                    >
                        Things I&rsquo;ve shipped.
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg max-w-xl">
                        Reverse-chronological. Click any card for the long version.
                    </p>
                </div>
            </m.div>

            <div className="relative max-w-4xl mx-auto" ref={timelineRef}>
                <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-1/2" />

                <m.div
                    className="absolute left-[19px] md:left-1/2 top-0 w-0.5 bg-primary md:-translate-x-1/2 origin-top"
                    style={{ scaleY, height: "100%" }}
                />

                <div className="absolute left-[19px] md:left-1/2 top-0 w-3 h-3 rounded-full bg-primary md:-translate-x-1/2 -translate-y-1/2 z-10" />

                {memoizedTimelineData.sortedKeys.map((monthKey, monthIdx) => {
                    const [year, month] = monthKey.split("-");
                    const monthName = month !== "Unknown"
                        ? `${month} ${year}`
                        : year;

                    return (
                        <div key={monthKey} className="mb-12">
                            {/* Entries for this month */}
                            <div className="space-y-8">
                                {memoizedTimelineData.groupedByMonth[monthKey].map((entry) => {
                                    const currentIndex = globalIndex++;
                                    const isLeft = currentIndex % 2 === 0;
                                    const projectNumber =
                                        entry.type === "project"
                                            ? projectCounter--
                                            : undefined;

                                    return entry.type === "project" ? (
                                        <TimelineItem
                                            key={`project-${entry.id}`}
                                            project={entry.data as Project}
                                            index={currentIndex}
                                            isLeft={isLeft}
                                            projectNumber={projectNumber}
                                        />
                                    ) : (
                                        <TimelineUpdateItem
                                            key={`update-${entry.id}`}
                                            update={entry.data as ProjectUpdate}
                                            index={currentIndex}
                                            isLeft={isLeft}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

                <div className="absolute left-[19px] md:left-1/2 bottom-0 w-3 h-3 rounded-full bg-border md:-translate-x-1/2 translate-y-1/2" />
            </div>
        </section>
    );
});
