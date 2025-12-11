"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import {
    Plus,
    Trash2,
    Edit2,
    ChevronUp,
    X,
    Upload,
    ImageIcon,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { LeetCodeProblem } from "@/features/leetcode/types";
import { PROBLEM_TYPES } from "@/features/leetcode/types";
import {
    getLeetCodeProblems,
    updateLeetCodeProblem,
    deleteLeetCodeProblem,
    addLeetCodeProblem,
} from "@/features/leetcode/api";

export function LeetCodeAdminPanel() {
    const [problems, setProblems] = useState<LeetCodeProblem[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        refreshProblems();
    }, []);

    const refreshProblems = async () => {
        setIsLoading(true);
        const data = await getLeetCodeProblems();
        setProblems(data);
        setIsLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this problem?")) {
            await deleteLeetCodeProblem(id);
            refreshProblems();
        }
    };

    const handleAdd = async (problem: Omit<LeetCodeProblem, "id">) => {
        await addLeetCodeProblem(problem);
        refreshProblems();
        setShowAddForm(false);
    };

    const handleUpdate = async (
        id: string,
        updates: Partial<LeetCodeProblem>,
    ) => {
        await updateLeetCodeProblem(id, updates);
        refreshProblems();
        setEditingId(null);
    };

    const getConfidenceColor = (conf: string) => {
        switch (conf) {
            case "green":
                return "bg-green-500";
            case "yellow":
                return "bg-yellow-500";
            case "red":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Add problem button */}
            <div className="flex justify-center">
                <Button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="gap-2"
                >
                    {showAddForm ? (
                        <ChevronUp className="w-4 h-4" />
                    ) : (
                        <Plus className="w-4 h-4" />
                    )}
                    {showAddForm ? "Hide Form" : "Add New Problem"}
                </Button>
            </div>

            {/* Add form */}
            <AnimatePresence>
                {showAddForm && (
                    <m.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <ProblemForm
                            onSubmit={handleAdd}
                            onCancel={() => setShowAddForm(false)}
                        />
                    </m.div>
                )}
            </AnimatePresence>

            {/* Problems list */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                    Your Problems ({problems.length})
                </h3>

                <div className="grid gap-3">
                    {problems.map((problem) => (
                        <m.div
                            key={problem.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-card/80 backdrop-blur-sm rounded-xl border p-4"
                        >
                            {editingId === problem.id ? (
                                <ProblemForm
                                    initialData={problem}
                                    onSubmit={(updates) =>
                                        handleUpdate(problem.id, updates)
                                    }
                                    onCancel={() => setEditingId(null)}
                                />
                            ) : (
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div
                                            className={`w-3 h-3 rounded-full shrink-0 ${getConfidenceColor(problem.confidence)}`}
                                        />

                                        {problem.image && (
                                            <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-muted">
                                                <img
                                                    src={
                                                        problem.image ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt={problem.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-medium text-foreground">
                                                    {problem.problemNumber &&
                                                        `#${problem.problemNumber} `}
                                                    {problem.name}
                                                </span>
                                                <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                                                    {problem.type}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(
                                                    problem.solvedDate,
                                                ).toLocaleDateString()}
                                                {problem.stuckOn &&
                                                    ` • Stuck on: ${problem.stuckOn}`}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 shrink-0">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                setEditingId(problem.id)
                                            }
                                            className="h-8 w-8"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                handleDelete(problem.id)
                                            }
                                            className="h-8 w-8 text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </m.div>
                    ))}

                    {problems.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">
                            No problems yet. Add your first problem above!
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

interface ProblemFormProps {
    initialData?: LeetCodeProblem;
    onSubmit: (problem: Omit<LeetCodeProblem, "id">) => void;
    onCancel: () => void;
}

function ProblemForm({ initialData, onSubmit, onCancel }: ProblemFormProps) {
    const [name, setName] = useState(initialData?.name || "");
    const [problemNumber, setProblemNumber] = useState(
        initialData?.problemNumber?.toString() || "",
    );
    const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
        initialData?.difficulty || "medium",
    );
    const [type, setType] = useState(initialData?.type || "Array");
    const [stuckOn, setStuckOn] = useState(initialData?.stuckOn || "");
    const [confidence, setConfidence] = useState<"green" | "yellow" | "red">(
        initialData?.confidence || "green",
    );
    const [solvedDate, setSolvedDate] = useState(
        initialData?.solvedDate || new Date().toISOString().split("T")[0],
    );
    const [notes, setNotes] = useState(initialData?.notes || "");
    const [hints, setHints] = useState<string[]>(initialData?.hints || []);
    const [image, setImage] = useState(initialData?.image || "");
    const [imagePreview, setImagePreview] = useState(initialData?.image || "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImage(result);
                setImagePreview(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);
        await onSubmit({
            name: name.trim(),
            problemNumber: problemNumber
                ? Number.parseInt(problemNumber)
                : undefined,
            difficulty,
            type,
            stuckOn: stuckOn.trim() || undefined,
            confidence,
            solvedDate,
            notes: notes.trim() || undefined,
            hints: hints.filter((h) => h.trim() !== ""),
            image: image || undefined,
        });
        setIsSubmitting(false);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border space-y-4"
        >
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                    {initialData ? "Edit Problem" : "Add New Problem"}
                </h3>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onCancel}
                >
                    <X className="w-4 h-4" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Problem Name *</Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Two Sum"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="problemNumber">Problem Number</Label>
                    <Input
                        id="problemNumber"
                        type="number"
                        value={problemNumber}
                        onChange={(e) => setProblemNumber(e.target.value)}
                        placeholder="e.g., 1"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty *</Label>
                    <Select
                        value={difficulty}
                        onValueChange={(v) =>
                            setDifficulty(v as "easy" | "medium" | "hard")
                        }
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="type">Problem Type *</Label>
                    <Select value={type} onValueChange={setType}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {PROBLEM_TYPES.map((t) => (
                                <SelectItem key={t} value={t}>
                                    {t}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confidence">Confidence Level *</Label>
                    <Select
                        value={confidence}
                        onValueChange={(v) =>
                            setConfidence(v as "green" | "yellow" | "red")
                        }
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="green">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                    Confident
                                </div>
                            </SelectItem>
                            <SelectItem value="yellow">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    Needs Review
                                </div>
                            </SelectItem>
                            <SelectItem value="red">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    Struggled
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="solvedDate">Date Solved *</Label>
                    <Input
                        id="solvedDate"
                        type="date"
                        value={solvedDate}
                        onChange={(e) => setSolvedDate(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="stuckOn">Got Stuck On</Label>
                    <Input
                        id="stuckOn"
                        value={stuckOn}
                        onChange={(e) => setStuckOn(e.target.value)}
                        placeholder="What was tricky?"
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label>Screenshot / Diagram</Label>
                    <div className="flex items-start gap-4">
                        <div
                            className="w-20 h-20 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden bg-muted cursor-pointer hover:border-muted-foreground/50 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {imagePreview ? (
                                <img
                                    src={imagePreview || "/placeholder.svg"}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <ImageIcon className="w-6 h-6 text-muted-foreground/50" />
                            )}
                        </div>
                        <div className="flex-1 space-y-2">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Image
                            </Button>
                            <p className="text-xs text-muted-foreground">
                                Or paste an image URL:
                            </p>
                            <Input
                                value={image.startsWith("data:") ? "" : image}
                                onChange={(e) => {
                                    setImage(e.target.value);
                                    setImagePreview(e.target.value);
                                }}
                                placeholder="https://..."
                                className="text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label>Hints</Label>
                    <div className="space-y-2">
                        {hints.map((hint, index) => (
                            <div key={index} className="flex gap-2">
                                <Input
                                    value={hint}
                                    onChange={(e) => {
                                        const newHints = [...hints];
                                        newHints[index] = e.target.value;
                                        setHints(newHints);
                                    }}
                                    placeholder={`Hint ${index + 1}`}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        const newHints = hints.filter(
                                            (_, i) => i !== index,
                                        );
                                        setHints(newHints);
                                    }}
                                >
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setHints([...hints, ""])}
                            className="w-full"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Hint
                        </Button>
                    </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any additional notes, time complexity, approach used..."
                        rows={2}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    {initialData ? "Save Changes" : "Add Problem"}
                </Button>
            </div>
        </form>
    );
}
