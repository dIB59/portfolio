# Portfolio — Project Rules

## Performance budget: 4KB first response

**The single non-negotiable constraint of this project.**

The initial HTML response, after Brotli compression, must fit within **4KB**.
This is the conservative initial TCP congestion window (`init_cwnd` = 3 ×
~1460 bytes MSS). Staying inside that window means the browser starts
rendering the page after **one network round trip**, including on slow,
lossy, or old-stack connections (2G, satellite, train wifi, embedded
routers, old CDN edges).

Anything above 4KB forces the server to wait for the first ACK before
sending more — on a high-latency link that's an extra 200-2000ms before
the user sees anything. The whole site is designed around the fact that
that wait is unacceptable.

### What this means for any change

- **Initial HTML must paint the full above-the-fold view** with no JS.
  The home page reads like a CV before any script has executed.
- **Critical CSS is inlined** in `<head>`. No render-blocking external
  stylesheet on the critical path.
- **JS is always optional and deferred.** Anything interactive (3D
  scenes, the contact form, the LeetCode modal) is an **island** that
  loads after first paint, on visibility, or on interaction.
- **No React/Next hydration on the critical path.** The framework itself
  is too big. This is why the project runs on **Astro** with islands,
  not on Next.js.
- **Compression matters.** 4KB Brotli ≈ 10-15KB of raw HTML/CSS. We
  have room if we don't waste it on unused utility classes, inline
  base64, or verbose markup.

### Before merging any change, ask:

1. Does the page still render above-the-fold with JS disabled?
2. Did I add a render-blocking `<link rel="stylesheet">` or `<script>`?
3. Did I push the initial response over 4KB compressed?
4. Did I add a React island where a static `.astro` component would do?

If any answer surprises you, fix it before merging.

### Measuring

- `pnpm build` then check `dist/` and inspect compressed response sizes.
- Chrome DevTools → Network → throttle to "Slow 3G" or "Fast 3G" and
  time the first paint.
- Run Lighthouse with mobile preset; target LCP < 1.5s on Slow 4G.
