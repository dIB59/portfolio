"use client";

import { m } from "framer-motion";
import {
    type LeetCodeProblem,
    CONFIDENCE_LABELS,
    CONFIDENCE_DOT_CLASSES,
    CONFIDENCE_BORDER_CLASSES,
} from "@/lib/types/leetcode";
import { Check, Trash2 } from "lucide-react";

interface LeetCodeItemProps {
    problem: LeetCodeProblem;
    index: number;
    isAdmin: boolean;
    onDelete: () => void;
}

const difficultyBorders: Record<string, string> = {
    easy: "border-emerald-500/40",
    medium: "border-amber-500/40",
    hard: "border-rose-500/40",
};

export function LeetCodeItem({
    problem,
    index,
    isAdmin,
    onDelete,
}: LeetCodeItemProps) {
    const isLeft = index % 2 === 0;

    return (
        <m.div
            initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true, margin: "-50px" }}
            className={`relative flex items-start gap-4 mb-8 ${isLeft
                ? "flex-row pl-10 md:pl-0 md:flex-row md:pr-[calc(50%+24px)]"
                : "flex-row pl-10 md:pl-0 md:flex-row-reverse md:pl-[calc(50%+24px)] md:pr-0"
                } `}
        >
            <div
                className={`absolute left-[19px] md:left-1/2 top-6 w-3 h-3 rounded-full ${CONFIDENCE_DOT_CLASSES[problem.confidence]} border-2 border-background shadow-lg z-10 -translate-x-1/2`}
            />

            <m.div
                whileHover={{ y: -2 }}
                className={`flex-1 bg-card rounded-xl p-5 border ${CONFIDENCE_BORDER_CLASSES[problem.confidence]} shadow-sm hover:shadow-md transition-shadow relative group`}
            >
                {isAdmin && (
                    <button
                        onClick={onDelete}
                        aria-label={`Delete problem: ${problem.name}`}
                        className="absolute top-3 right-3 p-1.5 rounded-lg bg-destructive/10 text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20"
                    >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                )}

                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-display italic text-foreground text-xl leading-tight">
                                {problem.problemNumber && (
                                    <span className="text-muted-foreground font-mono not-italic mr-1">
                                        #{problem.problemNumber}
                                    </span>
                                )}
                                {problem.name}
                            </h3>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-3">
                            <span
                                className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-md text-muted-foreground border ${difficultyBorders[problem.difficulty]}`}
                            >
                                {problem.difficulty}
                            </span>
                            <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-md text-muted-foreground border border-border bg-card">
                                {problem.type}
                            </span>
                            <span
                                className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-md text-muted-foreground border ${CONFIDENCE_BORDER_CLASSES[problem.confidence]}`}
                            >
                                <span
                                    className={`w-1.5 h-1.5 rounded-full ${CONFIDENCE_DOT_CLASSES[problem.confidence]}`}
                                    aria-hidden="true"
                                />
                                {CONFIDENCE_LABELS[problem.confidence]}
                            </span>
                            <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-md text-muted-foreground tabular-nums">
                                {new Date(problem.solvedDate).toLocaleDateString()}
                            </span>
                        </div>

                        {problem.stuckOn && (
                            <div className="mb-3">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Got stuck on
                                </span>
                                <p className="text-sm text-foreground/90 mt-1">
                                    {problem.stuckOn}
                                </p>
                            </div>
                        )}

                        {problem.notes && (
                            <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                                <p className="font-medium text-foreground mb-1">Notes</p>
                                {problem.notes}
                            </div>
                        )}

                        {problem.hints && problem.hints.length > 0 && (
                            <div className="mt-4 space-y-2">
                                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Hints
                                </p>
                                <ul className="space-y-1.5">
                                    {problem.hints.map((hint, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-2 text-sm text-foreground/90"
                                        >
                                            <Check
                                                className="w-4 h-4 text-primary mt-0.5 shrink-0"
                                                aria-hidden="true"
                                            />
                                            <span>{hint}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </m.div>
        </m.div>
    );
}
