// CONSTRAINT: 4KB initial HTML (Brotli) — see CLAUDE.md.
//
// The cover. This route handler is at the root of the App Router, so
// Next serves it for `/` BEFORE any of its React/RSC machinery loads.
// The response is a hand-written HTML string — no layout, no Server
// Component runtime, no client JS hydration. Just bytes.
//
// Fonts live at /fonts/*.woff2 (copied from @fontsource at install time
// into /public/fonts/). They load async with font-display: swap so
// first paint is instant even on cold connections.
//
// The "Read the story" link takes the visitor to /story, where the full
// Next.js editorial experience (Hero with 3D, 6 chapters, interludes,
// contact form, footer) runs through the normal page pipeline.

export const dynamic = "force-static";
export const revalidate = false;

// The trailing <script> kicks off a fetch for /story the moment the
// cover paints, then waits for both the fetch and a minimum display
// time before navigating. The fetch warms the HTTP cache so the
// navigation itself is instant. Any user click on the page cancels the
// auto-redirect — interaction wins.
const HTML = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Ibrahim Iqbal — full-stack developer in Stockholm."><title>Ibrahim Iqbal — Stockholm</title><link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Ctext y='13' font-family='serif' font-size='14'%3EI%3C/text%3E%3C/svg%3E"><link rel="prefetch" href="/story" as="document"><style>@font-face{font-family:"Geist";font-display:swap;font-weight:100 900;src:url(/fonts/geist.woff2) format("woff2-variations")}@font-face{font-family:"Instrument Serif";font-display:swap;font-weight:400;src:url(/fonts/instrument-serif.woff2) format("woff2")}:root{--bg:oklch(.13 .012 60);--fg:oklch(.94 .006 80);--mute:oklch(.66 .008 80);--accent:oklch(.82 .085 80);--primary:oklch(.76 .11 145)}*{box-sizing:border-box}html,body{margin:0;padding:0}body{background:var(--bg);color:var(--fg);font:1rem/1.5 "Geist",ui-sans-serif,system-ui,sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none;transition:color .15s}main{position:relative;max-width:80rem;margin:0 auto;padding:5rem 1.5rem 3rem;min-height:100dvh;display:flex;flex-direction:column;overflow:hidden}main::before{content:"";position:absolute;inset:0;z-index:0;pointer-events:none;background:radial-gradient(ellipse 60% 70% at 75% 35%,color-mix(in oklch,var(--accent) 16%,transparent),transparent 60%),radial-gradient(ellipse 45% 55% at 85% 75%,color-mix(in oklch,var(--primary) 12%,transparent),transparent 65%)}header,.foot{position:relative;z-index:1}header{flex:1;display:flex;flex-direction:column;justify-content:center}h1{margin:0 0 2rem;font:clamp(3.5rem,14vw,12rem)/.86 "Instrument Serif",ui-serif,Georgia,serif;letter-spacing:-.045em}.sub{display:flex;flex-direction:column;gap:2rem;max-width:64rem;margin-top:1rem}.lede{margin:0;max-width:28rem;font-size:1.125rem;line-height:1.6;color:color-mix(in oklch,var(--fg) 80%,transparent)}nav{display:flex;flex-wrap:wrap;gap:.75rem 1.75rem;font-size:1rem;align-items:center}nav a{display:inline-flex;align-items:center;gap:.4rem;color:color-mix(in oklch,var(--fg) 80%,transparent)}nav a:hover{color:var(--accent)}nav .primary{color:var(--fg)}nav .n{font-size:.75rem;color:var(--accent);font-family:ui-monospace,monospace}.foot{display:flex;justify-content:space-between;align-items:center;padding-top:3rem;font-size:.6875rem;text-transform:uppercase;letter-spacing:.24em;color:var(--mute);font-family:ui-monospace,monospace}.foot a:hover{color:var(--fg)}.admin{position:absolute;top:1.5rem;right:1.5rem;z-index:2;color:var(--mute);opacity:.4;font-size:1.25rem}.admin:hover{opacity:1;color:var(--fg)}.pulse{position:fixed;bottom:1.5rem;right:1.5rem;z-index:2;font-size:.625rem;letter-spacing:.24em;text-transform:uppercase;color:var(--mute);opacity:0;font-family:ui-monospace,monospace;transition:opacity .4s;pointer-events:none}.pulse.on{opacity:.7}.pulse i{display:inline-block;width:.4rem;height:.4rem;border-radius:50%;background:var(--accent);margin-right:.5rem;vertical-align:middle;animation:p 1.2s ease-in-out infinite}@keyframes p{0%,100%{opacity:.3}50%{opacity:1}}@media(min-width:768px){main{padding:5rem 3rem 3rem}.sub{flex-direction:row;align-items:flex-end;justify-content:space-between;margin-top:2rem}.lede{font-size:1.25rem}nav{font-size:1.125rem}.foot{font-size:.75rem}.pulse{bottom:3rem;right:3rem}}@media(min-width:1024px){main{padding:5rem 5rem 3rem}.pulse{right:5rem}}</style></head><body><main><a href="/admin" class="admin" aria-label="Admin">⚙</a><header><h1>Ibrahim<br>Iqbal.</h1><div class="sub"><p class="lede">Full-stack developer in Stockholm. This page is the story of six projects, and what each one taught me.</p><nav aria-label="Primary"><a class="primary" href="/story#chapter-1"><span class="n">01</span> Start the story</a><a href="/leetcode">LeetCode</a><a href="/story#contact">Contact</a></nav></div></header><div class="foot"><span>Stockholm · Available for work</span><a href="/story">Begin ↓</a></div><div class="pulse" id="p"><i></i>Preparing the story</div></main><script>(()=>{let g=1;addEventListener("click",()=>g=0,{capture:!0,once:!0});addEventListener("keydown",()=>g=0,{capture:!0,once:!0});setTimeout(()=>document.getElementById("p")?.classList.add("on"),400);Promise.all([fetch("/story").catch(()=>{}),new Promise(r=>setTimeout(r,1800))]).then(()=>{if(g)location.href="/story"})})()</script></body></html>`;

export async function GET() {
    return new Response(HTML, {
        headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "public, max-age=0, must-revalidate",
        },
    });
}
