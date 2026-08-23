# Paid Ads Cockpit Design Specification

**Date:** 2026-08-16  
**Route:** `/paid-ads`  
**Status:** Approved design, pending written-spec review  
**Reference:** `public/paid-ads/paid-ads-ui.jpg`

## 1. Objective

Replace the entire current dark `/paid-ads` page with a responsive, light paid-ad operations cockpit inspired by the supplied reference image. The new experience must retain the existing CompassNCrew global navigation while reconstructing the page content as semantic, responsive code.

The page must communicate three things immediately:

1. CompassNCrew manages Google Ads and Meta Ads as one connected paid-media system.
2. The interface continuously demonstrates live ad creative changing inside platform-specific mobile previews.
3. The animated ad engine visually connects the two platforms into one coordinated service.

## 2. Approved Scope

- Replace every section currently rendered by `PaidAdsStudio`.
- Preserve the existing CompassNCrew global site navigation supplied by the root layout.
- Do not recreate the reference image's internal AdPilot navigation.
- Build all informational UI, metric cards, charts, connectors, labels and capability items in React and CSS.
- Use the supplied local logos and ad images rather than downloading external assets.
- Automatically rotate ads in both live-preview devices without visible controls.
- Loop the ad-engine animation indefinitely.
- Remove the chroma-green background from the supplied GIF through a local preprocessing step and serve an optimized transparent animation.
- Support desktop, laptop, tablet and mobile layouts without horizontal overflow.

The page is a portfolio-quality service demonstration, not a real connected advertising dashboard. Metrics must be presented as illustrative interface content, not client results.

## 3. Source Assets

All source assets are local under `public/paid-ads/`.

| Asset | Purpose |
| --- | --- |
| `background-paid-ads.png` | Full-page pale lavender/white background |
| `paid-ads-ui.jpg` | Visual reference only; never rendered as the page UI |
| `ad-engine.gif` | Source animation for the right-side ad engine |
| `google-ads-logo.png` | Google Ads identity in analytics and preview headers |
| `google-logo.png` | Decorative Google identity element |
| `meta-logo.png` | Meta identity in analytics and preview headers |
| `facebook-like-icon.png` | Decorative Meta engagement indicator |
| `facebook-love-icon.png` | Decorative Meta engagement indicator |
| `arrow-icon.png` | Decorative performance/growth accent where appropriate |
| `google-ads-1.jpg` to `google-ads-3.jpg` | Google preview rotation, in numerical order |
| `meta-ads-1.jpg` to `meta-ads-3.jpg` | Meta preview rotation, in numerical order |

The 38MB `ad-engine.gif` remains the untouched source. Implementation creates an optimized transparent derived asset plus a static fallback poster. No source image is overwritten.

## 4. Page Architecture

```text
Existing CompassNCrew navigation
└── Paid Ads Cockpit
    ├── Analytics / offer column
    │   ├── Service badge
    │   ├── Main headline
    │   ├── Supporting paragraph
    │   ├── Google Ads performance card
    │   ├── Meta Ads performance card
    │   └── Four service capabilities
    ├── Live Ad Previews column
    │   ├── Section label
    │   ├── Google Ads preview device
    │   └── Meta Ads preview device
    └── Ad Engine column
        ├── Transparent looping engine animation
        └── Static fallback poster
```

The cockpit occupies the main page and replaces the old strategy, creative systems, services, process and CTA sections. It can exceed one viewport on smaller displays, but desktop should read as one integrated composition rather than a series of sections.

## 5. Component Model

### 5.1 `PaidAdsExperience`

Owns the semantic page structure and the three responsive layout regions. It consumes static display data and does not own carousel timers.

### 5.2 `PaidAdsAnalytics`

Renders the badge, headline, supporting copy, both platform performance cards and four capability summaries. All visible text is HTML.

### 5.3 `PlatformPerformanceCard`

A reusable presentational component for Google and Meta. It receives:

- platform name and logo;
- three metric tiles;
- a trend-series array;
- a campaign-type list;
- a visual theme token.

The charts are coded SVG paths with accessible summaries rather than dashboard screenshots.

### 5.4 `LiveAdPreviews`

Groups the two preview devices and offsets their rotation schedules so they do not transition at the same time.

### 5.5 `AdPreviewPhone`

Builds a rounded mobile-screen card with:

- platform logo and name;
- active-status badge;
- sponsored-content header;
- one rotating ad creative;
- illustrative clicks, impressions and CTR values;
- a non-interactive “View details” visual affordance.

The component must never imply that the preview values are live client data.

### 5.6 `RotatingAdDeck`

Owns the ad sequence and transition state. It receives an ordered asset list, platform label, start delay, display duration and reduced-motion preference.

### 5.7 `AdEngineVisual`

Uses the optimized transparent animation with a static poster fallback. It remains decorative and is hidden from assistive technology because the surrounding content explains its meaning.

### 5.8 `paid-ads-data.ts`

Contains immutable metrics, capability copy, campaign labels and asset sequences. Keeping content out of component markup makes ordering and tests deterministic.

## 6. Visual System

### 6.1 Palette

- Page background: white to pale lavender from `background-paid-ads.png`.
- Primary text: deep navy/near-black.
- Supporting text: desaturated blue-gray.
- Primary accent: vivid blue.
- Secondary accent: violet.
- Google accents: blue, green and yellow used sparingly.
- Meta accents: electric blue with restrained violet.
- Positive metric badges: pale mint with green text.

### 6.2 Surfaces

- Cards use translucent white or near-white fills.
- Borders use low-contrast blue-gray lines.
- Shadows are broad, soft and cool-toned.
- Desktop corner radii fall between 18px and 28px.
- Mobile radii scale down without becoming sharp.
- No heavy black panels from the current design remain.

### 6.3 Typography

- Reuse the project's existing sans-serif stack.
- Headline uses a strong, compact weight and tight leading.
- “Better Results.” receives a blue-to-violet gradient treatment.
- Labels and metric captions use restrained tracking rather than all-caps everywhere.
- Minimum informative text size is 12px at the smallest supported viewport.

### 6.4 Decorative Elements

Connector lines, target forms, growth arcs and floating platform icons are created with CSS or inline SVG. They remain visually subordinate, `pointer-events: none`, and hidden from assistive technology.

## 7. Animation Specification

### 7.1 Ad rotation

- Each platform has exactly three supplied preview images.
- Sequence order is numerical: `1`, `2`, `3`, then wraps to `1`.
- Each ad remains stable for 3.8 seconds.
- Transition duration is approximately 550ms.
- Transition combines vertical travel, opacity and a small scale change.
- Google begins immediately.
- Meta begins approximately 1.9 seconds later.
- There are no visible dots, arrows, progress bars or manual controls.
- Rotation pauses when `document.visibilityState` is not `visible`.
- Timers are disposed when components unmount.
- With `prefers-reduced-motion: reduce`, the first ad stays static and no interval starts.

### 7.2 Ad-engine loop

- The animation loops indefinitely.
- Chroma green is removed offline; runtime CSS must not attempt chroma keying.
- The preferred output is a transparent WebM when the local conversion toolchain can produce browser-compatible alpha video.
- A transparent animated WebP is the fallback output format if alpha WebM is unavailable.
- A static transparent poster is always generated for reduced motion and load failure.
- The derived animation should target a substantial reduction from the 38MB source while remaining sharp at its largest rendered size.

### 7.3 Micro-interactions

Cards may lift by no more than 3px on pointer hover. Decorative icons may drift subtly only when reduced motion is not requested. The cockpit must not introduce scroll-jacking, cursor effects or continuous background motion.

## 8. Responsive Layout

### 8.1 Large desktop: 1200px and above

- Three-column grid approximating 40% / 28% / 32%.
- Analytics cards overlap decorative accents but never each other.
- Both preview devices remain fully visible.
- Ad engine is vertically centered and visually comparable in height to the stacked previews.
- The primary composition should fit near one viewport at common 1440×900 and 1280×800 sizes beneath the global navigation.

### 8.2 Compact desktop and tablet landscape: 900px–1199px

- Analytics spans the first row.
- Preview column and engine share the second row.
- Capability items remain four columns where space permits, otherwise two columns.
- Decorative connectors simplify before content becomes compressed.

### 8.3 Tablet portrait: 700px–899px

- Analytics fills the first row.
- The two previews form a two-column row when their minimum readable width is available.
- Engine appears beneath or alongside previews based on container width.
- No text may be scaled down merely to preserve the desktop arrangement.

### 8.4 Mobile: below 700px

Content order is:

1. badge, headline and supporting copy;
2. Google performance card;
3. Meta performance card;
4. capability grid;
5. live-preview heading;
6. Google preview;
7. Meta preview;
8. ad engine.

Cards use the viewport width minus safe-area padding. The capability list becomes two columns and may become one column below 360px. Preview creatives use `object-fit: cover` or `contain` per source aspect ratio without distortion. Horizontal scrolling is prohibited.

## 9. Accessibility and Semantics

- The page has one `<h1>` and logical heading order.
- Platform logos have informative alternatives when they communicate identity.
- Decorative images and SVG lines use empty alternatives or `aria-hidden="true"`.
- Automatic slide changes are not announced through live regions.
- The first visible ad provides sufficient accessible context in its image alternative.
- Status is not communicated by color alone; “Active” remains visible text.
- Focus indicators remain consistent with the global site.
- Reduced motion freezes both preview decks and uses the engine poster.
- Contrast must satisfy WCAG AA for informative text.

## 10. Failure and Loading Behavior

- Preview image failure reveals a branded placeholder inside the same device frame.
- The layout reserves image space to prevent cumulative layout shift.
- The engine poster displays before animation readiness and remains if animation fails.
- No JavaScript failure may remove the headline, platform metrics or service capabilities.
- All interface data is local and deterministic; no network API is introduced.

## 11. SEO and Content Integrity

- Preserve the existing canonical URL `/paid-ads`.
- Update metadata copy only if needed to reflect the unified cockpit message.
- Keep service claims qualitative unless a number is explicitly labelled as illustrative UI data.
- Add a visually subtle disclosure that preview metrics are demonstration data and not reported client outcomes.

## 12. Testing and Verification

### Automated

- Test sequence progression and wrap-around.
- Test independent Google and Meta start offsets.
- Test document-visibility pause and resume.
- Test timer cleanup on unmount.
- Test reduced motion prevents interval creation.
- Test all six preview asset paths are wired in deterministic order.
- Test both platform cards and all four capability items render.
- Run TypeScript validation.
- Run the production build.
- Run `git diff --check`.

### Visual and browser

Capture and compare the page at:

- 1440×900;
- 1280×800;
- 1024×768;
- 768×1024;
- 390×844.

At each viewport verify:

- no horizontal overflow;
- no clipped headline or controls;
- both platform identities are recognizable;
- preview creatives are not distorted;
- ad-engine animation does not cover content;
- page remains usable with reduced motion;
- no console errors or failed local assets;
- global CompassNCrew navigation remains functional.

## 13. Acceptance Criteria

The feature is complete when:

1. `/paid-ads` contains none of the previous dark studio sections.
2. The new page clearly matches the supplied light cockpit composition without using `paid-ads-ui.jpg` as rendered UI.
3. The left dashboard, charts and platform cards are coded components.
4. Google and Meta previews cycle through their three assigned ads automatically and forever without visible controls.
5. The ad engine loops without its green background and has a reduced-motion/static fallback.
6. The experience is readable and free of horizontal overflow at all required viewports.
7. Existing CompassNCrew navigation and metadata remain intact.
8. Automated checks, type checking, production build and visual browser verification pass.

