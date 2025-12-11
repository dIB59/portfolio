"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { LeetCodeProblem } from "@/lib/types/leetcode";

interface LeetCodeProblemModalProps {
    problem: LeetCodeProblem | null;
    isOpen: boolean;
    onClose: () => void;
}

export function LeetCodeProblemModal({
    problem,
    isOpen,
    onClose,
}: LeetCodeProblemModalProps) {
    if (!problem) return null;

    const confidenceColors = {
        green: "bg-green-500",
        yellow: "bg-yellow-500",
        red: "bg-red-500",
    };

    const confidenceBorders = {
        green: "border-green-500/30",
        yellow: "border-yellow-500/30",
        red: "border-red-500/30",
    };

    const difficultyBorders = {
        easy: "border-green-500/30",
        medium: "border-yellow-500/30",
        hard: "border-red-500/30",
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-foreground">
                        {problem.problemNumber && (
                            <span className="text-muted-foreground font-normal">
                                #{problem.problemNumber}{" "}
                            </span>
                        )}
                        {problem.name}
                    </DialogTitle>
                    <div className="flex flex-wrap gap-2 mt-3">
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
                            {new Date(problem.solvedDate).toLocaleDateString()}
                        </span>
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-muted rounded-md">
                            <div
                                className={`w-2 h-2 rounded-full ${confidenceColors[problem.confidence]}`}
                            />
                            <span className="text-xs font-medium text-muted-foreground">
                                {problem.confidence === "green"
                                    ? "Confident"
                                    : problem.confidence === "yellow"
                                        ? "Needs Review"
                                        : "Struggled"}
                            </span>
                        </div>
                    </div>
                </DialogHeader>

                <ScrollArea className="flex-1 -mr-6 pr-6">
                    <div className="space-y-4 py-4">
                        {/* Stuck On Section */}
                        {problem.stuckOn && (
                            <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border-2 border-red-500/30 shadow-lg">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                    Got stuck on:
                                </span>
                                <p className="text-sm text-foreground/80 mt-2 leading-relaxed">
                                    {problem.stuckOn}
                                </p>
                            </div>
                        )}

                        {/* Hints Section */}
                        {problem.hints && problem.hints.length > 0 && (
                            <div className="space-y-3">
                                <p className="font-medium text-sm text-foreground">Hints:</p>
                                <div className="grid gap-2">
                                    {problem.hints.map((hint, i) => (
                                        <div
                                            key={i}
                                            className="p-3 bg-muted/50 rounded-lg text-sm text-foreground border border-border/50"
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

                        {/* Notes Section */}
                        {problem.notes && (
                            <div className="bg-muted/50 rounded-lg p-4">
                                <p className="font-medium text-foreground mb-2 text-sm">
                                    Notes:
                                </p>
                                <pre className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed font-mono">
                                    {problem.notes}
                                </pre>
                            </div>
                        )}

                        {/* Image Section */}
                        {problem.image && (
                            <div className="space-y-2">
                                <p className="font-medium text-sm text-foreground">
                                    Screenshot / Diagram:
                                </p>
                                <div className="rounded-lg overflow-hidden border bg-muted">
                                    <img
                                        src={problem.image}
                                        alt={`Visual reference for ${problem.name}`}
                                        className="w-full h-auto object-contain max-h-[500px]"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
