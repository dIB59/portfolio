"use client";

import {
    Children,
    createContext,
    useContext,
    type ComponentPropsWithoutRef,
    type ReactNode,
} from "react";
import Image from "next/image";
import { m, type Variants } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Chapter — a compound editorial primitive.
 *
 *   <Chapter id="chapter-1" flip>
 *     <Chapter.Header>
 *       <Chapter.Number>01</Chapter.Number>
 *       <Chapter.Heading>
 *         <Chapter.Eyebrow>Chapter 01 · September 2023</Chapter.Eyebrow>
 *         <Chapter.Title>How Long to Beat</Chapter.Title>
 *       </Chapter.Heading>
 *     </Chapter.Header>
 *
 *     <Chapter.PullQuote>Built it in six hours.</Chapter.PullQuote>
 *
 *     <Chapter.Body>
 *       <Chapter.Prose>
 *         <Chapter.Narrative>Six hours, one Steam library…</Chapter.Narrative>
 *         <Chapter.Outcomes>
 *           <Chapter.Outcome>Built the project in 6 hours.</Chapter.Outcome>
 *         </Chapter.Outcomes>
 *         <Chapter.Meta>
 *           <Chapter.Tech items={['Java', 'Spring']} />
 *           <Chapter.SourceLink href="…" />
 *         </Chapter.Meta>
 *       </Chapter.Prose>
 *       <Chapter.Figure src="…" alt="…" />
 *     </Chapter.Body>
 *
 *     <Chapter.Transition>Then I wanted a team.</Chapter.Transition>
 *   </Chapter>
 *
 * Composition rules:
 *   - Root provides `flip` via context. Body reads it and reverses
 *     Prose/Figure ordering on md+ when set.
 *   - Outcomes provides a 1-based index via context; Outcome reads it.
 *   - Every visible part has its own fade-up scroll animation built in.
 */

// ---------------------------------------------------------------------------
// Shared motion
// ---------------------------------------------------------------------------

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0 },
};

const fadeUpProps = {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, margin: "-12%" },
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
    variants: fadeUp,
} as const;

// ---------------------------------------------------------------------------
// Context — root + outcomes
// ---------------------------------------------------------------------------

interface ChapterContextValue {
    flip: boolean;
}

const ChapterContext = createContext<ChapterContextValue | null>(null);

function useChapterContext(name: string): ChapterContextValue {
    const ctx = useContext(ChapterContext);
    if (!ctx) throw new Error(`<${name}> must be used inside <Chapter>.`);
    return ctx;
}

const OutcomeIndexContext = createContext<number>(1);

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

interface ChapterRootProps extends ComponentPropsWithoutRef<"article"> {
    /** When true, Body places the Figure on the left and Prose on the right (md+). */
    flip?: boolean;
}

function ChapterRoot({
    flip = false,
    className,
    children,
    ...rest
}: ChapterRootProps) {
    return (
        <ChapterContext.Provider value={{ flip }}>
            <article
                className={cn(
                    "relative border-t border-border/60 scroll-mt-16",
                    className,
                )}
                {...rest}
            >
                <div className="px-6 md:px-12 lg:px-20 py-24 md:py-40">
                    <div className="max-w-6xl mx-auto">{children}</div>
                </div>
            </article>
        </ChapterContext.Provider>
    );
}

// ---------------------------------------------------------------------------
// Header / Number / Eyebrow / Title
// ---------------------------------------------------------------------------

function ChapterHeader({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <m.header
            {...fadeUpProps}
            className={cn(
                "grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-16 mb-16 md:mb-24",
                className,
            )}
        >
            {children}
        </m.header>
    );
}

function ChapterNumber({ children }: { children: ReactNode }) {
    return (
        <div className="md:col-span-3">
            <div
                className="font-display text-accent leading-none tracking-[-0.04em] tabular-nums"
                style={{ fontSize: "clamp(4rem, 11vw, 9rem)" }}
                aria-hidden="true"
            >
                {children}
            </div>
        </div>
    );
}

function ChapterHeading({ children }: { children: ReactNode }) {
    return (
        <div className="md:col-span-9 flex flex-col justify-end gap-3 md:pb-4">
            {children}
        </div>
    );
}

function ChapterEyebrow({ children }: { children: ReactNode }) {
    return (
        <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-muted-foreground">
            <span className="inline-block w-6 h-px bg-accent align-middle mr-2" />
            {children}
        </p>
    );
}

function ChapterTitle({ children }: { children: ReactNode }) {
    return (
        <h2
            className="font-display text-foreground leading-[0.95] tracking-[-0.025em] text-balance"
            style={{ fontSize: "clamp(2.25rem, 6vw, 4.75rem)" }}
        >
            {children}
        </h2>
    );
}

// ---------------------------------------------------------------------------
// PullQuote
// ---------------------------------------------------------------------------

function ChapterPullQuote({ children }: { children: ReactNode }) {
    return (
        <m.blockquote
            {...fadeUpProps}
            className="md:pl-[25%] mb-20 md:mb-28"
        >
            <p
                className="font-display italic text-foreground/95 leading-[1.05] tracking-[-0.02em] text-balance"
                style={{ fontSize: "clamp(1.8rem, 4.4vw, 3.4rem)" }}
            >
                <span className="text-accent/80 mr-1 align-top" aria-hidden="true">
                    &ldquo;
                </span>
                {children}
                <span className="text-accent/80 ml-1 align-top" aria-hidden="true">
                    &rdquo;
                </span>
            </p>
        </m.blockquote>
    );
}

// ---------------------------------------------------------------------------
// Body / Prose / Figure
// ---------------------------------------------------------------------------

function ChapterBody({ children }: { children: ReactNode }) {
    const { flip } = useChapterContext("Chapter.Body");
    return (
        <div
            className={cn(
                "grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start",
                flip && "md:[&>*:first-child]:order-2",
            )}
        >
            {children}
        </div>
    );
}

function ChapterProse({ children }: { children: ReactNode }) {
    return (
        <m.div
            {...fadeUpProps}
            className="md:col-span-7 space-y-6 text-foreground/85 leading-relaxed text-pretty"
        >
            {children}
        </m.div>
    );
}

function ChapterNarrative({ children }: { children: ReactNode }) {
    return <p className="text-base md:text-lg">{children}</p>;
}

function ChapterFigure({
    src,
    alt,
    sizes = "(max-width: 768px) 100vw, 40vw",
}: {
    src: string;
    alt: string;
    sizes?: string;
}) {
    return (
        <m.figure
            {...fadeUpProps}
            className="md:col-span-5 relative aspect-[4/5] overflow-hidden bg-muted rounded-sm shadow-2xl shadow-black/40"
        >
            <Image
                src={src}
                alt={alt}
                fill
                className="object-cover"
                sizes={sizes}
            />
        </m.figure>
    );
}

// ---------------------------------------------------------------------------
// Outcomes / Outcome
// ---------------------------------------------------------------------------

function ChapterOutcomes({ children }: { children: ReactNode }) {
    return (
        <ul className="pt-4 border-t border-border/40 space-y-3">
            {Children.map(children, (child, i) => (
                <OutcomeIndexContext.Provider value={i + 1}>
                    {child}
                </OutcomeIndexContext.Provider>
            ))}
        </ul>
    );
}

function ChapterOutcome({ children }: { children: ReactNode }) {
    const index = useContext(OutcomeIndexContext);
    return (
        <li className="flex items-baseline gap-4 text-sm md:text-base text-foreground/80">
            <span
                className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent/80 w-6 shrink-0 tabular-nums"
                aria-hidden="true"
            >
                {String(index).padStart(2, "0")}
            </span>
            <span className="text-pretty">{children}</span>
        </li>
    );
}

// ---------------------------------------------------------------------------
// Meta / Tech / Links
// ---------------------------------------------------------------------------

function ChapterMeta({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4 pt-6">
            {children}
        </div>
    );
}

function ChapterTech({ items }: { items: string[] }) {
    if (items.length === 0) return null;
    return (
        <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
            {items.join(" · ")}
        </p>
    );
}

function ChapterLiveLink({
    href,
    children = "Visit",
}: {
    href: string;
    children?: ReactNode;
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-foreground hover:text-accent transition-colors border-b border-foreground/30 hover:border-accent pb-0.5"
        >
            {children}
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
        </a>
    );
}

function ChapterSourceLink({
    href,
    children = "Source",
}: {
    href: string;
    children?: ReactNode;
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-foreground/80 hover:text-accent transition-colors"
        >
            <Github className="w-3.5 h-3.5" aria-hidden="true" />
            {children}
        </a>
    );
}

// ---------------------------------------------------------------------------
// Transition
// ---------------------------------------------------------------------------

function ChapterTransition({ children }: { children: ReactNode }) {
    return (
        <m.div
            {...fadeUpProps}
            className="-mx-6 md:-mx-12 lg:-mx-20 px-6 md:px-12 lg:px-20 pt-12 md:pt-16"
        >
            <div className="max-w-6xl mx-auto md:pl-[25%]">
                <p
                    className="font-display text-muted-foreground/90 leading-snug text-balance"
                    style={{ fontSize: "clamp(1.1rem, 2.2vw, 1.5rem)" }}
                >
                    <span
                        className="inline-block w-12 md:w-20 h-px bg-accent/60 align-middle mr-4"
                        aria-hidden="true"
                    />
                    {children}
                </p>
            </div>
        </m.div>
    );
}

// ---------------------------------------------------------------------------
// Compound export
// ---------------------------------------------------------------------------

// Dual export pattern (Radix-style):
//   - Individual named exports for use from Server Components — Next 16's
//     client-reference bundler doesn't carry statically-attached properties
//     across the server/client boundary, so `<Chapter.Header>` from a
//     server file resolves to `undefined`.
//   - `Chapter` namespace (Object.assign) — convenient inside Client
//     Components where the property accessors do survive.
export {
    ChapterHeader,
    ChapterNumber,
    ChapterHeading,
    ChapterEyebrow,
    ChapterTitle,
    ChapterPullQuote,
    ChapterBody,
    ChapterProse,
    ChapterNarrative,
    ChapterFigure,
    ChapterOutcomes,
    ChapterOutcome,
    ChapterMeta,
    ChapterTech,
    ChapterLiveLink,
    ChapterSourceLink,
    ChapterTransition,
};

export const Chapter = Object.assign(ChapterRoot, {
    Header: ChapterHeader,
    Number: ChapterNumber,
    Heading: ChapterHeading,
    Eyebrow: ChapterEyebrow,
    Title: ChapterTitle,
    PullQuote: ChapterPullQuote,
    Body: ChapterBody,
    Prose: ChapterProse,
    Narrative: ChapterNarrative,
    Figure: ChapterFigure,
    Outcomes: ChapterOutcomes,
    Outcome: ChapterOutcome,
    Meta: ChapterMeta,
    Tech: ChapterTech,
    LiveLink: ChapterLiveLink,
    SourceLink: ChapterSourceLink,
    Transition: ChapterTransition,
});
