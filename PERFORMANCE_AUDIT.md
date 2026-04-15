# W1 @ WMU Performance Audit

Date: 2026-04-15
Branch: `add-events-calendar-and-articles`
Scope: Static analysis of the Next.js 15 app after the events calendar landed in `fbba6a1` and `d88a025`.

## TL;DR

The recent events work is a contributor, but it is not the main problem. The dominant cost is **~72 MB of uncompressed PNG/JPG** in `public/images/`, led by an **18 MB hero PNG** loaded via a raw CSS `background-image`. The events calendar piles on by pulling `react-day-picker` (~20 KB + CSS) into a 161-line `'use client'` tree on the home page, plus a continuously-spinning SVG badge and a site-wide Lenis smooth-scroll RAF loop. 

Fix the images and kill Lenis first. That alone is the single biggest win and requires no architectural change. The events calendar can be de-clientified without a rewrite. **An Astro migration is not necessary** to recover performance here. Recommendation at the bottom.

---

## 1. Measurements

I did not run a live Lighthouse pass (no dev server started per your instructions). Numbers below are derived from file sizes, dependency weights, and code inspection. Where I estimate, I say so.

### Stack

- Next.js `15.5.12`, App Router, React `18.3.1`, TypeScript strict.
- No state libs, no data libs, no animation libs (framer-motion, GSAP, three, lottie all absent).
- Notable deps: `lenis@1.3.21` (~16 KB), `react-day-picker@9.14.0` (~20 KB + ~20 KB CSS), `date-fns@4.1.0` (~13 KB tree-shakeable).
- Google Fonts via `next/font` with `display: swap` (correct).
- Microsoft Clarity injected via `next/script` with `afterInteractive` (correct).

### JS payload (estimated, uncompressed)

| Source | Size | Notes |
|---|---|---|
| React + ReactDOM | ~172 KB | Baseline. |
| Next.js runtime | ~90 KB | Baseline. |
| `lenis` (root layout) | ~16 KB | Every route. |
| `react-day-picker` | ~20 KB | Home only, via `EventsSection`. |
| `react-day-picker` CSS | ~20 KB | Home only. |
| `date-fns` subset | ~5 to 10 KB | Via `EventsSection`. |
| App code (5 client components) | ~15 to 25 KB | Navbar, SmoothScroll, RotatingBadge, EventsSection, BroncoBuildIt. |
| `events.json` inlined into client bundle | ~5 KB | 92 entries, bundled because `EventsSection` is `'use client'` and imports it. |

**Estimated first-load JS for `/` (gzipped): ~130 to 160 KB.** That is high for a site that is otherwise mostly static text and cards, and almost all of the delta versus a plain marketing site comes from `lenis` + `react-day-picker` + 5 client components hydrating in parallel.

### Image payload (the real problem)

| File | Size | Used |
|---|---|---|
| [public/images/cards/w1_hero.png](public/images/cards/w1_hero.png) | **18 MB** | Hero bg on `/` via CSS `background-image` |
| [public/images/cards/w1_learn.png](public/images/cards/w1_learn.png) | **17 MB** | PillarCard on `/` |
| [public/images/cards/w1_build.png](public/images/cards/w1_build.png) | **14 MB** | PillarCard on `/` |
| [public/images/cards/w1_ecosystem.png](public/images/cards/w1_ecosystem.png) | **6.6 MB** | PillarCard on `/` |
| [public/images/bronco/](public/images/bronco/) (3 JPGs) | ~10 MB | `/build` photo grid |
| [public/images/portfolio/](public/images/portfolio/) (6 files) | ~6.8 MB | `/portfolio` |

**Total: ~72 MB of source imagery. The home page alone touches ~55 MB of it.** Three of the four card PNGs bypass `next/image` entirely when used as a CSS background, so they do not get WebP/AVIF negotiation or responsive sizing.

### Core Web Vitals (estimated, home page)

- **LCP**: almost certainly dominated by `w1_hero.png`. On a fast connection with `next/image` doing AVIF you would expect maybe 1.5 to 2.5s. With the raw 18 MB PNG background, on anything slower than fiber this is plausibly **5 to 12+ seconds**, and worse on mobile. This is the single biggest user-visible issue.
- **TTI / TBT**: five client components hydrating in parallel plus a 20s `animate-spin` on `RotatingBadge` and a Lenis RAF loop. Probably fine on desktop, noticeable jank on mid-range mobile.
- **CLS**: should be OK. `next/image` with `sizes` is used correctly in PillarCard and EventsSection, fonts use `display: swap`.

### Event features, specifically

The reported slowdown maps to three things from `fbba6a1`:

1. **[app/components/EventsSection.tsx](app/components/EventsSection.tsx)** (161 lines, `'use client'`). Imports `react-day-picker`, its CSS, `next/image`, and the full `events.json`. Filters 92 events in `useMemo` on every `selectedDate` / `displayMonth` change. The only thing in this file that actually needs to be a client component is the `<DayPicker>` itself and the filter state. The event cards below it are pure render.
2. **[app/components/RotatingBadge.tsx](app/components/RotatingBadge.tsx)** (87 lines, `'use client'`). Fixed-position `z-40` element with a 20s infinite CSS spin wrapping an SVG `<textPath>` that renders the word "EVENTS" 5 to 8 times around a circle, plus a `priority`-flagged `next/image` badge. Continuous repaints and, because it is fixed and Lenis is running, it is on the compositor hot path during every scroll frame.
3. **[data/events.ts](data/events.ts)** `parseEventDate` creates a new `Date` per call and is called 4+ times per render cycle across 92 entries. Not a meaningful CPU cost alone, but it is called from a client component so it runs in the user's browser instead of at build time.

### N+1 / waterfalls

No true N+1. All data is static JSON imported at build time. The only mild duplication: `getNextSession()` in [data/bronco-build-it-links.ts](data/bronco-build-it-links.ts) is called once from [app/components/Navbar.tsx](app/components/Navbar.tsx) and once from [app/components/BroncoBuildIt.tsx](app/components/BroncoBuildIt.tsx). Cheap, not a real issue.

### Render-blocking / hydration

- No `<Suspense>` boundaries anywhere. Not strictly required, but nothing is deferred.
- No `next/dynamic` usage anywhere. No code splitting beyond the default per-route.
- Five client components hydrate in parallel on `/`: `SmoothScroll`, `Navbar`, `RotatingBadge`, `EventsSection`, `BroncoBuildIt`. Two of these (`BroncoBuildIt`, arguably `Navbar`) do not need to be client components at all.
- `next.config.js` has `images.remotePatterns: [{ hostname: '**' }]`. Functionally fine, but every remote event image from Luma/CampusLabs/Google goes through Next's optimizer on demand, which can be slow on the first request.

---

## 2. Fix List, Ranked by ROI

Scale: Effort = hours. Impact = rough guess at perceived-perf improvement on the home page. Ordered by impact-per-hour.

### Tier 1. Do these first. High impact, low effort.

1. **Compress the card PNGs to AVIF/WebP.** Effort: **~1 hr** (offline, squoosh/sharp). Impact: **huge**. `w1_hero.png` 18 MB to ~1 to 2 MB AVIF. All four cards: ~55 MB to ~4 to 6 MB. This is the single biggest LCP win available.
2. **Stop using a raw CSS background for the hero.** Effort: **~30 min**. Switch [app/components/Hero.tsx](app/components/Hero.tsx) to `next/image` with `fill`, `priority`, and `sizes="100vw"`. Combined with (1) this fixes LCP outright.
3. **Delete `SmoothScroll` / Lenis.** Effort: **~10 min**. Impact: saves 16 KB JS on every route, removes a continuous RAF loop, removes the compositor hot path interaction with the fixed-position rotating badge. Native scroll is fine. If you want inertia, it is almost never worth the cost on a content site.
4. **Convert `BroncoBuildIt` to a server component.** Effort: **~10 min**. It has no state and no effects, it just calls `getNextSession()`. Drop `'use client'`, compute on the server, remove one hydration boundary.
5. **Drop `priority` on `RotatingBadge`'s `next/image`, or remove the badge entirely.** Effort: **~5 to 30 min**. The badge is decoration. At minimum, stop eager-fetching a 17 KB image for it and stop the 20s spin (or replace with a pure-CSS `rotate` on a static `<img>` with `will-change: transform`, which is GPU-accelerated and basically free).

**Tier 1 total: ~2 to 3 hours. Expected result: LCP drops from "several seconds" to "under 2 seconds" on a decent connection, TBT noticeably lower, JS payload down ~16 KB.**

### Tier 2. Do these next. Meaningful wins, moderate effort.

6. **Split `EventsSection` into a server shell + small client island.** Effort: **~2 hr**. The shell renders the event cards and the month header as a server component. The client island is just the `<DayPicker>` and the `selectedDate` state, which communicates via URL search param or a small `useState` that filters a pre-rendered list via `hidden` attributes. This gets the 92-event JSON and most of the component off the client entirely. Keeps `react-day-picker` for now.
7. **Replace `react-day-picker` with a minimal custom calendar.** Effort: **~4 hr**. Saves ~20 KB JS + ~20 KB CSS + ~90 lines of CSS overrides in `globals.css`. Only worth it if (6) does not get you where you want to be. The existing calendar is a standard month grid with "has event" dots. That is maybe 80 lines of hand-written JSX plus 20 lines of CSS.
8. **Precompute event dates at build time.** Effort: **~30 min**. Store `timestamp` and `month` on each entry in `events.json` (or derive once in a server component) so `parseEventDate` does not run per-render in the browser.
9. **`next/dynamic` the calendar island.** Effort: **~15 min**. Only after (6). Load the `DayPicker` below the fold with `ssr: false` and a lightweight skeleton, so it does not block initial hydration.
10. **Tighten `next.config.js` remote image patterns.** Effort: **~10 min**. List the actual event image hosts (`*.lumacdn.com`, `*.campuslabs.com`, `lh3.googleusercontent.com`) instead of `**`. No perf change directly, but it lets you reason about cache behavior and fail loudly if a new host sneaks in.

**Tier 2 total: ~7 to 8 hours. Expected result: home-page JS payload down another ~40 to 60 KB, hydration cost cut roughly in half, calendar interaction snappier.**

### Tier 3. Only if you still have a complaint after Tiers 1 and 2.

11. **Kill `RotatingBadge` entirely.** Effort: **~10 min**. If it is still causing scroll jank after (3) and (5), just delete it. It is not load-bearing.
12. **Refactor `Navbar` dropdown to uncontrolled / CSS-only.** Effort: **~1 hr**. Navbar is on every page. Turning it into a server component with a tiny `<details>`-based dropdown removes the last always-hydrated component from every route.
13. **Local-host the remote event images.** Effort: **~2 hr** + ongoing maintenance. Download to `public/images/events/` at content update time. Saves the first-hit optimizer roundtrip. Probably not worth it unless events change infrequently.

### Dependency audit

Nothing is actively duplicated or oversized beyond what I already called out. `date-fns@4` is fine if you only import the couple of helpers you actually use (check that `isSameDay` is not pulling in the whole package; `import { isSameDay } from 'date-fns/isSameDay'` is safest). No framer-motion, no moment, no lodash, no massive icon pack. Inventory is clean.

---

## 3. Astro Migration Analysis

### Static vs interactive, honestly

Walking the app:

- **Fully static** (no state, no effects, no listeners): `Hero`, `PillarCard`, `PortfolioCard`, `EcosystemDirectory`, `Footer`, all of `/learn`, all of `/portfolio`, all of `/ecosystem`, most of `/build`.
- **Trivially interactive** (a dropdown, a link): `Navbar`. Fine as vanilla JS or `<details>`.
- **Animation only**: `RotatingBadge`. Pure CSS could replace the JS parts.
- **Genuinely stateful**: `EventsSection`'s calendar + filter, and that is it. One component.
- **Global effect**: `SmoothScroll`, which I am recommending you delete anyway.

Realistically, **~90% of the rendered surface is static content and ~10% is the calendar filter UI**. This is textbook Astro-islands territory.

### The case for Astro

- Zero-JS-by-default means every route except the one with the calendar ships essentially no React. That is probably a 60 to 80 KB gzipped JS reduction on `/learn`, `/portfolio`, `/ecosystem`, `/build` versus the current Next setup.
- The events calendar maps cleanly to a single `<EventsCalendar client:visible />` React island. You would keep the existing JSX almost verbatim.
- Static marketing pages built with `.astro` files are genuinely faster to author once you get past the ramp-up. Scoped styles, slots, and server-only data fetching are nice.
- `@astrojs/image` / `astro:assets` handles the image pipeline well, though honestly so does `next/image` once you stop using CSS backgrounds.

### The case against Astro (for this site, right now)

- **The top three issues on this audit are all fixable inside Next without touching the framework.** Images, Lenis, and the badge are `~2 to 3 hours` of work and recover most of the perceived perf. Migration recovers the remainder, not the bulk.
- **Migration is not free.** Rewriting five routes, rewiring the layout, moving fonts, reworking the Navbar dropdown, replumbing `next/image` calls to `astro:assets`, re-testing every page, and redoing deployment config is realistically **2 to 4 days of focused work**, not an afternoon. Plus the cost of anyone on the team who knows Next but not Astro ramping up.
- **You would be migrating the calendar as a React island anyway.** So the hardest thing to rewrite does not actually get rewritten, it just moves. The Tier 2 fix (server shell + small client island) is architecturally identical to what you would do in Astro, and you can do it in Next today in ~2 hours.
- **`/build` already has a dynamic "next session" concept** that reads from a TypeScript data file. That is trivial to port, but it is a reminder that as soon as this site grows a CMS, a form, auth, or any real data layer, Next's ecosystem (server actions, route handlers, middleware, ISR) is meaningfully ahead of Astro's. You would be migrating away from features you will probably want back within a year.
- **Next 15 + App Router already does most of what Astro promises** when you use it correctly. Server components, streaming, partial prerendering. The current codebase just does not use any of that, which is a code problem, not a framework problem.

### Recommendation

**Do not migrate to Astro. Fix the current stack.**

Concretely: do Tier 1 this week (a single afternoon), then do Tier 2 items 6, 8, and 9 next week (one more afternoon). That is ~5 hours of work and it will get you to roughly the same place an Astro migration would, without the 2 to 4 day rewrite and without giving up the Next ecosystem for when this site grows real features.

The one thing that would change my mind: if you are planning to add a lot more static content pages (ten or more article/case-study style routes with almost no interactivity), then Astro's zero-JS default starts to pay compounding dividends, and it becomes worth revisiting. At today's five-route scope it does not.

---

## Appendix: File Pointers

- [app/components/Hero.tsx](app/components/Hero.tsx) raw CSS `background-image` on the 18 MB hero PNG. Fix first.
- [app/components/EventsSection.tsx](app/components/EventsSection.tsx) 161-line client component, imports `react-day-picker` and `events.json`.
- [app/components/RotatingBadge.tsx](app/components/RotatingBadge.tsx) 20s spin, SVG textPath, `priority` image, fixed positioning.
- [app/components/SmoothScroll.tsx](app/components/SmoothScroll.tsx) Lenis RAF loop in root layout. Delete.
- [app/components/BroncoBuildIt.tsx](app/components/BroncoBuildIt.tsx) marked `'use client'` for no reason.
- [app/layout.tsx](app/layout.tsx) root layout, where `SmoothScroll` is mounted.
- [next.config.js](next.config.js) wildcard `remotePatterns`.
- [data/events.ts](data/events.ts) per-render `Date` construction.
- [public/images/cards/](public/images/cards/) the 55 MB of unoptimized PNGs.
