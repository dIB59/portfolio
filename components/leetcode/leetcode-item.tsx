"use client";

import {
    type LeetCodeProblem,
    CONFIDENCE_LABELS,
    CONFIDENCE_DOT_CLASSES,
} from "@/lib/types/leetcode";
import { Trash2 } from "lucide-react";

interface LeetCodeItemProps {
    problem: LeetCodeProblem;
    /** 1-based index used as the leading numeral. */
    rowNumber: number;
    isAdmin?: boolean;
    onDelete?: () => void;
    onClick?: () => void;
}

const difficultyTone: Record<string, string> = {
    easy: "text-emerald-300/90",
    medium: "text-amber-300/90",
    hard: "text-rose-300/90",
};

const dateFmt = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
});

export function LeetCodeItem({
    problem,
    rowNumber,
    isAdmin = false,
    onDelete,
    onClick,
}: LeetCodeItemProps) {
    const date = dateFmt.format(new Date(problem.solvedDate));

    return (
        <button
            type="button"
            onClick={onClick}
            className="group relative w-full text-left grid grid-cols-[2.25rem_1fr_auto] md:grid-cols-[2.5rem_minmax(0,1fr)_8rem_6rem_8rem_4rem] gap-4 md:gap-6 items-baseline py-4 md:py-5 border-b border-border/40 hover:bg-foreground/[0.025] focus-visible:bg-foreground/[0.04] transition-colors cursor-pointer"
        >
            {/* Row index */}
            <span
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent/80 tabular-nums pt-0.5"
                aria-hidden="true"
            >
                {String(rowNumber).padStart(2, "0")}
            </span>

            {/* Problem name */}
            <span className="font-display text-foreground text-lg md:text-xl leading-snug truncate">
                {problem.problemNumber !== undefined && (
                    <span className="font-mono text-sm text-muted-foreground/80 mr-2 tabular-nums">
                        #{problem.problemNumber}
                    </span>
                )}
                {problem.name}
            </span>

            {/* Type — hidden on mobile, shown in the second row below if needed */}
            <span className="hidden md:inline text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground truncate">
                {problem.type}
            </span>

            {/* Difficulty */}
            <span
                className={`hidden md:inline text-[11px] font-mono uppercase tracking-[0.18em] ${difficultyTone[problem.difficulty]}`}
            >
                {problem.difficulty}
            </span>

            {/* Confidence */}
            <span className="hidden md:inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
                <span
                    className={`w-1.5 h-1.5 rounded-full ${CONFIDENCE_DOT_CLASSES[problem.confidence]}`}
                    aria-hidden="true"
                />
                {CONFIDENCE_LABELS[problem.confidence]}
            </span>

            {/* Date */}
            <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground/80 tabular-nums text-right whitespace-nowrap">
                {date}
            </span>

            {/* Mobile-only second line: type / difficulty / confidence */}
            <span className="md:hidden col-start-2 col-span-2 flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground -mt-2">
                <span className={difficultyTone[problem.difficulty]}>
                    {problem.difficulty}
                </span>
                <span className="text-muted-foreground/60">·</span>
                <span className="truncate">{problem.type}</span>
                <span className="text-muted-foreground/60">·</span>
                <span className="inline-flex items-center gap-1.5">
                    <span
                        className={`w-1.5 h-1.5 rounded-full ${CONFIDENCE_DOT_CLASSES[problem.confidence]}`}
                        aria-hidden="true"
                    />
                    {CONFIDENCE_LABELS[problem.confidence]}
                </span>
            </span>

            {isAdmin && onDelete && (
                <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            e.stopPropagation();
                            onDelete();
                        }
                    }}
                    aria-label={`Delete ${problem.name}`}
                    className="absolute top-3 right-3 p-1.5 rounded-md text-destructive/80 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 transition-opacity cursor-pointer"
                >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
            )}
        </button>
    );
}
