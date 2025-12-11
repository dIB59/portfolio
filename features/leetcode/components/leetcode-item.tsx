"use client";

import { m } from "framer-motion";
import type { LeetCodeProblem, Confidence } from "@/features/leetcode/types";
import { Trash2 } from "lucide-react";

interface LeetCodeItemProps {
    problem: LeetCodeProblem;
    index: number;
    isAdmin: boolean;
    onDelete: () => void;
}

const confidenceColors: Record<Confidence, string> = {
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
};

const confidenceBorders: Record<Confidence, string> = {
    green: "border-green-500/30",
    yellow: "border-yellow-500/30",
    red: "border-red-500/30",
};

const difficultyBorders: Record<string, string> = {
    easy: "border-green-500/30",
    medium: "border-yellow-500/30",
    hard: "border-red-500/30",
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
                }`}
        >
            <div
                className={`absolute left-[19px] md:left-1/2 top-6 w-3 h-3 rounded-full ${confidenceColors[problem.confidence]} border-2 border-background shadow-lg z-10 -translate-x-1/2`}
            />

            <m.div
                whileHover={{ scale: 1.02, y: -2 }}
                className={`flex-1 bg-card/80 backdrop-blur-sm rounded-xl p-5 border-2 ${confidenceBorders[problem.confidence]} shadow-lg relative group`}
            >
                {isAdmin && (
                    <button
                        onClick={onDelete}
                        className="absolute top-3 right-3 p-1.5 rounded-lg bg-destructive/10 text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}

                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-foreground text-lg">
                                {problem.problemNumber && (
                                    <span className="text-muted-foreground font-normal">
                                        #{problem.problemNumber}{" "}
                                    </span>
                                )}
                                {problem.name}
                            </h3>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                            <span
                                className={`px-2 py-1 text-xs font-medium rounded-md text-muted-foreground border ${difficultyBorders[problem.difficulty]}`}
                            >
                                {problem.difficulty.charAt(0).toUpperCase() +
                                    problem.difficulty.slice(1)}
                            </span>
                            <span className="px-2 py-1 text-xs font-medium bg-muted rounded-md text-muted-foreground">
                                {problem.type}
                            </span>
                            <span className="px-2 py-1 text-xs font-medium bg-muted rounded-md text-muted-foreground">
                                {new Date(
                                    problem.solvedDate,
                                ).toLocaleDateString()}
                            </span>
                        </div>

                        {problem.stuckOn && (
                            <div className="mb-3">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                    Got stuck on:
                                </span>
                                <p className="text-sm text-foreground/80 mt-1">
                                    {problem.stuckOn}
                                </p>
                            </div>
                        )}

                        {problem.notes && (
                            <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                                <p className="font-medium text-foreground mb-1">Notes:</p>
                                {problem.notes}
                            </div>
                        )}

                        {problem.hints && problem.hints.length > 0 && (
                            <div className="mt-4 space-y-2">
                                <p className="font-medium text-sm text-foreground">Hints:</p>
                                <div className="grid gap-2">
                                    {problem.hints.map((hint, i) => (
                                        <div
                                            key={i}
                                            className="p-3 bg-muted/30 rounded-lg text-sm text-muted-foreground border border-border/50"
                                        >
                                            <span className="font-medium text-foreground mr-2">
                                                {i + 1}.
                                            </span>
                                            {hint}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </m.div>
        </m.div>
    );
}
