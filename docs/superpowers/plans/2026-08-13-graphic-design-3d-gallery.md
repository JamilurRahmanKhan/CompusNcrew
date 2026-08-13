# Graphic Design 3D Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `/services/graphic-design` with a lightweight third-person Three.js gallery that showcases CompassNCrew portfolio work and services through keyboard and joystick navigation.

**Architecture:** A client-owned experience shell coordinates renderer lifecycle and overlays, while a focused Three.js scene module owns gallery geometry, character/camera motion, proximity detection, and cleanup. Pure controller math is kept separate from React/Three so movement, bounds, proximity, and responsive quality can be tested deterministically.

**Tech Stack:** Next.js 16.3, React 19, TypeScript 5.7, Three.js 0.185, CSS Modules, Node's built-in test runner via `tsx`.

## Global Constraints

- Keep a small visible sketch-like black walking character in third-person view.
- Desktop movement supports Arrow keys and WASD; Enter opens work; Escape closes overlays.
- Touch movement uses a translucent lower-left analog joystick and lower-right contextual action.
- Portfolio details open inside the gallery without route changes.
- The front wall contains Brand identity, Digital design, Campaign creative, and Packaging & editorial.
- Cap device pixel ratio at 1.5 on desktop and 1 on mobile.
- No physics engine, post-processing pipeline, realtime reflections, or audio system.
- Provide reduced-motion and WebGL-unavailable fallbacks.
- Do not copy the reference site's assets, branding, character files, or source code.

---

## File Structure

- `app/components/design-gallery/design-gallery.tsx` — experience state, loading, overlays, fallback, and orchestration.
- `app/components/design-gallery/design-gallery-canvas.tsx` — renderer lifecycle and animation loop.
- `app/components/design-gallery/gallery-scene.ts` — scene construction, artwork placement, character mesh, camera follow, proximity.
- `app/components/design-gallery/gallery-controller.ts` — pure movement, bounds, quality tier, and proximity helpers.
- `app/components/design-gallery/gallery-controls.ts` — keyboard state and shared movement vector.
- `app/components/design-gallery/virtual-joystick.tsx` — pointer-driven analog joystick.
- `app/components/design-gallery/project-detail-panel.tsx` — accessible in-gallery project panel.
- `app/components/design-gallery/gallery-data.ts` — typed services and portfolio records.
- `app/components/design-gallery/design-gallery.module.css` — full-screen UI, control overlays, responsive and reduced-motion styles.
- `app/components/design-gallery/gallery-controller.test.ts` — deterministic controller and quality tests.
- `app/services/graphic-design/page.tsx` — switch route to the gallery experience.
- `app/components/site-nav.tsx` — adapt nav treatment for the immersive gallery route.
- `package.json` — add the focused Node/tsx test script and development dependency.

---

### Task 1: Deterministic gallery controller

**Files:**
- Create: `app/components/design-gallery/gallery-controller.test.ts`
- Create: `app/components/design-gallery/gallery-controller.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `Vector2`, `CharacterState`, `GalleryBounds`, `QualityTier`, `stepCharacter(state, input, delta, bounds, reducedMotion)`, `findNearbyArtwork(position, artworks)`, and `getQualityTier(width, dpr)`.

- [ ] **Step 1: Add the focused test command**

Add `"test:gallery": "tsx --test app/components/design-gallery/*.test.ts"` and `tsx` as a development dependency.

- [ ] **Step 2: Write failing controller tests**

Cover acceleration, damping, room-bound clamping, facing direction, reduced-motion bob removal, nearest in-range artwork selection, and mobile/desktop DPR caps.

- [ ] **Step 3: Run the tests and verify RED**

Run: `npm run test:gallery`

Expected: FAIL because `gallery-controller.ts` does not exist.

- [ ] **Step 4: Implement minimal pure controller functions**

Use frame-rate-independent acceleration/damping, numeric boundary clamping, Euclidean proximity distance, and quality thresholds of mobile below 720px, balanced below 1100px, desktop otherwise.

- [ ] **Step 5: Run tests and verify GREEN**

Run: `npm run test:gallery`

Expected: all controller tests pass.

- [ ] **Step 6: Commit**

```powershell
git add package.json package-lock.json app/components/design-gallery/gallery-controller.ts app/components/design-gallery/gallery-controller.test.ts
git commit -m "feat: add gallery movement controller"
```

### Task 2: Typed gallery content and scene construction

**Files:**
- Create: `app/components/design-gallery/gallery-data.ts`
- Create: `app/components/design-gallery/gallery-scene.ts`

**Interfaces:**
- Consumes: `CharacterState`, `GalleryBounds`, and `QualityTier` from Task 1.
- Produces: `GalleryArtwork`, `portfolioWorks`, `designServices`, and `createGalleryScene(options): GallerySceneHandle`.
- `GallerySceneHandle` exposes `scene`, `camera`, `character`, `artworkFrames`, `updateCharacter(state, time, reducedMotion)`, `setFocusedArtwork(id | null)`, `resize(width, height)`, and `dispose()`.

- [ ] **Step 1: Define four real portfolio records**

Use the existing images in `/media/design-portfolio/` with title, category, description, wall side, z position, dimensions, and interaction radius.

- [ ] **Step 2: Build the monochrome room**

Create floor, side walls, front wall, roof beams, black rails, shared frame geometry, ambient/directional lights, and the front-wall service text rendered through canvas textures.

- [ ] **Step 3: Build the sketch character**

Create a black irregular head, torso, limbs, soft blob shadow, and grouped pivots for facing and walk animation. Use procedural geometry/materials only.

- [ ] **Step 4: Add frame textures and focus treatment**

Load existing images with `TextureLoader`, preserve their aspect ratios inside black frames, and expose focus emissive/scale changes through `setFocusedArtwork`.

- [ ] **Step 5: Implement cleanup**

Traverse created objects, dispose geometries/materials/textures, remove canvas textures, and make `dispose()` idempotent.

- [ ] **Step 6: Run typecheck**

Run: `npm run typecheck`

Expected: exit 0.

- [ ] **Step 7: Commit**

```powershell
git add app/components/design-gallery/gallery-data.ts app/components/design-gallery/gallery-scene.ts
git commit -m "feat: build graphic design gallery scene"
```

### Task 3: Renderer lifecycle and shared input

**Files:**
- Create: `app/components/design-gallery/gallery-controls.ts`
- Create: `app/components/design-gallery/design-gallery-canvas.tsx`

**Interfaces:**
- Consumes: `stepCharacter`, `findNearbyArtwork`, `getQualityTier`, `createGalleryScene`, and portfolio data.
- Produces: `GalleryInputController` with `setJoystick(x, y)`, `getVector()`, `subscribeAction(handler)`, `setEnabled(boolean)`, and `dispose()`.
- `DesignGalleryCanvas` props: `paused`, `reducedMotion`, `joystickVector`, `onReady`, `onNearbyArtworkChange`, and `onFatalError`.

- [ ] **Step 1: Implement keyboard input aggregation**

Map Arrow/WASD to a normalized shared vector, prevent default only while the experience is active, dispatch Enter through the action subscription, and clear keys on blur/visibility changes.

- [ ] **Step 2: Implement the renderer lifecycle**

Create the WebGL renderer only in the client effect, apply the quality-tier pixel ratio, append it to a container, create the scene handle, and start one RAF loop.

- [ ] **Step 3: Implement animation and camera updates**

Each visible frame reads keyboard plus joystick input, advances the pure character state, updates scene character/camera, detects nearby artwork, and renders. Pause updates when a panel is open or document is hidden.

- [ ] **Step 4: Implement resize and disposal**

Use `ResizeObserver`, update renderer/camera dimensions, cancel RAF, remove listeners, dispose controls and scene, dispose renderer, and remove the canvas on unmount.

- [ ] **Step 5: Implement WebGL failure reporting**

Catch renderer/scene initialization failures and call `onFatalError` without throwing through React.

- [ ] **Step 6: Run tests and typecheck**

Run: `npm run test:gallery && npm run typecheck`

Expected: both exit 0.

- [ ] **Step 7: Commit**

```powershell
git add app/components/design-gallery/gallery-controls.ts app/components/design-gallery/design-gallery-canvas.tsx
git commit -m "feat: add gallery renderer and controls"
```

### Task 4: Mobile joystick and accessible detail panel

**Files:**
- Create: `app/components/design-gallery/virtual-joystick.tsx`
- Create: `app/components/design-gallery/project-detail-panel.tsx`
- Create: `app/components/design-gallery/design-gallery.module.css`

**Interfaces:**
- `VirtualJoystick` props: `disabled` and `onChange(vector: Vector2)`.
- `ProjectDetailPanel` props: `project`, `onClose`, `onPrevious`, and `onNext`.

- [ ] **Step 1: Implement pointer-captured analog input**

Clamp the knob to a 44px radius, normalize output to -1..1, release on pointer up/cancel/lost capture, and expose an accessible label.

- [ ] **Step 2: Implement the project dialog**

Use `role="dialog"`, `aria-modal="true"`, labelled title/description, full artwork, category, previous/next buttons, close button, Escape handling, initial close-button focus, Tab focus containment, and focus return.

- [ ] **Step 3: Style the immersive UI**

Add fixed full-viewport layout, loading layer, bottom desktop legend, mobile joystick/action positions with safe-area insets, proximity label, translucent controls, modal layout, and responsive image treatment.

- [ ] **Step 4: Add reduced-motion styles**

Remove loading/overlay transitions and character-adjacent UI animation under `prefers-reduced-motion`.

- [ ] **Step 5: Run typecheck**

Run: `npm run typecheck`

Expected: exit 0.

- [ ] **Step 6: Commit**

```powershell
git add app/components/design-gallery/virtual-joystick.tsx app/components/design-gallery/project-detail-panel.tsx app/components/design-gallery/design-gallery.module.css
git commit -m "feat: add gallery touch controls and work panel"
```

### Task 5: Experience shell, fallback, and route replacement

**Files:**
- Create: `app/components/design-gallery/design-gallery.tsx`
- Modify: `app/services/graphic-design/page.tsx`
- Modify: `app/components/site-nav.tsx`

**Interfaces:**
- Consumes all components and data from Tasks 1–4.
- Produces the final `DesignGallery` route component.

- [ ] **Step 1: Build the experience state machine**

Track `loading | ready | fallback`, help visibility, nearby project, active project index, menu state, reduced-motion preference, and joystick vector.

- [ ] **Step 2: Wire contextual interactions**

Dismiss the guide after first movement, open nearby work via Enter or action button, pause the renderer while a panel/menu is open, and support previous/next without closing.

- [ ] **Step 3: Add the fallback portfolio**

Render a semantic services wall and four project cards when WebGL fails, plus a visually hidden skip target reachable before the canvas.

- [ ] **Step 4: Replace the route**

Change `page.tsx` from `DesignStudio` to `DesignGallery` while preserving metadata and canonical URL.

- [ ] **Step 5: Adapt the global navigation**

Treat the graphic-design route as a fixed immersive route, preserve menu/start access, prevent nav scrolling style changes from obscuring controls, and ensure overlay/menu state remains above the canvas.

- [ ] **Step 6: Run focused tests and typecheck**

Run: `npm run test:gallery && npm run typecheck`

Expected: both exit 0.

- [ ] **Step 7: Commit**

```powershell
git add app/components/design-gallery/design-gallery.tsx app/services/graphic-design/page.tsx app/components/site-nav.tsx
git commit -m "feat: launch immersive graphic design gallery"
```

### Task 6: Browser verification and production build

**Files:**
- Modify as required by verified defects only.

**Interfaces:**
- Consumes the completed route.
- Produces browser evidence for desktop, mobile, fallback, accessibility, and cleanup.

- [ ] **Step 1: Start the Webpack development server**

Run: `npm run dev`

Expected: server responds on the configured local port without compilation errors.

- [ ] **Step 2: Verify desktop entrance and movement**

At 1440×900, capture the entrance, move with WASD/arrows, verify character facing/walk, bounds, camera smoothing, and services wall visibility.

- [ ] **Step 3: Verify proximity and panel behavior**

Approach every frame, confirm correct labels, open via Enter, verify previous/next/close, Escape, focus containment, focus return, and paused movement.

- [ ] **Step 4: Verify mobile joystick**

At 390×844 and 768×1024, drag the joystick in multiple directions, confirm movement strength and release reset, action placement, safe areas, and absence of page scrolling/overflow.

- [ ] **Step 5: Verify reduced motion and fallback**

Emulate reduced motion and confirm bob/camera lag are removed. Force WebGL initialization failure locally and confirm the semantic fallback replaces the canvas without crashing.

- [ ] **Step 6: Check runtime logs**

Inspect browser console for hydration, WebGL, missing texture, repeated listener, and disposal errors.

- [ ] **Step 7: Run final verification**

Run: `npm run test:gallery && npm run typecheck && npm run build`

Expected: all commands exit 0.

- [ ] **Step 8: Commit verified fixes**

```powershell
git add app/components/design-gallery app/services/graphic-design/page.tsx app/components/site-nav.tsx package.json package-lock.json
git commit -m "fix: polish and verify design gallery"
```

