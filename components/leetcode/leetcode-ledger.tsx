"use client";

import { useMemo, useState } from "react";
import { m } from "framer-motion";
import dynamic from "next/dynamic";
import {
    type LeetCodeProblem,
    type Confidence,
    type ProblemType,
    type Difficulty,
    PROBLEM_TYPES,
} from "@/lib/types/leetcode";
import { LeetCodeItem } from "./leetcode-item";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const LeetCodeProblemModal = dynamic(
    () =>
        import("./leetcode-problem-modal").then((mod) => ({
            default: mod.LeetCodeProblemModal,
        })),
    { ssr: false },
);

interface LeetCodeLedgerProps {
    problems: LeetCodeProblem[];
    isAdmin?: boolean;
    onDelete?: (id: string) => void;
}

const MONTH_FMT = new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
});

export function LeetCodeLedger({
    problems,
    isAdmin = false,
    onDelete,
}: LeetCodeLedgerProps) {
    const [filterType, setFilterType] = useState<ProblemType | "all">("all");
    const [filterConfidence, setFilterConfidence] = useState<Confidence | "all">("all");
    const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | "all">("all");
    const [selected, setSelected] = useState<LeetCodeProblem | null>(null);

    const stats = useMemo(
        () => ({
            total: problems.length,
            green: problems.filter((p) => p.confidence === "green").length,
            yellow: problems.filter((p) => p.confidence === "yellow").length,
            red: problems.filter((p) => p.confidence === "red").length,
        }),
        [problems],
    );

    const hasActiveFilter =
        filterType !== "all" || filterConfidence !== "all" || filterDifficulty !== "all";

    const filteredAndGrouped = useMemo(() => {
        const filtered = problems
            .filter((p) => filterType === "all" || p.type === filterType)
            .filter((p) => filterConfidence === "all" || p.confidence === filterConfidence)
            .filter((p) => filterDifficulty === "all" || p.difficulty === filterDifficulty)
            .slice()
            .sort(
                (a, b) =>
                    new Date(b.solvedDate).getTime() - new Date(a.solvedDate).getTime(),
            );

        const groups: { key: string; label: string; items: LeetCodeProblem[] }[] = [];
        let last = "";
        for (const p of filtered) {
            const d = new Date(p.solvedDate);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
            if (key !== last) {
                groups.push({ key, label: MONTH_FMT.format(d), items: [] });
                last = key;
            }
            groups[groups.length - 1].items.push(p);
        }
        return { filtered, groups };
    }, [problems, filterType, filterConfidence, filterDifficulty]);

    const clearFilters = () => {
        setFilterType("all");
        setFilterConfidence("all");
        setFilterDifficulty("all");
    };

    let runningIndex = 0;

    return (
        <div className="space-y-16">
            {/* Stats strip — typographic, no card boxes. */}
            <m.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="border-y border-border/60"
            >
                <dl className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border/60">
                    <StatCell label="Solved" value={stats.total} />
                    <StatCell label="Confident" value={stats.green} dot="bg-emerald-500" />
                    <StatCell label="Needs review" value={stats.yellow} dot="bg-amber-500" />
                    <StatCell label="Struggled" value={stats.red} dot="bg-rose-500" />
                </dl>
            </m.section>

            {/* Filters — minimal, line up with the ledger below. */}
            <section
                aria-label="Filters"
                className="flex flex-wrap items-center gap-3"
            >
                <span className="text-[11px] font-mono uppercase tracking-[0.24em] text-muted-foreground mr-2">
                    Filter
                </span>

                <Select
                    value={filterType}
                    onValueChange={(v) => setFilterType(v as ProblemType | "all")}
                >
                    <SelectTrigger
                        className="h-9 w-44 border-border/60 bg-transparent text-sm"
                        aria-label="Filter by problem type"
                    >
                        <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All types</SelectItem>
                        {PROBLEM_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                                {t}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={filterDifficulty}
                    onValueChange={(v) => setFilterDifficulty(v as Difficulty | "all")}
                >
                    <SelectTrigger
                        className="h-9 w-40 border-border/60 bg-transparent text-sm"
                        aria-label="Filter by difficulty"
                    >
                        <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All difficulty</SelectItem>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    value={filterConfidence}
                    onValueChange={(v) => setFilterConfidence(v as Confidence | "all")}
                >
                    <SelectTrigger
                        className="h-9 w-44 border-border/60 bg-transparent text-sm"
                        aria-label="Filter by confidence"
                    >
                        <SelectValue placeholder="Confidence" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All confidence</SelectItem>
                        <SelectItem value="green">Confident</SelectItem>
                        <SelectItem value="yellow">Needs review</SelectItem>
                        <SelectItem value="red">Struggled</SelectItem>
                    </SelectContent>
                </Select>

                {hasActiveFilter && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-9 text-muted-foreground hover:text-foreground"
                    >
                        Clear
                    </Button>
                )}
            </section>

            {/* Ledger */}
            <section aria-label="Problems" className="space-y-12">
                {filteredAndGrouped.groups.length === 0 ? (
                    <div className="py-20 text-center">
                        <p className="text-muted-foreground">
                            {problems.length === 0
                                ? "No problems logged yet."
                                : "Nothing matches that filter."}
                        </p>
                    </div>
                ) : (
                    filteredAndGrouped.groups.map((group) => (
                        <div key={group.key}>
                            <header className="flex items-baseline gap-4 mb-3 md:mb-4">
                                <span
                                    className="inline-block w-8 h-px bg-accent/60 align-middle"
                                    aria-hidden="true"
                                />
                                <h2 className="text-[11px] font-mono uppercase tracking-[0.28em] text-muted-foreground tabular-nums">
                                    {group.label}
                                </h2>
                                <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground/60 ml-auto tabular-nums">
                                    {group.items.length}
                                </span>
                            </header>

                            <div className="border-t border-border/60">
                                {group.items.map((problem) => {
                                    runningIndex += 1;
                                    return (
                                        <LeetCodeItem
                                            key={problem.id}
                                            problem={problem}
                                            rowNumber={runningIndex}
                                            isAdmin={isAdmin}
                                            onClick={() => setSelected(problem)}
                                            onDelete={
                                                onDelete && isAdmin
                                                    ? () => onDelete(problem.id)
                                                    : undefined
                                            }
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    ))
                )}
            </section>

            <LeetCodeProblemModal
                problem={selected}
                isOpen={!!selected}
                onClose={() => setSelected(null)}
            />
        </div>
    );
}

function StatCell({
    label,
    value,
    dot,
}: {
    label: string;
    value: number;
    dot?: string;
}) {
    return (
        <div className="px-5 md:px-8 py-7 md:py-9 flex flex-col gap-3">
            <div className="flex items-baseline gap-3">
                <span
                    className="font-display text-foreground tabular-nums leading-none tracking-[-0.04em]"
                    style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
                >
                    {value}
                </span>
                {dot && (
                    <span
                        className={`w-2 h-2 rounded-full ${dot} translate-y-[-0.1em]`}
                        aria-hidden="true"
                    />
                )}
            </div>
            <dt className="text-[11px] font-mono uppercase tracking-[0.24em] text-muted-foreground">
                {label}
            </dt>
        </div>
    );
}
