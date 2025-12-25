"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Project, ProjectUpdate } from "@/lib/projects-data";
import {
    addProjectUpdate,
    deleteProjectUpdate,
    getProjectUpdates,
    updateProjectUpdate,
} from "@/lib/supabase/project-updates";
import { getProjects } from "@/lib/supabase/projects";
import { revalidatePortfolio } from "@/app/actions/revalidate";
import { AnimatePresence, m } from "framer-motion";
import {
    ChevronUp,
    Edit2,
    Loader2,
    Plus,
    RefreshCw,
    Trash2,
    X,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export function ProjectUpdatesAdmin() {
    const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        refreshData();
    }, []);

    const refreshData = async () => {
        setIsLoading(true);
        const [updatesData, projectsData] = await Promise.all([
            getProjectUpdates(),
            getProjects(),
        ]);
        setUpdates(updatesData);
        setProjects(projectsData);
        setIsLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this update?")) {
            await deleteProjectUpdate(id);
            await revalidatePortfolio();
            refreshData();
        }
    };

    const handleAdd = async (
        update: Omit<ProjectUpdate, "id" | "projectTitle">,
    ) => {
        await addProjectUpdate(update);
        await revalidatePortfolio();
        refreshData();
        setShowAddForm(false);
    };

    const handleUpdate = async (id: string, data: Partial<ProjectUpdate>) => {
        await updateProjectUpdate(id, data);
        await revalidatePortfolio();
        refreshData();
        setEditingId(null);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div className="text-center py-12">
                <RefreshCw className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">
                    Add some projects first before tracking updates.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
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
                    {showAddForm ? "Hide Form" : "Add Project Update"}
                </Button>
            </div>

            <AnimatePresence>
                {showAddForm && (
                    <m.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <UpdateForm
                            projects={projects}
                            onSubmit={handleAdd}
                            onCancel={() => setShowAddForm(false)}
                        />
                    </m.div>
                )}
            </AnimatePresence>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                    Project Updates ({updates.length})
                </h3>

                {updates.map((update) => (
                    <m.div
                        key={update.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card/80 backdrop-blur-sm rounded-xl border p-4"
                    >
                        {editingId === update.id ? (
                            <UpdateForm
                                projects={projects}
                                initialData={update}
                                onSubmit={(data) =>
                                    handleUpdate(update.id, data)
                                }
                                onCancel={() => setEditingId(null)}
                            />
                        ) : (
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                                            Update
                                        </span>
                                        <h4 className="font-semibold text-foreground">
                                            {update.projectTitle}
                                        </h4>
                                        <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                            {update.month
                                                ? `${update.month} `
                                                : ""}
                                            {update.year}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        {update.description}
                                    </p>
                                    {update.changes.length > 0 && (
                                        <ul className="text-xs text-muted-foreground space-y-1">
                                            {update.changes
                                                .slice(0, 3)
                                                .map((change, i) => (
                                                    <li
                                                        key={i}
                                                        className="flex items-start gap-2"
                                                    >
                                                        <span className="text-primary">
                                                            •
                                                        </span>
                                                        {change}
                                                    </li>
                                                ))}
                                            {update.changes.length > 3 && (
                                                <li className="text-xs">
                                                    +{update.changes.length - 3}{" "}
                                                    more changes
                                                </li>
                                            )}
                                        </ul>
                                    )}
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setEditingId(update.id)}
                                        className="h-8 w-8"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(update.id)}
                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </m.div>
                ))}

                {updates.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                        No project updates yet. Track changes to your projects
                        over time!
                    </p>
                )}
            </div>
        </div>
    );
}

interface UpdateFormProps {
    projects: Project[];
    initialData?: ProjectUpdate;
    onSubmit: (update: Omit<ProjectUpdate, "id" | "projectTitle">) => void;
    onCancel: () => void;
}

function UpdateForm({
    projects,
    initialData,
    onSubmit,
    onCancel,
}: UpdateFormProps) {
    const [projectId, setProjectId] = useState(initialData?.projectId || "");
    const [year, setYear] = useState(
        initialData?.year?.toString() || new Date().getFullYear().toString(),
    );
    const [month, setMonth] = useState(initialData?.month || "");
    const [description, setDescription] = useState(
        initialData?.description || "",
    );
    const [changes, setChanges] = useState(
        initialData?.changes?.join("\n") || "",
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectId || !description.trim()) return;

        setIsSubmitting(true);
        await onSubmit({
            projectId,
            year: Number.parseInt(year),
            month: month || undefined,
            description: description.trim(),
            changes: changes
                .split("\n")
                .map((c) => c.trim())
                .filter(Boolean),
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
                    {initialData ? "Edit Update" : "Add Project Update"}
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
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="project">Select Project *</Label>
                    <Select
                        value={projectId}
                        onValueChange={setProjectId}
                        required
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Choose a project..." />
                        </SelectTrigger>
                        <SelectContent>
                            {projects.map((p) => (
                                <SelectItem key={p.id} value={p.id}>
                                    {p.title} ({p.year})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="year">Update Year *</Label>
                    <Input
                        id="year"
                        type="number"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        placeholder="e.g., 2024"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="month">Month</Label>
                    <Select value={month} onValueChange={setMonth}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {MONTHS.map((m) => (
                                <SelectItem key={m} value={m}>
                                    {m}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Update Description *</Label>
                    <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="e.g., Major refactor and performance improvements"
                        rows={2}
                        required
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="changes">Changes Made (one per line)</Label>
                    <Textarea
                        id="changes"
                        value={changes}
                        onChange={(e) => setChanges(e.target.value)}
                        placeholder="Migrated to Next.js 15&#10;Added dark mode support&#10;Improved load time by 40%"
                        rows={4}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || !projectId}>
                    {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    {initialData ? "Save Changes" : "Add Update"}
                </Button>
            </div>
        </form>
    );
}
