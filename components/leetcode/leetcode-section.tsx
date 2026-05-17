"use client";

import { useEffect, useState } from "react";
import { m } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { LeetCodeProblem } from "@/lib/types/leetcode";
import { getLeetCodeProblems } from "@/lib/db/leetcode";
import { LeetCodeLedger } from "./leetcode-ledger";

export function LeetCodeSection() {
    const [problems, setProblems] = useState<LeetCodeProblem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            const data = await getLeetCodeProblems();
            if (!cancelled) {
                setProblems(data);
                setIsLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <section className="relative min-h-screen px-6 md:px-12 lg:px-20 pt-20 pb-32">
            <div className="max-w-5xl mx-auto">
                <m.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-16 md:mb-24"
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.28em] text-muted-foreground hover:text-accent transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                        Back to portfolio
                    </Link>
                </m.div>

                <m.header
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-16 md:mb-24 max-w-3xl"
                >
                    <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-muted-foreground mb-6">
                        <span className="inline-block w-6 h-px bg-accent align-middle mr-2" />
                        Side quest
                    </p>
                    <h1
                        className="font-display text-foreground leading-[0.9] tracking-[-0.035em] mb-6"
                        style={{ fontSize: "clamp(3rem, 9vw, 7rem)" }}
                    >
                        Practice.
                    </h1>
                    <p className="text-foreground/75 text-base md:text-lg leading-relaxed text-pretty max-w-xl">
                        Algorithms, kept fresh. Mistakes, written down so I
                        don&rsquo;t repeat them. A running log — not a
                        leaderboard.
                    </p>
                </m.header>

                {isLoading ? (
                    <div className="flex justify-center py-24">
                        <Loader2
                            className="w-6 h-6 animate-spin text-muted-foreground"
                            aria-label="Loading"
                        />
                    </div>
                ) : (
                    <LeetCodeLedger problems={problems} />
                )}
            </div>
        </section>
    );
}
