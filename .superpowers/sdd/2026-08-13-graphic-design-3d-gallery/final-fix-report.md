# Graphic Design 3D Gallery — Final Fix Report

Date: 2026-08-13

Branch: `codex/graphic-design-gallery`

Reviewed base: `50297d4`

Implementation commit: `a8cb509` (`fix: harden graphic design gallery lifecycle`)

## Status

READY. All four Important findings and safe Minor findings M1, M2, M3, and M4 from `final-review-report.md` are resolved. The final independent review found one additional synchronous texture-loader edge case; it was reproduced RED, fixed, verified GREEN, and re-reviewed with no actionable findings.

## Changes delivered

### I1 — Preserve analog joystick magnitude

- `stepCharacter` now keeps input magnitude below 1 while clamping overdriven input to full strength.
- The regression crosses the requested boundary: `GalleryInputController.setJoystick(0.25, 0)` → `getVector()` → `stepCharacter` and compares it with full deflection.
- A separate regression verifies magnitude 4 is clamped to the same target velocity as magnitude 1.

TDD evidence:

- RED: the partial-deflection regression observed the same full target velocity as full deflection (partial/full ratio 1 instead of 0.25).
- GREEN: the partial input produces one-quarter of full-deflection first-frame velocity; overdriven input equals full input.

### I2 — Include every artwork texture in ready/fallback lifecycle

- `GallerySceneHandle` exposes a `ready` promise that combines all four artwork texture loads.
- Every `TextureLoader.load` now handles completion and failure. Failures carry the artwork id and original cause.
- Disposal safely handles late successful loads.
- The canvas keeps the loader visible until all four promises resolve, then renders one fully textured frame before dispatching `onReady`.
- Texture rejection routes through the same fatal shutdown and semantic fallback as renderer initialization failure.
- Synchronous loader throws are contextualized as a reachable scene-readiness rejection; an undefined placeholder is never dereferenced.

TDD evidence:

- RED: controlled texture tests showed no scene readiness contract and no error callback; the loader could be dismissed before the final request completed.
- GREEN: readiness remains pending after the first three completions and resolves only after the fourth; an injected async texture failure rejects readiness and selects fallback.
- Independent-review RED: an injected synchronous `TextureLoader.load` throw produced `Cannot set properties of undefined (setting 'colorSpace')` plus an `unhandledRejection`.
- Independent-review GREEN: the new regression receives exactly one contextual `ready` rejection with the original cause and records zero unhandled rejections.

### I3 — One-shot runtime failure boundary after readiness

- RAF updates/rendering, scheduling, visibility changes, ResizeObserver work, and `webglcontextlost` now run through one idempotent runtime boundary.
- Fatal shutdown cancels animation, removes listeners, disconnects resize observation, disposes controls/scene/renderer, removes the canvas, and calls `onFatalError` once.
- Cleanup is best-effort per resource so one disposal failure cannot prevent the rest.
- Explicit `fail(undefined)` remains a fatal event rather than being confused with ordinary shutdown.
- React effect cleanup retains direct listener/observer/frame cleanup and calls the same idempotent shutdown boundary.

TDD evidence:

- RED: readiness/runtime tests initially had no boundary or readiness observer to exercise, and post-ready failures could escape the effect.
- GREEN: a thrown post-ready render followed by resize and WebGL failures yields one cleanup and one fatal callback; a separate undefined-failure regression also yields one fatal callback.
- GREEN: readiness success order is exactly `render`, then `ready`; a thrown ready-frame render prevents `onReady` and enters the one-shot fatal path.

### I4 — Responsive, visible, accessible Help

- Added a mounted Help disclosure with a stable `gallery-controls-guide` target.
- The native Help button exposes `aria-controls`, `aria-expanded`, and state-specific accessible names.
- Fine-pointer copy documents WASD/arrows and Enter. Coarse-pointer copy documents dragging the joystick and tapping View work.
- The guide is a responsive, wrapping, scroll-constrained card at narrow/coarse breakpoints and remains usable at the 720 CSS-pixel effective width produced by 200% zoom on a 1440-pixel desktop viewport.
- Collapsing Help keeps focus on the button and hides the guide semantically and visually; it can be reopened.

TDD evidence:

- RED: the disclosure helper was missing, then the component module was missing; a temporary stub returned no accessible markup and failed the disclosure assertions.
- GREEN: static markup tests prove stable linkage, expanded/collapsed labels, mounted hidden state, and both keyboard/touch instruction groups.
- Browser RED before implementation: the Help button was visible at 390, 768, and 720 CSS pixels but the only guide was `display:none`, measured 0×0, and had no disclosure linkage.
- Browser GREEN measurements are recorded below.

### Minor findings

- M1: replaced horizontal-only mirroring with `facingAngle`; a Three.js integration regression transforms the rig’s local `-Z` world-forward axis and exactly matches forward, right, right-forward diagonal, and left controller inputs.
- M2: proximity consumes each artwork’s `interactionRadius`; a differing-radius regression proves a nearer out-of-radius item loses to a farther in-radius item.
- M3: native Edge `Tab` traversal exposes the Skip 3D link with `:focus-visible`; native `Enter` activates fallback, removes the canvas, and moves focus to `#gallery-fallback` (`tabindex=-1`).
- M4: external-loop callback/value refs now synchronize after commit in the canvas, detail panel, and joystick. React Doctor reports no issues in the changed gallery files.

## Final automated verification

All commands were run from the isolated graphic-design-gallery worktree against the final implementation:

- `npm run test:gallery` — exit 0; 51 tests passed, 0 failed.
- `npm run typecheck` — exit 0.
- `npm run build` — exit 0; Vite child builds and Next 16.3 production build completed, TypeScript completed, and all 25 static pages generated.
- `npx -y react-doctor@0.9.11 . --scope files --base 50297d4 --no-dead-code --no-supply-chain --no-score --no-color --blocking error --no-warnings --max-duration 60` — exit 0; 13 changed files scanned; no issues found.
- `git diff --cached --check` — exit 0 before the implementation commit.
- Independent code review — initial synchronous loader finding fixed; focused re-review reported no actionable findings.

## Final production-browser verification

The reproducible verifier is `final-fix-evidence/verify-final-fixes.mjs`. It ran against `next start` in headless Microsoft Edge using the final production build. Structured results are in `final-fix-evidence/browser-verification.json` (generated `2026-08-13T08:03:40.308Z`). The temporary Playwright package was installed without changing the lockfile, then removed; the production server was stopped and port 3151 released.

### Help and responsive layout

- 390×844, coarse pointer: guide 288×90.375 CSS px, 14px text / 19.6px line height, touch instructions visible, keyboard instructions hidden, zero horizontal overflow, and no overlap with Help, joystick, or action controls.
- 768×1024, coarse pointer: guide 288×90.375 CSS px with the same semantic and layout checks.
- 720×450 at device scale factor 2 (1440-pixel desktop at 200% effective zoom), fine pointer: guide 288×98.75 CSS px, keyboard instructions visible, zero horizontal overflow, and no control overlap.
- At every viewport the button measured 44×44 CSS px, controlled `gallery-controls-guide`, changed from `aria-expanded=true` / “Hide gallery controls” to `aria-expanded=false` / “Show gallery controls”, kept keyboard focus, hid the guide, and reopened it.

Screenshots:

- `final-fix-evidence/help-390x844-touch.png`
- `final-fix-evidence/help-768x1024-touch.png`
- `final-fix-evidence/help-200-percent-equivalent-720x450.png`

### Texture lifecycle and fallback

- All four artwork image requests were held. While pending, the loader remained visible, the canvas remained mounted behind it, and Help was not exposed.
- After all four were released, the loader became hidden and the ready interface appeared with one canvas.
- Aborting the coffee artwork request selected the semantic fallback with zero canvases and all four projects; no uncaught page error occurred.

Screenshots:

- `final-fix-evidence/textures-pending.png`
- `final-fix-evidence/textures-ready.png`
- `final-fix-evidence/texture-error-fallback.png`

### Runtime failure and native skip-link evidence

- `WEBGL_lose_context` was available and invoked on the live canvas. The experience selected fallback, removed the canvas, retained all four projects, and produced no uncaught page error.
- Native keyboard traversal reached “Skip the 3D gallery” as the fifth focus stop; its focus-visible rectangle was 164.969×49 CSS px. Native Enter activation selected fallback and transferred focus to the fallback section.

Screenshots:

- `final-fix-evidence/runtime-context-loss-fallback.png`
- `final-fix-evidence/skip-3d-focused-native.png`
- `final-fix-evidence/skip-3d-activated-native.png`

## Concerns and limitations

- The build retains its existing non-blocking Vite warning that one generated automation chunk and the shared Three.js chunk exceed 500 kB. This is outside the reviewed gallery correctness scope.
- The deliberately aborted texture request logs the expected `net::ERR_FAILED` console resource error. There are no page errors.
- The first 390×844 browser context logged one generic 404 resource message while every artwork texture still completed and all assertions passed; the verifier did not retain the resource URL. No other responsive context logged it, and it did not affect the gallery lifecycle.
- Coarse-pointer checks use Edge touch emulation rather than physical mobile hardware.
- The pre-existing unstaged `package-lock.json` change was preserved and excluded from both commits.

## Unresolved review findings

None.
