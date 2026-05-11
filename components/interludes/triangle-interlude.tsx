"use client";

import { m, useReducedMotion } from "framer-motion";

export function TriangleInterlude() {
    const reduced = useReducedMotion() ?? false;

    return (
        <section
            aria-label="Interlude: a single triangle"
            className="relative w-full h-[70vh] md:h-[85vh] border-t border-border/60 overflow-hidden bg-[#0c0907]"
        >
            {/* Subtle radial glow behind the triangle — gives the void some depth
                without a 3D scene. */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(circle at 55% 45%, rgba(217,191,128,0.10), transparent 55%)",
                }}
                aria-hidden="true"
            />

            <div className="absolute inset-0 flex items-center justify-center">
                <m.svg
                    width="42%"
                    height="42%"
                    viewBox="-100 -100 200 200"
                    className="max-w-[420px] max-h-[420px]"
                    aria-hidden="true"
                    animate={
                        reduced
                            ? undefined
                            : { rotate: [0, 360] }
                    }
                    transition={
                        reduced
                            ? undefined
                            : { duration: 90, repeat: Infinity, ease: "linear" }
                    }
                >
                    <defs>
                        <linearGradient id="gold" x1="0" y1="-1" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f0d9a0" />
                            <stop offset="55%" stopColor="#c4a560" />
                            <stop offset="100%" stopColor="#7a5e2a" />
                        </linearGradient>
                    </defs>
                    <polygon
                        points="0,-80 -70,40 70,40"
                        fill="url(#gold)"
                        stroke="#e6d4a0"
                        strokeWidth="0.6"
                    />
                </m.svg>
            </div>

            {/* Caption — sparse, like a museum placard. */}
            <m.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.2 }}
                viewport={{ once: true, margin: "-15%" }}
                className="absolute bottom-10 md:bottom-16 left-6 md:left-12 lg:left-20 right-6 max-w-md pointer-events-none"
            >
                <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-accent/80 mb-3">
                    <span className="inline-block w-6 h-px bg-accent align-middle mr-2" />
                    Interlude
                </p>
                <p
                    className="font-display text-foreground/90 leading-[1.05] tracking-[-0.02em]"
                    style={{ fontSize: "clamp(1.25rem, 2.6vw, 2rem)" }}
                >
                    One triangle.
                    <br />
                    The smallest possible proof that the renderer works.
                </p>
            </m.div>
        </section>
    );
}
