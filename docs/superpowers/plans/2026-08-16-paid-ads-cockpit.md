# Paid Ads Cockpit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current `/paid-ads` content with a responsive, light paid-media cockpit that preserves CompassNCrew's global navigation, builds the analytics UI in code, continuously rotates Google and Meta ad previews, and loops the supplied ad-engine animation without its green background.

**Architecture:** Keep `app/paid-ads/page.tsx` as the route entry and rebuild `PaidAdsStudio` as the server-rendered page composition. Isolate animation state in a small client component and a framework-free rotation controller. Keep content in typed data, render charts as lightweight SVG, and preprocess the large chroma-key GIF into a transparent WebM plus a static poster.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS Modules, inline SVG, Node scripts, FFmpeg, Node test runner through `tsx`.

## Global Constraints

- Preserve the existing CompassNCrew global navigation; replace everything below it on `/paid-ads`.
- Recreate the supplied `paid-ads-ui.jpg` layout and visual hierarchy, but do not embed that screenshot in the page.
- Build headings, metrics, cards, charts, feature rows, status chips, and device frames as semantic HTML/CSS.
- Use only the supplied assets in `public/paid-ads`; do not fetch remote images.
- Preview slides auto-cycle indefinitely with no arrows, dots, tabs, pagination, or other visible controls.
- Pause timers while the document is hidden, dispose timers on unmount, and show a stable first frame when reduced motion is requested.
- The ad-engine media must have no visible green background. Use transparent WebM in supported browsers and a clean poster if playback fails.
- All images require meaningful `alt` text unless decorative, in which case use `alt=""`.
- Prevent horizontal page overflow at every verification viewport.
- Before implementation, read the local Next.js 16 documentation required by `AGENTS.md`, especially the App Router image and video guidance under `node_modules/next/dist/docs`.

---

## Task 1: Establish the asset pipeline and structural guard

**Files:**
- Create: `scripts/process-paid-ads-engine.mjs`
- Create: `scripts/check-paid-ads-page.mjs`
- Modify: `package.json`
- Generate: `public/paid-ads/ad-engine-alpha.webm`
- Generate: `public/paid-ads/ad-engine-poster.png`

- [ ] Add a structural check in `scripts/check-paid-ads-page.mjs` that verifies all required source assets exist and are non-empty:
  - `background-paid-ads.png`
  - `ad-engine.gif`
  - `google-ads-1.jpg`, `google-ads-2.jpg`, `google-ads-3.jpg`
  - `meta-ads-1.jpg`, `meta-ads-2.jpg`, `meta-ads-3.jpg`
  - `google-ads-logo.png`, `google-logo.png`, `meta-logo.png`
  - `facebook-like-icon.png`, `facebook-love-icon.png`, `arrow-icon.png`
- [ ] In the same check, require the not-yet-generated `ad-engine-alpha.webm` and `ad-engine-poster.png`. Run `node scripts/check-paid-ads-page.mjs` and confirm it fails specifically because those outputs do not exist yet.
- [ ] Implement `scripts/process-paid-ads-engine.mjs` with `spawnSync` argument arrays, not a shell-built string. Resolve FFmpeg from `ffmpeg` on PATH and fail with a clear message when unavailable.
- [ ] Generate transparent video with the filter chain `colorkey=0x00ff00:0.24:0.08,format=yuva420p,scale=720:-2:flags=lanczos`, VP9 (`libvpx-vp9`), `-auto-alt-ref 0`, and CRF 34. Generate the poster from the first processed frame as RGBA PNG.
- [ ] Verify the WebM and poster exist, have non-zero dimensions, and that the WebM is smaller than the 38 MB GIF.
- [ ] Add package scripts:
  - `paid-ads:assets`: `node scripts/process-paid-ads-engine.mjs`
  - `test:paid-ads`: `tsx --test app/paid-ads/*.test.ts && node scripts/check-paid-ads-page.mjs`
- [ ] Re-run the structural check and confirm it now passes and prints one concise success line.
- [ ] Run `npm run paid-ads:assets` and inspect the poster for a clean edge without a green halo.
- [ ] Commit only the asset pipeline, generated deliverables, structural script, and package-script changes with message `build: add paid ads media pipeline`.

## Task 2: Model paid-ad content and test the rotation engine

**Files:**
- Create: `app/paid-ads/paid-ads-data.ts`
- Create: `app/paid-ads/ad-rotation.ts`
- Create: `app/paid-ads/ad-rotation.test.ts`

- [ ] In `paid-ads-data.ts`, define and export these types:

```ts
export type PaidAdsPlatform = "google" | "meta";

export interface AdPreview {
  id: string;
  platform: PaidAdsPlatform;
  image: string;
  alt: string;
  headline: string;
  body: string;
  metrics: readonly { label: string; value: string }[];
}

export interface PlatformPerformance {
  platform: PaidAdsPlatform;
  name: string;
  logo: string;
  metrics: readonly { label: string; value: string; change: string }[];
  trend: readonly number[];
}

export interface Capability {
  title: string;
  description: string;
}
```

- [ ] Export three Google preview records, three Meta preview records, two platform performance records, and four capability records. Use the supplied images and concise, believable demonstration copy. Label the data as demonstration content rather than client results.
- [ ] Write failing tests for a pure `createAdRotationController` using a fake scheduler. Cover: initial scheduling, index wraparound, pause cancelling the pending timer, resume scheduling one timer, and dispose preventing later callbacks.
- [ ] Implement these public interfaces in `ad-rotation.ts`:

```ts
export interface RotationScheduler {
  setTimeout(callback: () => void, delay: number): ReturnType<typeof setTimeout>;
  clearTimeout(handle: ReturnType<typeof setTimeout>): void;
}

export interface AdRotationController {
  start(): void;
  setPaused(paused: boolean): void;
  dispose(): void;
}

export function createAdRotationController(options: {
  itemCount: number;
  intervalMs: number;
  startDelayMs?: number;
  scheduler?: RotationScheduler;
  onIndexChange(index: number): void;
}): AdRotationController;
```

- [ ] Guard `itemCount <= 1`, make `start()` idempotent, clear any outstanding timer before rescheduling, and never fire after disposal.
- [ ] Run `npx tsx --test app/paid-ads/ad-rotation.test.ts` and confirm all rotation tests pass.
- [ ] Commit with message `test: add paid ads rotation model`.

## Task 3: Build the code-rendered analytics column

**Files:**
- Create: `app/paid-ads/platform-performance-card.tsx`
- Modify: `app/paid-ads/paid-ads-studio.module.css`
- Modify: `scripts/check-paid-ads-page.mjs`

- [ ] Extend the structural test to require an inline `<svg` chart, mapped platform records, and the absence of `paid-ads-ui.jpg` in page source. Run it and confirm it fails.
- [ ] Implement `PlatformPerformanceCard` as a server-compatible component accepting `PlatformPerformance` and rendering:
  - platform logo and name;
  - three statistic blocks;
  - green change badges;
  - a small inline SVG line chart generated from normalized `trend` points;
  - a compact “Create campaign” or “New campaign” action rail as non-interactive presentation, not a fake form.
- [ ] Add a typed `MiniTrendChart` helper in the same file. Set `role="img"` and an accessible label containing the platform name.
- [ ] Implement the left-column styles: white glass cards, pale blue/lilac borders, subtle blue shadows, 18–22 px radii, compact metric grid, and crisp graph strokes.
- [ ] Ensure the cards do not depend on viewport height and their text remains readable at 200% zoom.
- [ ] Run `node scripts/check-paid-ads-page.mjs` and `npm run typecheck`.
- [ ] Commit with message `feat: build paid ads analytics cards`.

## Task 4: Build continuously rotating live ad previews

**Files:**
- Create: `app/paid-ads/live-ad-previews.tsx`
- Modify: `app/paid-ads/paid-ads-studio.module.css`
- Modify: `scripts/check-paid-ads-page.mjs`

- [ ] Extend the structural check to require both platform preview groups, `visibilitychange`, reduced-motion handling, and a `<video` source pointing to `ad-engine-alpha.webm`. Confirm the check fails.
- [ ] Add `"use client"` to `live-ad-previews.tsx` and render two stacked phone-like preview cards from the typed preview arrays.
- [ ] Keep every slide mounted in an absolutely positioned layer so image decoding does not flash during transitions. Use `data-active`, `aria-hidden`, opacity, and a small translate/scale transition.
- [ ] Start Google at index 0 and Meta at index 1. Rotate every 3800 ms with Meta delayed by 1900 ms so both cards never change simultaneously.
- [ ] Instantiate one controller per platform in an effect. Pause both on `document.visibilitychange`, resume when visible, and dispose both in cleanup.
- [ ] Use `window.matchMedia("(prefers-reduced-motion: reduce)")`; when it matches, keep the first slide static and do not start controllers.
- [ ] Render the engine with:

```tsx
<video
  autoPlay
  muted
  loop
  playsInline
  poster="/paid-ads/ad-engine-poster.png"
  aria-label="Animated paid advertising engine"
>
  <source src="/paid-ads/ad-engine-alpha.webm" type="video/webm" />
</video>
```

- [ ] Add an `onError` fallback that hides the failed video and exposes the poster image without collapsing the layout.
- [ ] Use CSS `object-fit: contain`, never crop the ad artwork, and set transition duration near 550 ms. Under reduced motion, remove transitions as well as rotation.
- [ ] Confirm there are no visible controls, dots, arrows, or pagination.
- [ ] Run `npm run test:paid-ads` and `npm run typecheck`.
- [ ] Commit with message `feat: add rotating live ad previews`.

## Task 5: Replace the page and make the cockpit responsive

**Files:**
- Modify: `app/paid-ads/paid-ads-studio.tsx`
- Replace: `app/paid-ads/paid-ads-studio.module.css`
- Modify: `app/paid-ads/page.tsx`
- Modify: `scripts/check-paid-ads-page.mjs`

- [ ] Extend the structural check to reject old dark-page section identifiers and require the new cockpit, analytics, live-preview, engine, capability, and disclosure regions. Confirm it fails against the old page.
- [ ] Replace `PaidAdsStudio` with a server composition beneath the existing global navigation:
  - full-bleed `background-paid-ads.png` foundation with a white/lilac overlay for contrast;
  - left analytics column containing eyebrow, hero title, supporting copy, two performance cards, and four capabilities;
  - middle “Live Ad Previews” column containing `LiveAdPreviews`;
  - right engine showcase containing the looping transparent media and a compact “Meta Ads / Google Ads active” explanation;
  - bottom disclosure: “Demonstration content and interface concepts — not client dashboards or reported outcomes.”
- [ ] Use this exact hero copy:
  - Eyebrow: `All-in-One Ad Management`
  - Heading: `Run Smarter Ads. Get Better Results.`
  - Body: `Manage, test and optimize Meta and Google campaigns from one focused system.`
- [ ] Use semantic landmarks: one `main`, one `h1`, `section` headings, and list markup for capabilities. Do not duplicate the global navigation.
- [ ] Replace the CSS with page-scoped tokens and these responsive regimes:
  - `>= 1200 px`: three-column grid approximately `1.1fr 0.9fr 0.8fr`;
  - `900–1199 px`: analytics spans the first column, live previews and engine share the second; keep all important content above excessive whitespace;
  - `700–899 px`: single column, hero first, engine second, preview cards in a two-column row, analytics cards after previews;
  - `< 700 px`: single column, full-width cards, engine capped near 360 px, compact padding;
  - `< 420 px`: reduce radii/padding, stack metrics safely, maintain 44 px minimum tap targets on real links/buttons.
- [ ] Use `clamp()` for the heading and key spacing. Never use fixed desktop widths that create overflow.
- [ ] Preserve source-image aspect ratios with `object-fit: contain`; reserve aspect ratio boxes to avoid layout shift.
- [ ] Keep palette faithful to the supplied UI: near-white, lilac, cobalt blue, cyan, and small green active indicators. Avoid the previous black editorial theme.
- [ ] Update route metadata in `page.tsx` to describe paid advertising management and campaign creative services.
- [ ] Run `npm run test:paid-ads`, `npm run typecheck`, and `npm run build`.
- [ ] Commit with message `feat: replace paid ads page with responsive cockpit`.

## Task 6: Browser verification, motion QA, and final hardening

**Files:**
- Modify as defects require: `app/paid-ads/paid-ads-studio.tsx`
- Modify as defects require: `app/paid-ads/live-ad-previews.tsx`
- Modify as defects require: `app/paid-ads/paid-ads-studio.module.css`
- Modify as defects require: `scripts/check-paid-ads-page.mjs`
- Create: `artifacts/paid-ads/` screenshots if the directory is already an accepted project artifact location; otherwise keep screenshots outside Git.

- [ ] Start the app using the repository's normal dev command and open `/paid-ads` in a real browser.
- [ ] Capture and inspect screenshots at 1440×900, 1280×800, 1024×768, 768×1024, and 390×844.
- [ ] At each viewport confirm: navigation is unchanged, heading is readable, both platform previews are identifiable, engine is visible, no content overlaps, and no horizontal scrolling exists.
- [ ] Run this browser assertion at each width: `document.documentElement.scrollWidth <= document.documentElement.clientWidth`.
- [ ] Observe at least two full cycles. Verify three distinct Google creatives and three distinct Meta creatives appear, transitions do not synchronize, and no controls are visible.
- [ ] Switch tabs for at least one interval and return. Verify previews resume without skipping rapidly or creating duplicate timers.
- [ ] Emulate reduced motion and reload. Verify the first slide stays static, transitions are removed, the engine poster remains visually meaningful, and all information stays accessible.
- [ ] Disable or rename the WebM temporarily in the test environment and confirm the poster fallback retains the right-column composition.
- [ ] Inspect the browser console for hydration errors, missing assets, timer warnings, and accessibility warnings; fix every issue introduced by this page.
- [ ] Verify keyboard focus remains visible on global navigation and any real page links; decorative campaign rails must not enter the tab order.
- [ ] Run the final command set and capture clean output:

```powershell
npm run paid-ads:assets
npm run test:paid-ads
npm run typecheck
npm run build
git diff --check
```

- [ ] Review `git status --short` and ensure no unrelated user work or temporary screenshots are staged.
- [ ] Commit final QA fixes with message `fix: harden paid ads cockpit experience` only if Task 6 produced source changes; otherwise do not create an empty commit.

## Completion Criteria

- `/paid-ads` contains none of the old dark editorial experience below the global navigation.
- The new page matches the supplied cockpit's hierarchy, color, density, and three-part composition without using the reference screenshot as UI.
- Google and Meta previews auto-cycle forever, independently and accessibly, with no visible controls.
- The engine loops with no green background and has a robust poster fallback.
- Desktop, tablet, and mobile layouts expose the same information without clipping or overflow.
- Structural tests, rotation tests, typecheck, build, and browser checks all pass.
