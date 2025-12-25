"use client";

import * as React from "react";
import { m } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * TimelineItemContainer - Orchestrates the responsive layout and animations
 */
export function TimelineItemContainer({
    children,
    index,
    isLeft,
    className
}: {
    children: React.ReactNode;
    index: number;
    isLeft: boolean;
    className?: string;
}) {
    return (
        <m.div
            initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            viewport={{ once: true, margin: "-50px", amount: 0.2 }}
            className={cn(
                "relative flex items-start gap-8 flex-row",
                isLeft ? "md:flex-row" : "md:flex-row-reverse",
                className
            )}
        >
            {children}
        </m.div>
    );
}

/**
 * TimelineMarker - The visual indicator on the timeline track
 */
export function TimelineMarker({ index }: { index: number }) {
    return (
        <m.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 + 0.2 }}
            viewport={{ once: true }}
            className="absolute left-[19px] md:left-1/2 top-6 w-3 h-3 rounded-full bg-primary/50 border-2 border-primary z-10 -translate-x-1/2"
        />
    );
}

/**
 * TimelineLabel - The date/month indicator (hidden on mobile, visible on desktop)
 */
export function TimelineLabel({
    children,
    index,
    isLeft
}: {
    children: React.ReactNode;
    index: number;
    isLeft: boolean;
}) {
    return (
        <div
            className={cn(
                "hidden md:block w-1/2",
                isLeft ? "text-right pr-12" : "text-left pl-12"
            )}
        >
            <m.span
                initial={{ opacity: 0, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.4, delay: index * 0.05 + 0.3 }}
                viewport={{ once: true }}
                className="text-4xl font-bold text-foreground"
            >
                {children}
            </m.span>
        </div>
    );
}

/**
 * TimelineContent - Wrapper for the card content
 */
export function TimelineContent({
    children,
    isLeft
}: {
    children: React.ReactNode;
    isLeft: boolean;
}) {
    return (
        <div
            className={cn(
                "ml-10 md:ml-0 md:w-1/2",
                isLeft ? "md:pl-12" : "md:pr-12"
            )}
        >
            {children}
        </div>
    );
}
