import { Fragment, Suspense } from "react";
import { Hero } from "@/components/hero";
import { Preface } from "@/components/preface";
import { ChapterSpread } from "@/components/chapter-spread";
import { Interlude } from "@/components/interludes/interlude";
import { getProjects } from "@/lib/db/projects";
import { chapterCopyFor, sortIntoChapters } from "@/lib/story";
import { Analytics } from "@vercel/analytics/next";
import { ContactForm } from "@/components/contact/contact-form";
import { SiteFooter } from "@/components/site-footer";

export const dynamic = "force-dynamic";

async function ChaptersData() {
    const projects = await getProjects();
    const ordered = sortIntoChapters(projects);
    const total = ordered.length;

    return (
        <>
            {ordered.map((project, index) => {
                const copy = chapterCopyFor(project);
                const chapterNumber = String(index + 1).padStart(2, "0");

                return (
                    <Fragment key={project.id}>
                        <ChapterSpread
                            project={project}
                            copy={copy}
                            chapterNumber={chapterNumber}
                            index={index}
                            isLast={index === total - 1}
                        />
                        {project.interludeAfter && (
                            <Interlude kind={project.interludeAfter} />
                        )}
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
