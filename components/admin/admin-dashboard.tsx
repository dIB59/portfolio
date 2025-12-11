"use client";

import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    LogOut,
    FolderKanban,
    Code2,
    RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { ProjectsAdmin } from "@/components/admin/projects-admin";
import { ProjectUpdatesAdmin } from "@/components/admin/project-updates-admin";
import ThreeBackground from "@/components/three-background";
import { LeetCodeAdminPanel } from "../leetcode/leetcode-admin-panel";

interface AdminDashboardProps {
    userEmail: string;
}

export function AdminDashboard({ userEmail }: AdminDashboardProps) {
    const [activeTab, setActiveTab] = useState<
        "projects" | "updates" | "leetcode"
    >("projects");
    const router = useRouter();

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/");
    };

    return (
        <main className="min-h-screen bg-background relative">
            <div className="relative z-10 py-12 px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <m.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 flex items-center justify-between"
                    >
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Portfolio
                        </Link>
                        <span className="text-sm text-muted-foreground">
                            {userEmail}
                        </span>
                    </m.div>

                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Admin Dashboard
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Manage your projects and LeetCode journey
                        </p>
                    </m.div>

                    {/* Logout button */}
                    <div className="flex justify-end mb-6">
                        <Button
                            variant="outline"
                            onClick={handleLogout}
                            className="gap-2 bg-transparent"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </Button>
                    </div>

                    <div className="flex justify-center gap-2 mb-8 flex-wrap">
                        <Button
                            variant={
                                activeTab === "projects" ? "default" : "outline"
                            }
                            onClick={() => setActiveTab("projects")}
                            className="gap-2"
                        >
                            <FolderKanban className="w-4 h-4" />
                            Projects
                        </Button>
                        <Button
                            variant={
                                activeTab === "updates" ? "default" : "outline"
                            }
                            onClick={() => setActiveTab("updates")}
                            className="gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Project Updates
                        </Button>
                        <Button
                            variant={
                                activeTab === "leetcode" ? "default" : "outline"
                            }
                            onClick={() => setActiveTab("leetcode")}
                            className="gap-2"
                        >
                            <Code2 className="w-4 h-4" />
                            LeetCode
                        </Button>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === "projects" ? (
                            <m.div
                                key="projects-tab"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <ProjectsAdmin />
                            </m.div>
                        ) : activeTab === "updates" ? (
                            <m.div
                                key="updates-tab"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <ProjectUpdatesAdmin />
                            </m.div>
                        ) : (
                            <m.div
                                key="leetcode-tab"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <LeetCodeAdminPanel />
                            </m.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </main>
    );
}
