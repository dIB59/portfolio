"use client";

import { useRef } from "react";
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

export function Timeline({ initialEntries }: TimelineProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: timelineRef,
        offset: ["start 20%", "end 95%"],
    });

    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    if (initialEntries.length === 0) {
        return (
            <section className="py-20 px-6 text-center text-muted-foreground">
                No projects yet. Check back later!
            </section>
        );
    }

    // Group entries by year and month
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

    // Sort month keys in reverse chronological order
    const sortedMonths = Object.keys(groupedByMonth).sort((a, b) => {
        const [yearA, monthA] = a.split("-");
        const [yearB, monthB] = b.split("-");

        // Compare years first
        if (parseInt(yearB) !== parseInt(yearA)) {
            return parseInt(yearB) - parseInt(yearA);
        }

        // If years are equal, compare months
        const monthOrder: Record<string, number> = {
            January: 1, February: 2, March: 3, April: 4,
            May: 5, June: 6, July: 7, August: 8,
            September: 9, October: 10, November: 11, December: 12,
            Unknown: 0
        };

        return (monthOrder[monthB] || 0) - (monthOrder[monthA] || 0);
    });

    let globalIndex = 0;

    return (
        <section id="timeline" className="py-20 px-6" ref={containerRef}>
            <m.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-20 relative z-20"
            >
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                    Career Journey
                </h2>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                    A timeline of my professional milestones and key projects
                </p>
            </m.div>

            <div className="relative max-w-4xl mx-auto" ref={timelineRef}>
                <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-1/2" />

                <m.div
                    className="absolute left-[19px] md:left-1/2 top-0 w-0.5 bg-foreground md:-translate-x-1/2"
                    style={{ height: lineHeight }}
                />

                <div className="absolute left-[19px] md:left-1/2 top-0 w-3 h-3 rounded-full bg-foreground md:-translate-x-1/2 -translate-y-1/2 z-10" />

                {sortedMonths.map((monthKey, monthIdx) => {
                    const [year, month] = monthKey.split("-");
                    const monthName = month !== "Unknown"
                        ? `${month} ${year}`
                        : year;

                    return (
                        <div key={monthKey} className="mb-12">
                            {/* Entries for this month */}
                            <div className="space-y-8">
                                {groupedByMonth[monthKey].map((entry) => {
                                    const currentIndex = globalIndex++;
                                    const isLeft = currentIndex % 2 === 0;

                                    return entry.type === "project" ? (
                                        <TimelineItem
                                            key={`project-${entry.id}`}
                                            project={entry.data as Project}
                                            index={currentIndex}
                                            isLeft={isLeft}
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
}

