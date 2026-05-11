"use client";

import { m } from "framer-motion";

export function Preface() {
    return (
        <section
            id="preface"
            className="relative px-6 md:px-12 lg:px-20 py-32 md:py-48 border-t border-border/60"
        >
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
                <div className="md:col-span-3">
                    <p className="text-xs font-mono uppercase tracking-[0.24em] text-muted-foreground">
                        <span className="inline-block w-6 h-px bg-accent align-middle mr-2" />
                        Preface
                    </p>
                </div>

                <m.div
                    className="md:col-span-9 space-y-10"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    viewport={{ once: true, margin: "-15%" }}
                >
                    <p
                        className="font-display text-foreground leading-[1.02] tracking-[-0.025em] text-balance"
                        style={{ fontSize: "clamp(1.85rem, 5vw, 3.75rem)" }}
                    >
                        Six projects, in the order they happened. The ones I
                        learned the most from, not the ones that look best on a
                        CV.
                    </p>

                    <div className="max-w-2xl space-y-5 text-foreground/75 text-base md:text-lg leading-relaxed text-pretty">
                        <p>
                            I&rsquo;m a uni student in Stockholm. None of this is
                            paid work. I built each of these because I wanted to
                            figure something out, or because I was bored, or
                            because a class needed a final project and I went a
                            bit overboard.
                        </p>
                    </div>
                </m.div>
            </div>
        </section>
    );
}
