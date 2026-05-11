import { Fragment, Suspense } from "react";
import { Hero } from "@/components/hero";
import { Preface } from "@/components/preface";
import { ChapterSpread } from "@/components/chapter-spread";
import { Interlude } from "@/components/interludes/interlude";
import { getProjects } from "@/lib/supabase/projects";
import { CHAPTER_COPY, sortIntoChapters, type ChapterCopy } from "@/lib/story";
import { Analytics } from "@vercel/analytics/next";
import { ContactForm } from "@/components/contact/contact-form";
import { SiteFooter } from "@/components/site-footer";

// IDs that should be followed by a 3D interlude. Keyed off the project they
// follow so the story stays right even if a new project is inserted.
const INTERLUDE_AFTER: Record<string, "triangle" | "particles"> = {
    "79677700-de99-4ef7-a79e-b769400d5efd": "triangle", // after Graviplex
    "48d97a42-5f12-45cd-b3d5-56c5e08c3345": "particles", // after Particle Game
};

export const dynamic = "force-dynamic";

async function ChaptersData() {
    const projects = await getProjects();
    const ordered = sortIntoChapters(projects);
    const total = ordered.length;

    return (
        <>
            {ordered.map((project, index) => {
                const copy: ChapterCopy =
                    CHAPTER_COPY[project.id] ?? {
                        pullQuote: project.description,
                        narrative: project.description,
                    };
                const chapterNumber = String(index + 1).padStart(2, "0");
                const interlude = INTERLUDE_AFTER[project.id];

                return (
                    <Fragment key={project.id}>
                        <ChapterSpread
                            project={project}
                            copy={copy}
                            chapterNumber={chapterNumber}
                            index={index}
                            isLast={index === total - 1}
                        />
                        {interlude && <Interlude kind={interlude} />}
                    </Fragment>
                );
            })}
        </>
    );
}

function ChaptersFallback() {
    return (
        <div className="px-6 md:px-12 lg:px-20 py-32 border-t border-border/60">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="h-6 w-32 bg-muted/60 rounded animate-pulse" />
                <div className="h-24 w-3/4 bg-muted/60 rounded animate-pulse" />
                <div className="h-4 w-full bg-muted/40 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-muted/40 rounded animate-pulse" />
            </div>
        </div>
    );
}

export default function PortfolioPage() {
    return (
        <>
            <main className="relative">
                <Hero />
                <Preface />
                <Suspense fallback={<ChaptersFallback />}>
                    <ChaptersData />
                </Suspense>
                <ContactForm />
            </main>
            <SiteFooter />
            <Analytics />
        </>
    );
}
