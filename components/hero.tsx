"use client";

import { m } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Settings } from "lucide-react";
import { memo } from "react";

export const Hero = memo(function Hero() {
    return (
        <section className="min-h-screen flex flex-col px-6 md:px-12 lg:px-20 pt-24 pb-12 relative">
            <Link
                href="/admin"
                aria-label="Admin"
                className="absolute top-6 right-6 p-2 rounded-full transition-colors text-muted-foreground hover:text-foreground opacity-0 animate-fade-in"
            >
                <Settings className="w-5 h-5" aria-hidden="true" />
            </Link>

            <div className="flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full">
                <m.p
                    className="text-xs md:text-sm font-mono uppercase tracking-[0.2em] text-muted-foreground mb-6 md:mb-10"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.05 }}
                >
                    <span className="inline-block w-8 h-px bg-primary align-middle mr-3" />
                    Portfolio · Est. 2020
                </m.p>

                <m.h1
                    className="font-display italic text-foreground leading-[0.95] tracking-[-0.04em] mb-6"
                    style={{ fontSize: "clamp(3.5rem, 13vw, 11rem)" }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                    Ibrahim
                    <br />
                    Iqbal.
                </m.h1>

                <m.div
                    className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mt-6 md:mt-12 max-w-5xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <p className="text-lg md:text-xl text-muted-foreground max-w-md leading-relaxed">
                        Full-Stack Developer & Creative Technologist building
                        things that try to outlast the demo.
                    </p>

                    <nav className="flex flex-wrap gap-x-8 gap-y-3 text-base md:text-lg" aria-label="Primary">
                        <a
                            href="#timeline"
                            className="group inline-flex items-center gap-1 text-foreground border-b border-foreground/30 hover:border-primary hover:text-primary transition-colors pb-1"
                        >
                            View work
                            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                        </a>
                        <Link
                            href="/leetcode"
                            className="group inline-flex items-center gap-1 text-foreground border-b border-foreground/30 hover:border-primary hover:text-primary transition-colors pb-1"
                        >
                            LeetCode
                            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                        </Link>
                        <a
                            href="#contact"
                            className="group inline-flex items-center gap-1 text-foreground border-b border-foreground/30 hover:border-primary hover:text-primary transition-colors pb-1"
                        >
                            Contact
                            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                        </a>
                    </nav>
                </m.div>
            </div>

            <m.div
                className="flex items-center justify-between text-[11px] md:text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground pt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.6 }}
            >
                <span className="hidden md:inline">Stockholm · Available for work</span>
                <span className="md:hidden">Stockholm</span>
                <a
                    href="#timeline"
                    className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
                >
                    Scroll for the journey
                    <span aria-hidden="true">↓</span>
                </a>
            </m.div>
        </section>
    );
});
