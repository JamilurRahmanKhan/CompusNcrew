# Social Media Video Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the first viewport of the social-media marketing page a full-screen, muted, continuously looping video with no overlay interface.

**Architecture:** Add a focused `SocialVideoHero` presentational component before the existing `SocialUniverse` content. Serve the supplied MP4 from `public/media/social/` so Next.js can deliver it directly, and style the component with a small colocated CSS Module.

**Tech Stack:** Next.js App Router, React, native HTML video, CSS Modules.

## Global Constraints

- Preserve all existing content below the new hero.
- Do not place any navigation, text, button, icon, control, gradient, or decorative overlay above the video.
- Use muted inline autoplay and continuous looping.
- Fill every viewport with centered `object-fit: cover` cropping.

---

### Task 1: Add the cinematic hero

**Files:**
- Create: `app/components/social-video-hero/social-video-hero.tsx`
- Create: `app/components/social-video-hero/social-video-hero.module.css`
- Modify: `app/services/social-media-marketing/page.tsx`
- Create: `public/media/social/social-edited.mp4`

**Interfaces:**
- Produces: `SocialVideoHero(): JSX.Element`
- Consumes: public media URL `/media/social/social-edited.mp4`

- [x] **Step 1: Record the pre-change route structure**

Run: `Get-Content -Raw app/services/social-media-marketing/page.tsx`

Expected: the page returns only `<SocialUniverse />`.

- [x] **Step 2: Create the web-delivery video asset**

Create an optimized 1080p, muted H.264 copy of `C:\Users\Guest User\Downloads\Telegram Desktop\SOCIAL EDITED.mp4` at `public\media\social\social-edited.mp4`.

Expected: `public/media/social/social-edited.mp4` exists, remains 1920x1080, and is below 100 MB.

- [x] **Step 3: Implement the hero component**

Create a semantic section containing only this video element:

```tsx
<video autoPlay muted loop playsInline preload="metadata" aria-hidden="true">
  <source src="/media/social/social-edited.mp4" type="video/mp4" />
</video>
```

Style the section at `100vh` and `100svh`, with `overflow: hidden`, a dark loading background, and video dimensions of `100%` by `100%` using `object-fit: cover` and `object-position: center`.

- [x] **Step 4: Place the hero before existing content**

Update the route to return a fragment containing `<SocialVideoHero />` followed by `<SocialUniverse />`.

- [x] **Step 5: Verify types and production compilation**

Run: `npm run typecheck`

Expected: exit code 0.

Run: `npm run build`

Expected: exit code 0 and `/services/social-media-marketing` remains statically generated.

- [x] **Step 6: Verify responsive playback in the browser**

Inspect the route at a desktop viewport and at `390 × 844`.

Expected: the first viewport contains only the video, the video is playing and muted, no controls are visible, there is no horizontal overflow, and scrolling reveals the existing content.

- [ ] **Step 7: Commit the focused implementation**

```bash
git add app/components/social-video-hero app/services/social-media-marketing/page.tsx public/media/social/social-edited.mp4 docs/superpowers/specs/2026-08-13-social-video-hero-design.md docs/superpowers/plans/2026-08-13-social-video-hero.md
git commit -m "feat: add fullscreen social video hero"
```
