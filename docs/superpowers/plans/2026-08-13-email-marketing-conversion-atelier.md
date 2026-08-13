# Email Marketing Conversion Atelier Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `/services/email-sms` with an email-marketing-only page that opens with a 20–25 second real-time 3D conversion story, supports immediate skipping and accessible fallbacks, then transitions into a premium responsive service and portfolio page.

**Architecture:** Keep the scrollable email-marketing document independent from the cinematic so it remains readable without WebGL or JavaScript. A client-side `EmailAtelierExperience` owns the finite experience state (`playing`, `skipping`, `transitioning`, `content`), while a pure timeline module maps elapsed time to scene phases and a separate Three.js runtime owns rendering and disposal. A small custom browser event tells the global header whether an immersive intro is covering the viewport without importing page-specific state into the navigation.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Three.js 0.185, CSS Modules, Lucide React, Node assertion scripts.

## Global Constraints

- The route describes email marketing exclusively; remove SMS language from visible copy and metadata.
- The cinematic is real-time code-driven Three.js/WebGL, not a video.
- Target full cinematic duration is 22 seconds, within the approved 20–25 second range.
- Play the cinematic on every route visit.
- Provide a persistent keyboard-accessible **Skip introduction** control with a minimum 44 × 44 px touch target.
- Use visible ink navy `#17243A`–`#21314A`, raised navy near `#2A3C57`, parchment, burnished copper, soft amber, desaturated blue-grey, and muted green.
- Never render the scene as black-on-black, a cyberpunk control room, a node workflow, or a game interface.
- Keep cinematic captions in the DOM, no more than two short lines, with WCAG-compliant contrast.
- Render an authored mobile camera composition rather than scaling down desktop framing.
- Respect `prefers-reduced-motion` with a shortened crossfade sequence.
- If WebGL fails, preserve the story using a designed 2D correspondence fallback.
- Do not invent clients, testimonials, or performance results in the campaign archive.
- Preserve global site navigation and footer behavior after the immersive introduction.

---

## File structure

### New cinematic files

- `app/components/email-atelier/email-atelier-experience.tsx` — experience state machine, timing, skip, progress, scroll lock, and header event.
- `app/components/email-atelier/email-atelier-scene.tsx` — canvas lifecycle and the bridge between React state and the Three.js runtime.
- `app/components/email-atelier/atelier-runtime.ts` — Three.js scene construction, responsive camera layouts, frame rendering, resize, and disposal.
- `app/components/email-atelier/atelier-timeline.ts` — pure duration constants, phase lookup, caption selection, and normalized progress helpers.
- `app/components/email-atelier/email-atelier-fallback.tsx` — accessible 2D correspondence sequence for reduced-motion and unavailable WebGL.
- `app/components/email-atelier/email-atelier.module.css` — cinematic shell, captions, transition, responsive framing, and fallback styling.

### New service-page files

- `app/components/email-marketing/email-marketing-content.tsx` — semantic scrollable service page.
- `app/components/email-marketing/email-marketing-content.module.css` — editorial layout, correspondence comparison, lifecycle, archive, process, CTA, and responsive rules.
- `app/components/email-marketing/email-marketing-data.ts` — typed service, lifecycle, archive-placeholder, and process content.

### Modified files

- `app/services/email-sms/page.tsx` — route metadata and composition.
- `app/components/site-nav.tsx` — generic immersive-header visibility event handling.

### Verification files

- `scripts/check-email-atelier-timeline.mjs` — pure timeline behavior checks.
- `scripts/check-email-marketing-page.mjs` — source-level contract covering route composition, accessibility, content, palette, and responsive rules.

---

### Task 1: Establish the cinematic timeline contract

**Files:**
- Create: `app/components/email-atelier/atelier-timeline.ts`
- Create: `scripts/check-email-atelier-timeline.mjs`

**Interfaces:**
- Produces: `ATELIER_DURATION_MS`, `REDUCED_DURATION_MS`, `AtelierPhaseId`, `AtelierFrame`, `getAtelierFrame(elapsedMs, reducedMotion)`.
- Consumes: no browser or React APIs.

- [ ] **Step 1: Write the failing timeline check**

Create `scripts/check-email-atelier-timeline.mjs`:

```js
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync("app/components/email-atelier/atelier-timeline.ts", "utf8");

assert.match(source, /ATELIER_DURATION_MS\s*=\s*22_000/);
assert.match(source, /REDUCED_DURATION_MS\s*=\s*6_000/);
assert.match(source, /ignored/);
assert.match(source, /problem/);
assert.match(source, /atelier/);
assert.match(source, /conversion/);
assert.match(source, /transition/);
assert.match(source, /progress/);
assert.match(source, /caption/);
console.log("Email atelier timeline contract passed.");
```

- [ ] **Step 2: Run the check and verify it fails**

Run: `node scripts/check-email-atelier-timeline.mjs`

Expected: FAIL with `ENOENT` for `atelier-timeline.ts`.

- [ ] **Step 3: Implement the pure timeline**

Create `app/components/email-atelier/atelier-timeline.ts` with these public types and boundaries:

```ts
export const ATELIER_DURATION_MS = 22_000;
export const REDUCED_DURATION_MS = 6_000;

export type AtelierPhaseId =
  | "ignored"
  | "problem"
  | "atelier"
  | "conversion"
  | "transition";

export type AtelierFrame = {
  phase: AtelierPhaseId;
  progress: number;
  phaseProgress: number;
  caption: readonly [string, string];
};

const PHASES = [
  { id: "ignored", start: 0, end: 4_000, caption: ["You generated the lead.", "But the message lost them."] },
  { id: "problem", start: 4_000, end: 7_000, caption: ["Leads do not need more email.", "They need the right reason to respond."] },
  { id: "atelier", start: 7_000, end: 15_000, caption: ["Relevance is designed.", "Every message earns its next action."] },
  { id: "conversion", start: 15_000, end: 20_000, caption: ["Better emails do not chase attention.", "They turn attention into action."] },
  { id: "transition", start: 20_000, end: 22_000, caption: ["We turn leads into conversations.", "And conversations into clients."] },
] as const;
```

Implement `getAtelierFrame` so it clamps elapsed time, selects the correct phase, returns both total and local normalized progress, and maps reduced motion proportionally over `REDUCED_DURATION_MS`.

- [ ] **Step 4: Run the timeline check**

Run: `node scripts/check-email-atelier-timeline.mjs`

Expected: `Email atelier timeline contract passed.`

- [ ] **Step 5: Commit the timeline contract**

```bash
git add app/components/email-atelier/atelier-timeline.ts scripts/check-email-atelier-timeline.mjs
git commit -m "feat: define email atelier timeline"
```

---

### Task 2: Build the procedural Three.js atelier runtime

**Files:**
- Create: `app/components/email-atelier/atelier-runtime.ts`
- Create: `app/components/email-atelier/email-atelier-scene.tsx`
- Modify: `scripts/check-email-marketing-page.mjs`

**Interfaces:**
- Consumes: `AtelierFrame` from `atelier-timeline.ts`.
- Produces: `createAtelierRuntime(canvas): AtelierRuntime` and `<EmailAtelierScene frameRef onFailure />`.

- [ ] **Step 1: Write the failing scene contract**

Create `scripts/check-email-marketing-page.mjs` with initial assertions:

```js
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const runtimePath = "app/components/email-atelier/atelier-runtime.ts";
const scenePath = "app/components/email-atelier/email-atelier-scene.tsx";
assert.ok(existsSync(runtimePath), "atelier runtime should exist");
assert.ok(existsSync(scenePath), "atelier scene component should exist");

const runtime = readFileSync(runtimePath, "utf8");
assert.match(runtime, /THREE\.WebGLRenderer/);
assert.match(runtime, /powerPreference:\s*"high-performance"/);
assert.match(runtime, /setPixelRatio/);
assert.match(runtime, /renderFrame/);
assert.match(runtime, /dispose/);
assert.match(runtime, /mobile/);
console.log("Email marketing page contract passed.");
```

- [ ] **Step 2: Run the scene contract and verify it fails**

Run: `node scripts/check-email-marketing-page.mjs`

Expected: FAIL because the runtime and scene files do not exist.

- [ ] **Step 3: Implement scene construction in `atelier-runtime.ts`**

Define:

```ts
export type AtelierRuntime = {
  resize(width: number, height: number, pixelRatio: number): void;
  renderFrame(frame: AtelierFrame, timeSeconds: number): void;
  dispose(): void;
};

export function createAtelierRuntime(canvas: HTMLCanvasElement): AtelierRuntime;
```

The runtime must build these named groups from procedural geometry:

- `workspace` — matte navy floor, raised platform, and soft back wall.
- `leadCapsule` — frosted-glass capsule with five short signal labels drawn on one canvas texture.
- `genericEmail` and `ignoredTray` — parchment planes, grey type blocks, and three concise metrics.
- `audienceLens` — glass ring and a moving copper focal line.
- `messageDesk` — layered paper sheets and rearranging type bars.
- `designFrame` — border frame, hierarchy blocks, mobile preview, and one copper CTA.
- `deliveryClock` — radial timing ring and sender-trust seal.
- `inbox` — readable open-message panel with CTA response state.
- `conversionPath` — five physical markers labelled Lead, Reader, Reply, Meeting, Client.

Use `MeshStandardMaterial` and `MeshPhysicalMaterial` with the approved palette. Add a hemisphere light, a broad cool key, and a warmer copper area or point light. The scene background and fog must use visible navy rather than black.

Create separate camera targets for `desktop`, `tablet`, and `mobile`. Mobile frames one principal group per phase. Limit pixel ratio to `Math.min(devicePixelRatio, isMobile ? 1.35 : 1.75)`.

`renderFrame` must use the pure frame progress to animate object position, opacity, rotation, material warmth, and camera target. Do not start independent per-object timers.

- [ ] **Step 4: Implement the React canvas lifecycle**

Create `email-atelier-scene.tsx`:

```tsx
"use client";

type EmailAtelierSceneProps = {
  frameRef: React.RefObject<AtelierFrame>;
  onFailure: () => void;
};
```

Mount one canvas, call `createAtelierRuntime`, observe its container with `ResizeObserver`, update the renderer on resize, render through one `requestAnimationFrame` loop, catch WebGL construction failures through `onFailure`, and cancel/dispose everything on unmount.

- [ ] **Step 5: Run the scene contract and type checker**

Run: `node scripts/check-email-marketing-page.mjs`

Expected: PASS.

Run: `npm run typecheck`

Expected: exit code 0.

- [ ] **Step 6: Commit the scene runtime**

```bash
git add app/components/email-atelier/atelier-runtime.ts app/components/email-atelier/email-atelier-scene.tsx scripts/check-email-marketing-page.mjs
git commit -m "feat: build procedural email atelier scene"
```

---

### Task 3: Add the cinematic state machine, captions, skip, and fallback

**Files:**
- Create: `app/components/email-atelier/email-atelier-experience.tsx`
- Create: `app/components/email-atelier/email-atelier-fallback.tsx`
- Create: `app/components/email-atelier/email-atelier.module.css`
- Modify: `scripts/check-email-marketing-page.mjs`

**Interfaces:**
- Consumes: `getAtelierFrame`, `EmailAtelierScene`.
- Produces: `<EmailAtelierExperience children>`; dispatches `cnc:immersive-header` with `{ visible: boolean }`.

- [ ] **Step 1: Extend the failing contract**

Add assertions that the experience source contains:

```js
const experience = readFileSync("app/components/email-atelier/email-atelier-experience.tsx", "utf8");
assert.match(experience, /playing.*skipping.*transitioning.*content/s);
assert.match(experience, /Skip introduction/);
assert.match(experience, /prefers-reduced-motion/);
assert.match(experience, /cnc:immersive-header/);
assert.match(experience, /aria-live="polite"/);

const css = readFileSync("app/components/email-atelier/email-atelier.module.css", "utf8");
assert.match(css, /min-height:\s*100svh/);
assert.match(css, /44px/);
assert.match(css, /safe-area-inset/);
assert.match(css, /#17243a/i);
```

- [ ] **Step 2: Run the contract and verify it fails**

Run: `node scripts/check-email-marketing-page.mjs`

Expected: FAIL because the experience and stylesheet do not exist.

- [ ] **Step 3: Implement the experience state machine**

Use:

```ts
type ExperienceMode = "playing" | "skipping" | "transitioning" | "content";
```

On mount:

1. Dispatch `new CustomEvent("cnc:immersive-header", { detail: { visible: true } })`.
2. Lock body scrolling while saving the previous overflow value.
3. Detect reduced motion and WebGL support.
4. Start `performance.now()` and update one `AtelierFrame` ref.
5. At the appropriate duration, enter `transitioning` for 800 ms, then `content`.

On skip, immediately enter `skipping`, stop the cinematic timeline, apply a 450 ms exit, then reveal content. On cleanup, restore body overflow and dispatch `{ visible: false }`.

The DOM order must place the skip button first inside the cinematic shell, followed by the live caption, progress line, scene/fallback, and the service-page children. The content remains mounted so assistive technology and loading do not depend on WebGL, but it remains inert while the cinematic is active.

- [ ] **Step 4: Implement the 2D fallback**

Create `email-atelier-fallback.tsx` using layered semantic correspondence surfaces:

- generic email and unopened tray;
- lead-signal sheet;
- four atelier instruments;
- finished email and conversion path.

Drive the visible fallback state from `AtelierFrame.phase`; do not add a second timer. Reduced-motion uses the same states with crossfades only.

- [ ] **Step 5: Style the cinematic shell**

Use CSS custom properties:

```css
.experience {
  --atelier-ink: #17243a;
  --atelier-raised: #2a3c57;
  --atelier-paper: #f4efe5;
  --atelier-copper: #bd6a3d;
  --atelier-amber: #e2a35f;
  --atelier-success: #6f927e;
}
```

The cinematic is fixed to the viewport while active, uses `min-height: 100svh`, and keeps text above scene content through a restrained vignette localized behind the caption rather than a full-screen dark overlay. The skip target must use `min-width: 44px; min-height: 44px;` and safe-area offsets. Define explicit `transitioning` and `content` classes, plus mobile and reduced-motion blocks.

- [ ] **Step 6: Run contracts and type checks**

Run: `node scripts/check-email-atelier-timeline.mjs && node scripts/check-email-marketing-page.mjs`

Expected: both contract messages pass.

Run: `npm run typecheck`

Expected: exit code 0.

- [ ] **Step 7: Commit the cinematic shell**

```bash
git add app/components/email-atelier scripts/check-email-marketing-page.mjs
git commit -m "feat: add email atelier cinematic experience"
```

---

### Task 4: Make global navigation respond to immersive introductions

**Files:**
- Modify: `app/components/site-nav.tsx`
- Modify: `scripts/check-email-marketing-page.mjs`

**Interfaces:**
- Consumes: window event `cnc:immersive-header` with `CustomEvent<{ visible: boolean }>`.
- Produces: hidden and inert global header while an immersive introduction is visible.

- [ ] **Step 1: Extend the navigation contract**

Add:

```js
const nav = readFileSync("app/components/site-nav.tsx", "utf8");
assert.match(nav, /cnc:immersive-header/);
assert.match(nav, /immersiveIntroVisible/);
assert.match(nav, /inert=/);
assert.match(nav, /aria-hidden=/);
```

- [ ] **Step 2: Run the contract and verify it fails**

Run: `node scripts/check-email-marketing-page.mjs`

Expected: FAIL because the navigation does not yet listen for the generic event.

- [ ] **Step 3: Add generic immersive-header state**

In `SiteNav`, add `immersiveIntroVisible` state and a mount effect:

```ts
useEffect(() => {
  const onImmersiveHeader = (event: Event) => {
    setImmersiveIntroVisible((event as CustomEvent<{ visible: boolean }>).detail.visible);
  };
  window.addEventListener("cnc:immersive-header", onImmersiveHeader);
  return () => window.removeEventListener("cnc:immersive-header", onImmersiveHeader);
}, []);
```

Combine it with the existing social hero visibility state:

```ts
const headerHidden = (socialHeroVisible || immersiveIntroVisible) && !open;
```

Use `headerHidden` for `aria-hidden`, `inert`, opacity, pointer events, and translate. Do not change other route color behavior.

- [ ] **Step 4: Run contract and typecheck**

Run: `node scripts/check-email-marketing-page.mjs && npm run typecheck`

Expected: both exit successfully.

- [ ] **Step 5: Commit navigation integration**

```bash
git add app/components/site-nav.tsx scripts/check-email-marketing-page.mjs
git commit -m "feat: coordinate immersive page navigation"
```

---

### Task 5: Build the email-marketing content model and route composition

**Files:**
- Create: `app/components/email-marketing/email-marketing-data.ts`
- Create: `app/components/email-marketing/email-marketing-content.tsx`
- Modify: `app/services/email-sms/page.tsx`
- Modify: `scripts/check-email-marketing-page.mjs`

**Interfaces:**
- Produces: `emailServices`, `lifecycleStages`, `campaignSlots`, `emailProcess`; `<EmailMarketingContent />`.
- Consumes: `<EmailAtelierExperience>`.

- [ ] **Step 1: Extend the page-content contract**

Add assertions:

```js
const page = readFileSync("app/services/email-sms/page.tsx", "utf8");
assert.match(page, /EmailAtelierExperience/);
assert.match(page, /EmailMarketingContent/);
assert.doesNotMatch(page, /SMS|sms/);

const content = readFileSync("app/components/email-marketing/email-marketing-content.tsx", "utf8");
for (const phrase of [
  "Emails that turn interest into action.",
  "The conversion gap",
  "Email strategy",
  "Copywriting",
  "Email design",
  "Lifecycle sequences",
  "Testing and optimization",
  "Campaign Archive",
  "Your leads are already listening.",
]) assert.match(content, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
assert.doesNotMatch(content, /SMS|text message/i);
```

- [ ] **Step 2: Run the contract and verify it fails**

Run: `node scripts/check-email-marketing-page.mjs`

Expected: FAIL because the email-marketing content component does not exist.

- [ ] **Step 3: Create typed content data**

Export readonly arrays with these exact titles:

```ts
export const emailServices = [
  "Email strategy",
  "Copywriting",
  "Email design",
  "Lifecycle sequences",
  "Testing and optimization",
] as const;

export const lifecycleStages = [
  "New lead", "Welcome", "Education", "Trust", "Offer", "Follow-up", "Client",
] as const;
```

Each service includes a short outcome-focused explanation. Each lifecycle stage includes `customerNeed`, `message`, and `intendedAction`. Add three honest portfolio placeholders labelled by category, such as **B2B nurture system**, **Ecommerce lifecycle**, and **Service-business follow-up**, each marked **Project content coming soon** and containing no numerical result.

- [ ] **Step 4: Build the semantic service-page component**

Create these sections in order:

1. `contentHero` with headline, explanation, **Build my email system**, and **Explore our approach**.
2. `conversionGap` as one before/after correspondence table.
3. `serviceSystem` as five editorial chapters with distinct spatial roles.
4. `lifecycle` as one ordered interactive disclosure using native buttons and panels; first stage active by default.
5. `campaignArchive` with three honest placeholders ready for real projects.
6. `process` with the four approved steps.
7. `finalCta` with **Plan your email marketing system**.

Use real headings, lists, buttons, and links. Keep all essential information available without pointer hover.

- [ ] **Step 5: Replace route composition and metadata**

Update `page.tsx`:

```tsx
export const metadata: Metadata = {
  title: "Email Marketing — Turn Leads into Clients",
  description: "Email strategy, copywriting, design and lifecycle journeys that turn qualified leads into replies, meetings and clients.",
  alternates: { canonical: "/services/email-sms" },
};

export default function EmailMarketingPage() {
  return (
    <EmailAtelierExperience>
      <EmailMarketingContent />
    </EmailAtelierExperience>
  );
}
```

Remove the old image-led Email & SMS markup and unused imports.

- [ ] **Step 6: Run contract and typecheck**

Run: `node scripts/check-email-marketing-page.mjs && npm run typecheck`

Expected: both exit successfully.

- [ ] **Step 7: Commit route and content**

```bash
git add app/services/email-sms/page.tsx app/components/email-marketing scripts/check-email-marketing-page.mjs
git commit -m "feat: build email marketing service content"
```

---

### Task 6: Apply the premium editorial responsive design

**Files:**
- Create: `app/components/email-marketing/email-marketing-content.module.css`
- Modify: `app/components/email-marketing/email-marketing-content.tsx`
- Modify: `scripts/check-email-marketing-page.mjs`

**Interfaces:**
- Consumes: semantic sections and data from Task 5.
- Produces: responsive desktop, tablet, and mobile layouts with one visual system.

- [ ] **Step 1: Extend the styling contract**

Add:

```js
const contentCss = readFileSync("app/components/email-marketing/email-marketing-content.module.css", "utf8");
assert.match(contentCss, /#17243a/i);
assert.match(contentCss, /#f4efe5/i);
assert.match(contentCss, /#bd6a3d/i);
assert.match(contentCss, /@media\s*\(max-width:\s*900px\)/);
assert.match(contentCss, /@media\s*\(max-width:\s*600px\)/);
assert.match(contentCss, /min-height:\s*44px/);
assert.match(contentCss, /:focus-visible/);
assert.match(contentCss, /prefers-reduced-motion/);
```

- [ ] **Step 2: Run the contract and verify it fails**

Run: `node scripts/check-email-marketing-page.mjs`

Expected: FAIL because the content stylesheet does not exist.

- [ ] **Step 3: Establish the content token spine**

Use:

```css
.page {
  --ink: #17243a;
  --ink-raised: #2a3c57;
  --paper: #f4efe5;
  --paper-bright: #fffaf1;
  --copper: #bd6a3d;
  --amber: #e2a35f;
  --success: #6f927e;
  --muted: #6f7887;
  --line: rgba(23, 36, 58, 0.16);
}
```

Use one editorial serif already available through the site display token and one existing sans-serif body family. Large type uses tight tracking and balanced line wrapping.

- [ ] **Step 4: Style each section as one connected correspondence system**

- Content hero: parchment field, asymmetric headline, copper action, and a layered envelope specimen rather than a hero card grid.
- Conversion gap: one broad correspondence table with a cool ignored half and warm relevant half.
- Service system: an editorial spine with five chapters; vary scale and placement without changing typography or palette.
- Lifecycle: horizontal desktop correspondence path with a readable detail panel; vertical mobile sequence.
- Campaign archive: deep visible navy cabinet with layered project folders; one folder per mobile viewport and scroll snap only on the archive rail.
- Process: four restrained instrument references with strong whitespace.
- Final CTA: warm copper/amber field with dark ink copy and one primary action.

Use layered ambient plus direct shadows and restrained paper grain. Do not apply glassmorphism to every surface or use uniform rounded cards.

- [ ] **Step 5: Add responsive and accessibility rules**

At `900px`, collapse asymmetric grids, keep line length under 65 characters, and turn the archive into a swipeable rail. At `600px`, use one-column layouts, keep headings within the viewport, use 44 px controls, preserve safe-area bottom padding, and eliminate horizontal document overflow. Add visible focus styles and remove nonessential transforms under reduced motion.

- [ ] **Step 6: Run contract, typecheck, and production build**

Run: `node scripts/check-email-marketing-page.mjs && npm run typecheck && npm run build`

Expected: contract passes, TypeScript exits 0, and `/services/email-sms` is generated successfully.

- [ ] **Step 7: Commit the responsive design**

```bash
git add app/components/email-marketing scripts/check-email-marketing-page.mjs
git commit -m "style: create premium email marketing experience"
```

---

### Task 7: Browser-verify the cinematic, transition, and page

**Files:**
- Modify if defects are found: files from Tasks 2–6 only.

**Interfaces:**
- Verifies the complete route behavior; introduces no new public interface.

- [ ] **Step 1: Start or reuse the local development server**

Run: `npm run dev -- -p 3000`

Expected: route available at `http://localhost:3000/services/email-sms`.

- [ ] **Step 2: Verify the initial desktop experience at 1440 × 900**

Confirm through browser inspection:

- header is hidden and inert;
- cinematic occupies the viewport;
- visible background is medium-deep navy rather than near-black;
- caption contains no more than two lines;
- skip button is visible, labelled, and keyboard focusable;
- progress increases;
- the active atelier object is readable;
- there is no horizontal overflow.

- [ ] **Step 3: Verify automatic completion**

Let the experience run without interaction.

Expected: it reaches content between 20 and 25 seconds, restores body scrolling, reveals the site header, removes the cinematic from the interaction tree, and places the content hero at the top without a route change.

- [ ] **Step 4: Verify skip behavior**

Reload, activate **Skip introduction** with the keyboard after two seconds.

Expected: a smooth sub-second exit reveals the same content state, restores scrolling, and exposes the global header. No cinematic timer later reappears or changes the page.

- [ ] **Step 5: Verify tablet and mobile compositions**

Check `768 × 1024` and `390 × 844`:

- active object fills a useful portion of the cinematic;
- caption and skip remain inside safe areas;
- no more than one principal object competes for focus on mobile;
- content headings and tables remain readable;
- lifecycle becomes vertical;
- archive supports touch scrolling without moving the whole page horizontally;
- all controls meet the 44 px minimum.

- [ ] **Step 6: Verify reduced motion and WebGL fallback**

Emulate `prefers-reduced-motion: reduce` and separately force WebGL creation failure.

Expected: the designed 2D correspondence sequence appears, completes in approximately six seconds under reduced motion, retains captions and skip, then reveals the complete service page.

- [ ] **Step 7: Check browser errors and final contracts**

Run:

```bash
node scripts/check-email-atelier-timeline.mjs
node scripts/check-email-marketing-page.mjs
npm run typecheck
npm run build
git diff --check
```

Expected: all commands exit 0. Browser console contains no new runtime errors from the email atelier.

- [ ] **Step 8: Commit verified corrections**

```bash
git add app/components/email-atelier app/components/email-marketing app/components/site-nav.tsx app/services/email-sms/page.tsx scripts/check-email-atelier-timeline.mjs scripts/check-email-marketing-page.mjs
git commit -m "fix: verify email atelier across responsive layouts"
```

---

### Task 8: Final implementation review

**Files:**
- Review only: all files changed by Tasks 1–7.

**Interfaces:**
- Verifies conformance to the approved specification.

- [ ] **Step 1: Review scope and content integrity**

Confirm the page contains no SMS claims, fabricated project data, fake metrics, copied reference-site mechanics, video element, game controls, or AI-workflow nodes.

- [ ] **Step 2: Review motion and runtime ownership**

Confirm there is one cinematic clock, one animation-frame loop, one experience state machine, deterministic cleanup, and no object-specific `setTimeout` chains.

- [ ] **Step 3: Review responsive and accessibility acceptance criteria**

Confirm authored mobile cameras, readable visible-navy contrast, keyboard skip, header inertness, scroll restoration, reduced motion, WebGL fallback, semantic service content, and focus-visible states.

- [ ] **Step 4: Run the final evidence suite**

Run:

```bash
node scripts/check-email-atelier-timeline.mjs
node scripts/check-email-marketing-page.mjs
npm run typecheck
npm run build
git diff --check
```

Expected: every command exits 0 before reporting completion.
