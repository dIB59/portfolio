"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    type LeetCodeProblem,
    CONFIDENCE_LABELS,
    CONFIDENCE_DOT_CLASSES,
} from "@/lib/types/leetcode";
import NextImage from "next/image";

interface LeetCodeProblemModalProps {
    problem: LeetCodeProblem | null;
    isOpen: boolean;
    onClose: () => void;
}

const difficultyTone: Record<string, string> = {
    easy: "text-emerald-300/90",
    medium: "text-amber-300/90",
    hard: "text-rose-300/90",
};

const DATE_FMT = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
});

export function LeetCodeProblemModal({
    problem,
    isOpen,
    onClose,
}: LeetCodeProblemModalProps) {
    if (!problem) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] p-0 overflow-hidden">
                <ScrollArea className="max-h-[90vh]">
                    <div className="px-8 md:px-10 py-10 md:py-12">
                        <DialogHeader className="space-y-6">
                            <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-muted-foreground">
                                <span className="inline-block w-6 h-px bg-accent align-middle mr-2" />
                                Entry · {DATE_FMT.format(new Date(problem.solvedDate))}
                            </p>
                            <DialogTitle
                                className="font-display text-foreground leading-[0.95] tracking-[-0.025em] text-balance"
                                style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
                            >
                                {problem.problemNumber !== undefined && (
                                    <span className="text-muted-foreground font-mono text-[0.55em] mr-3 align-baseline tabular-nums">
                                        #{problem.problemNumber}
                                    </span>
                                )}
                                {problem.name}
                            </DialogTitle>

                            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-mono uppercase tracking-[0.18em]">
                                <span className={difficultyTone[problem.difficulty]}>
                                    {problem.difficulty}
                                </span>
                                <span className="text-muted-foreground/60">·</span>
                                <span className="text-muted-foreground">{problem.type}</span>
                                <span className="text-muted-foreground/60">·</span>
                                <span className="inline-flex items-center gap-2 text-muted-foreground">
                                    <span
                                        className={`w-1.5 h-1.5 rounded-full ${CONFIDENCE_DOT_CLASSES[problem.confidence]}`}
                                        aria-hidden="true"
                                    />
                                    {CONFIDENCE_LABELS[problem.confidence]}
                                </span>
                            </div>
                        </DialogHeader>

                        <div className="mt-10 space-y-8">
                            {problem.stuckOn && (
                                <Field label="Got stuck on">
                                    <p className="text-foreground/85 text-pretty leading-relaxed">
                                        {problem.stuckOn}
                                    </p>
                                </Field>
                            )}

                            {problem.hints && problem.hints.length > 0 && (
                                <Field label="Hints">
                                    <ul className="space-y-3">
                                        {problem.hints.map((hint, i) => (
                                            <li
                                                key={i}
                                                className="flex items-baseline gap-4 text-foreground/85 leading-relaxed text-pretty"
                                            >
                                                <span
                                                    className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent/80 w-5 shrink-0 tabular-nums"
                                                    aria-hidden="true"
                                                >
                                                    {String(i + 1).padStart(2, "0")}
                                                </span>
                                                <span>{hint}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Field>
                            )}

                            {problem.notes && (
                                <Field label="Notes">
                                    <pre className="text-foreground/85 whitespace-pre-wrap leading-relaxed font-mono text-sm">
                                        {problem.notes}
                                    </pre>
                                </Field>
                            )}

                            {problem.image && (
                                <Field label="Reference">
                                    <div className="rounded-sm overflow-hidden border border-border/60 bg-muted/40 relative aspect-video">
                                        {/* unoptimized — the user pastes references
                                            from arbitrary hosts; the next/image
                                            allowlist would block most of them. */}
                                        <NextImage
                                            src={problem.image}
                                            alt={`Visual reference for ${problem.name}`}
                                            fill
                                            unoptimized
                                            className="object-contain"
                                            sizes="(max-width: 768px) 100vw, 800px"
                                        />
                                    </div>
                                </Field>
                            )}
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}

function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <section className="space-y-3 pt-6 border-t border-border/40 first:border-t-0 first:pt-0">
            <h3 className="text-[11px] font-mono uppercase tracking-[0.24em] text-muted-foreground">
                {label}
            </h3>
            <div>{children}</div>
        </section>
    );
}
