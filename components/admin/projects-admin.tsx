"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import {
    Plus,
    Trash2,
    Edit2,
    X,
    ChevronUp,
    Upload,
    ImageIcon,
    Loader2,
} from "lucide-react";
import Image from "next/image";
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
import type { Project } from "@/lib/projects-data";
import {
    getProjects,
    addProject,
    updateProject,
    deleteProject,
} from "@/lib/supabase/projects";

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

export function ProjectsAdmin() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        refreshProjects();
    }, []);

    const refreshProjects = async () => {
        setIsLoading(true);
        const data = await getProjects();
        setProjects(data);
        setIsLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this project?")) {
            await deleteProject(id);
            refreshProjects();
        }
    };

    const handleAdd = async (project: Omit<Project, "id">) => {
        await addProject(project);
        refreshProjects();
        setShowAddForm(false);
    };

    const handleUpdate = async (id: string, updates: Partial<Project>) => {
        await updateProject(id, updates);
        refreshProjects();
        setEditingId(null);
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
            {/* Add new project button */}
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
                    {showAddForm ? "Hide Form" : "Add New Project"}
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
                        <ProjectForm
                            onSubmit={handleAdd}
                            onCancel={() => setShowAddForm(false)}
                        />
                    </m.div>
                )}
            </AnimatePresence>

            {/* Projects list */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                    Your Projects ({projects.length})
                </h3>

                {projects.map((project) => (
                    <m.div
                        key={project.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card/80 backdrop-blur-sm rounded-xl border p-4"
                    >
                        {editingId === project.id ? (
                            <ProjectForm
                                initialData={project}
                                onSubmit={(updates) =>
                                    handleUpdate(project.id, updates)
                                }
                                onCancel={() => setEditingId(null)}
                            />
                        ) : (
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex gap-4 flex-1 min-w-0">
                                    {project.image && (
                                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-muted relative">
                                            <Image
                                                src={
                                                    project.image ||
                                                    "/placeholder.svg"
                                                }
                                                alt={project.title}
                                                fill
                                                className="object-cover"
                                                sizes="64px"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="font-semibold text-foreground truncate">
                                                {project.title}
                                            </h4>
                                            <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                                {project.month
                                                    ? `${project.month} `
                                                    : ""}
                                                {project.year}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {project.description}
                                        </p>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {project.techStack
                                                .slice(0, 4)
                                                .map((tech) => (
                                                    <span
                                                        key={tech}
                                                        className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            {project.techStack.length > 4 && (
                                                <span className="text-xs text-muted-foreground">
                                                    +
                                                    {project.techStack.length -
                                                        4}{" "}
                                                    more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setEditingId(project.id)}
                                        className="h-8 w-8"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(project.id)}
                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </m.div>
                ))}

                {projects.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                        No projects yet. Add your first project above!
                    </p>
                )}
            </div>
        </div>
    );
}

interface ProjectFormProps {
    initialData?: Project;
    onSubmit: (project: Omit<Project, "id">) => void;
    onCancel: () => void;
}

function ProjectForm({ initialData, onSubmit, onCancel }: ProjectFormProps) {
    const [title, setTitle] = useState(initialData?.title || "");
    const [year, setYear] = useState(
        initialData?.year?.toString() || new Date().getFullYear().toString(),
    );
    const [month, setMonth] = useState(initialData?.month || "");
    const [description, setDescription] = useState(
        initialData?.description || "",
    );
    const [techStack, setTechStack] = useState(
        initialData?.techStack.join(", ") || "",
    );
    const [achievements, setAchievements] = useState(
        initialData?.achievements?.join("\n") || "",
    );
    const [liveUrl, setLiveUrl] = useState(initialData?.liveUrl || "");
    const [githubUrl, setGithubUrl] = useState(initialData?.githubUrl || "");
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
        if (!title.trim() || !description.trim()) return;

        setIsSubmitting(true);
        await onSubmit({
            title: title.trim(),
            year: Number.parseInt(year),
            month: month || undefined,
            description: description.trim(),
            techStack: techStack
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
            achievements: achievements
                .split("\n")
                .map((a) => a.trim())
                .filter(Boolean),
            liveUrl: liveUrl.trim() || undefined,
            githubUrl: githubUrl.trim() || undefined,
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
                    {initialData ? "Edit Project" : "Add New Project"}
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
                    <Label htmlFor="title">Project Title *</Label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., AI Analytics Platform"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                        <Label htmlFor="year">Year *</Label>
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
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label>Project Image</Label>
                    <div className="flex items-start gap-4">
                        <div
                            className="w-24 h-24 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden bg-muted cursor-pointer hover:border-muted-foreground/50 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {imagePreview ? (
                                <div className="relative w-full h-full">
                                    <Image
                                        src={imagePreview || "/placeholder.svg"}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                        sizes="96px"
                                    />
                                </div>
                            ) : (
                                <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
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
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description of the project..."
                        rows={3}
                        required
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="techStack">
                        Tech Stack (comma separated)
                    </Label>
                    <Input
                        id="techStack"
                        value={techStack}
                        onChange={(e) => setTechStack(e.target.value)}
                        placeholder="e.g., React, Node.js, PostgreSQL"
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="achievements">
                        Achievements (one per line)
                    </Label>
                    <Textarea
                        id="achievements"
                        value={achievements}
                        onChange={(e) => setAchievements(e.target.value)}
                        placeholder="Reduced load time by 50%&#10;Increased user engagement by 30%"
                        rows={3}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="liveUrl">Live URL</Label>
                    <Input
                        id="liveUrl"
                        value={liveUrl}
                        onChange={(e) => setLiveUrl(e.target.value)}
                        placeholder="https://..."
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="githubUrl">GitHub URL</Label>
                    <Input
                        id="githubUrl"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        placeholder="https://github.com/..."
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
                    {initialData ? "Save Changes" : "Add Project"}
                </Button>
            </div>
        </form>
    );
}
