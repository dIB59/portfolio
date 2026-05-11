import type { Project } from "./projects-data";

/**
 * Chapter copy keyed by project ID. The DB stores tech/achievements/links;
 * this file stores the narrative — voice, pull-quote, the line that bridges
 * to the next chapter. Edit freely; nothing here is generated.
 *
 * Order is chronological (oldest → newest) — the story reads forward.
 */
export interface ChapterCopy {
    /** Single memorable line, shown oversized as the chapter pull-quote. */
    pullQuote: string;
    /** Long-form narrative shown beside the project. Two paragraphs max. */
    narrative: string;
    /** Bridge line shown between this chapter and the next. Omit on the last. */
    transitionAfter?: string;
}

const CHAPTER_ORDER: string[] = [
    "efde612f-0bdc-45eb-8ebf-a8c37eb80de5", // How Long to Beat
    "ee84183f-7680-472b-bed1-11f9aca7a494", // EchoBoard
    "a6310f8b-dba8-46f3-a73d-c8ac86722a50", // Equity AI
    "79677700-de99-4ef7-a79e-b769400d5efd", // Graviplex
    "48d97a42-5f12-45cd-b3d5-56c5e08c3345", // Particle Game
    "8337a48c-f0d3-4d08-b444-d83112e2f944", // SEO Analyzer
];

export const CHAPTER_COPY: Record<string, ChapterCopy> = {
    "efde612f-0bdc-45eb-8ebf-a8c37eb80de5": {
        pullQuote: "Built it in six hours.",
        narrative:
            "Built this in an afternoon when I should have been studying. It estimates how long it would take to play every game in my Steam library. Turns out the answer is longer than I'm probably going to live. First time touching Java.",
        transitionAfter: "Next I wanted to try something with other people.",
    },
    "ee84183f-7680-472b-bed1-11f9aca7a494": {
        pullQuote: "My first time shipping with a team.",
        narrative:
            "Group project that became a feedback board for big organisations. Employees post issues and fixes, upvote each other, and management actually sees what people think. Six of us, one semester. Honestly I learned more about how teams work than about any of the code. Two of us once spent a week on the same component without noticing. We ran a vote on the database schema, which I now know not to do.",
        transitionAfter: "Working in a team was new for me. I wanted to know what running one felt like.",
    },
    "a6310f8b-dba8-46f3-a73d-c8ac86722a50": {
        pullQuote: "Led a team of three.",
        narrative:
            "First project I actually ran instead of just being on. It scans payroll data and flags pay gaps between people doing the same job at the same level. Three of us, one semester. The model itself was fine to build. What ate my time was just keeping track of where everyone else was. Every Monday I'd open Discord and try to piece together what state we were in.",
        transitionAfter: "After Equity AI I needed a break from leading. I wanted to be back in the code, alone.",
    },
    "79677700-de99-4ef7-a79e-b769400d5efd": {
        pullQuote: "Rendered one circle. Rendered one triangle.",
        narrative:
            "Spent a couple of weekends trying to write a renderer in Rust and WebGPU. Got a circle. Eventually got a triangle. That's basically the whole repo. WebGPU is much harder than the tutorials make it look.",
        transitionAfter: "A circle and a triangle wasn't really the project. I came back for it later.",
    },
    "48d97a42-5f12-45cd-b3d5-56c5e08c3345": {
        pullQuote: "25,000 on the CPU. 500,000 on the GPU.",
        narrative:
            "Started out as a CPU simulation handling around 25,000 particles. That was fine, but I wanted to see how much further the GPU could push it, so I rewrote the whole physics layer. Now it runs half a million of them in real time. Every particle gravitates toward every other one, they bounce off each other, and somehow my laptop doesn't catch fire. Bevy does the rendering. I wrote the physics. First thing I built in Rust where I didn't feel like I had to apologise for the code first.",
        transitionAfter: "By this point I trusted Rust enough to build something I could imagine.",
    },
    "8337a48c-f0d3-4d08-b444-d83112e2f944": {
        pullQuote: "One hundred thousand links.",
        narrative:
            "Desktop app that crawls a whole website and draws it as a graph you can pan around. About a thousand pages and a hundred thousand links is the comfortable upper limit. It caches everything locally and then asks an LLM what's broken about your SEO and what to do about it. Tauri for the shell, Rust does the crawl, Next.js on top, SQLite under everything. I've been using it on my own sites since I built it, which is rare for me.",
    },
};

/**
 * Returns projects in story order (chronological, oldest first). Any project
 * not listed in CHAPTER_ORDER is appended at the end so the page never breaks
 * if the DB adds a row before the copy is written.
 */
export function sortIntoChapters(projects: Project[]): Project[] {
    const byId = new Map(projects.map((p) => [p.id, p]));
    const ordered: Project[] = [];
    for (const id of CHAPTER_ORDER) {
        const p = byId.get(id);
        if (p) {
            ordered.push(p);
            byId.delete(id);
        }
    }
    for (const remaining of byId.values()) ordered.push(remaining);
    return ordered;
}
