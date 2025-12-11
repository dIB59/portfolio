"use client";

import { useState, useMemo } from "react";
import { m } from "framer-motion";
import {
    type LeetCodeProblem,
    type Confidence,
    type ProblemType,
    type Difficulty,
    PROBLEM_TYPES,
} from "@/lib/types/leetcode";

import { ChevronDown, ChevronUp, Trash2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import dynamic from "next/dynamic";

// Lazy load modal (only loads when first opened)
const LeetCodeProblemModal = dynamic(
    () => import("./leetcode-problem-modal").then((mod) => ({ default: mod.LeetCodeProblemModal })),
    { ssr: false }
);

interface LeetCodeTableProps {
    problems: LeetCodeProblem[];
    isAdmin: boolean;
    onDelete: (id: string) => void;
}

const confidenceColors: Record<Confidence, string> = {
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
};

const confidenceLabels: Record<Confidence, string> = {
    green: "Confident",
    yellow: "Needs Review",
    red: "Struggled",
};

type SortField = "date" | "name" | "type" | "confidence" | "difficulty";
type SortDirection = "asc" | "desc";

export function LeetCodeTable({
    problems,
    isAdmin,
    onDelete,
}: LeetCodeTableProps) {
    const [sortField, setSortField] = useState<SortField>("date");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
    const [filterType, setFilterType] = useState<ProblemType | "all">("all");
    const [filterConfidence, setFilterConfidence] = useState<
        Confidence | "all"
    >("all");
    const [filterDifficulty, setFilterDifficulty] = useState<
        Difficulty | "all"
    >("all");
    const [selectedProblem, setSelectedProblem] = useState<LeetCodeProblem | null>(
        null,
    );

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this problem?")) {
            onDelete(id);
        }
    };

    const toggleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("desc");
        }
    };

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return null;
        return sortDirection === "asc" ? (
            <ChevronUp className="w-4 h-4 inline ml-1" />
        ) : (
            <ChevronDown className="w-4 h-4 inline ml-1" />
        );
    };

    const filteredAndSortedProblems = useMemo(() => {
        let filtered = [...problems];

        if (filterType !== "all") {
            filtered = filtered.filter((p) => p.type === filterType);
        }

        if (filterConfidence !== "all") {
            filtered = filtered.filter(
                (p) => p.confidence === filterConfidence,
            );
        }

        if (filterDifficulty !== "all") {
            filtered = filtered.filter(
                (p) => p.difficulty === filterDifficulty,
            );
        }

        filtered.sort((a, b) => {
            let comparison = 0;

            switch (sortField) {
                case "date":
                    comparison =
                        new Date(a.solvedDate).getTime() -
                        new Date(b.solvedDate).getTime();
                    break;
                case "name":
                    comparison = a.name.localeCompare(b.name);
                    break;
                case "type":
                    comparison = a.type.localeCompare(b.type);
                    break;
                case "difficulty":
                    comparison = a.difficulty.localeCompare(b.difficulty);
                    break;
                case "confidence":
                    const order = { green: 1, yellow: 2, red: 3 };
                    comparison = order[a.confidence] - order[b.confidence];
                    break;
            }

            return sortDirection === "asc" ? comparison : -comparison;
        });

        return filtered;
    }, [
        problems,
        sortField,
        sortDirection,
        filterType,
        filterConfidence,
        filterDifficulty,
    ]);

    const stats = useMemo(() => {
        return {
            total: problems.length,
            green: problems.filter((p) => p.confidence === "green").length,
            yellow: problems.filter((p) => p.confidence === "yellow").length,
            red: problems.filter((p) => p.confidence === "red").length,
        };
    }, [problems]);

    return (
        <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 border text-center">
                    <div className="text-2xl font-bold text-foreground">
                        {stats.total}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Total Problems
                    </div>
                </div>
                <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 border text-center">
                    <div className="text-2xl font-bold text-green-500">
                        {stats.green}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Confident
                    </div>
                </div>
                <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 border text-center">
                    <div className="text-2xl font-bold text-yellow-500">
                        {stats.yellow}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Needs Review
                    </div>
                </div>
                <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 border text-center">
                    <div className="text-2xl font-bold text-red-500">
                        {stats.red}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Struggled
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6 items-center">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                        Filters:
                    </span>
                </div>
                <Select
                    value={filterType}
                    onValueChange={(v) =>
                        setFilterType(v as ProblemType | "all")
                    }
                >
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Problem Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {PROBLEM_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                                {type}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select
                    value={filterConfidence}
                    onValueChange={(v) =>
                        setFilterConfidence(v as Confidence | "all")
                    }
                >
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Confidence" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Confidence</SelectItem>
                        <SelectItem value="green">Confident</SelectItem>
                        <SelectItem value="yellow">Needs Review</SelectItem>
                        <SelectItem value="red">Struggled</SelectItem>
                    </SelectContent>
                </Select>
                <Select
                    value={filterDifficulty}
                    onValueChange={(v) =>
                        setFilterDifficulty(v as Difficulty | "all")
                    }
                >
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Difficulty</SelectItem>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                </Select>
                {(filterType !== "all" ||
                    filterConfidence !== "all" ||
                    filterDifficulty !== "all") && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setFilterType("all");
                                setFilterConfidence("all");
                                setFilterDifficulty("all");
                            }}
                        >
                            Clear Filters
                        </Button>
                    )}
            </div>

            {/* Table */}
            <div className="bg-card/80 backdrop-blur-sm rounded-xl border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="text-left p-4 font-semibold text-foreground">
                                    <button
                                        onClick={() => toggleSort("name")}
                                        className="hover:text-foreground/80 transition-colors"
                                    >
                                        Problem
                                        <SortIcon field="name" />
                                    </button>
                                </th>
                                <th className="text-left p-4 font-semibold text-foreground">
                                    <button
                                        onClick={() => toggleSort("type")}
                                        className="hover:text-foreground/80 transition-colors"
                                    >
                                        Type
                                        <SortIcon field="type" />
                                    </button>
                                </th>
                                <th className="text-left p-4 font-semibold text-foreground">
                                    <button
                                        onClick={() => toggleSort("difficulty")}
                                        className="hover:text-foreground/80 transition-colors"
                                    >
                                        Difficulty
                                        <SortIcon field="difficulty" />
                                    </button>
                                </th>
                                <th className="text-left p-4 font-semibold text-foreground">
                                    <button
                                        onClick={() => toggleSort("confidence")}
                                        className="hover:text-foreground/80 transition-colors"
                                    >
                                        Confidence
                                        <SortIcon field="confidence" />
                                    </button>
                                </th>
                                <th className="text-left p-4 font-semibold text-foreground">
                                    <button
                                        onClick={() => toggleSort("date")}
                                        className="hover:text-foreground/80 transition-colors"
                                    >
                                        Date
                                        <SortIcon field="date" />
                                    </button>
                                </th>
                                <th className="p-4 w-24"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedProblems.map((problem, index) => (
                                <m.tr
                                    key={problem.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.02 }}
                                    className="border-b last:border-b-0 hover:bg-muted/30 transition-colors"
                                >
                                    <td className="p-4">
                                        <div className="font-medium text-foreground">
                                            {problem.problemNumber && (
                                                <span className="text-muted-foreground font-normal">
                                                    #
                                                    {problem.problemNumber}{" "}
                                                </span>
                                            )}
                                            {problem.name}
                                        </div>
                                        {problem.notes && (
                                            <div className="text-xs text-muted-foreground mt-1 truncate max-w-xs">
                                                {problem.notes}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 text-xs font-medium bg-muted rounded-md text-muted-foreground">
                                            {problem.type}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 text-xs font-medium bg-muted rounded-md text-muted-foreground">
                                            {problem.difficulty
                                                .charAt(0)
                                                .toUpperCase() +
                                                problem.difficulty.slice(1)}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`w-3 h-3 rounded-full ${confidenceColors[problem.confidence]}`}
                                            />
                                            <span className="text-sm text-muted-foreground">
                                                {
                                                    confidenceLabels[
                                                    problem.confidence
                                                    ]
                                                }
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-muted-foreground">
                                        {new Date(
                                            problem.solvedDate,
                                        ).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSelectedProblem(problem)}
                                            >
                                                View
                                            </Button>
                                            {isAdmin && (
                                                <button
                                                    onClick={() =>
                                                        handleDelete(problem.id)
                                                    }
                                                    className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </m.tr>
                            ))}
                            {filteredAndSortedProblems.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={isAdmin ? 6 : 5}
                                        className="p-8 text-center text-muted-foreground"
                                    >
                                        {problems.length === 0
                                            ? "No problems tracked yet."
                                            : "No problems match the current filters."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <LeetCodeProblemModal
                problem={selectedProblem}
                isOpen={!!selectedProblem}
                onClose={() => setSelectedProblem(null)}
            />
        </m.div>
    );
}
