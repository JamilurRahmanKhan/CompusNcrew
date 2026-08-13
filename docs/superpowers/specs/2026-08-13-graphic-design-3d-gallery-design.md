# Graphic Design 3D Gallery — Experience Design

## Objective

Replace `/services/graphic-design` with a lightweight, responsive Three.js exhibition inspired by the spatial interaction model of ThevertMenthe. The result must remain a CompassNCrew experience: colorful commercial design work is the focus, while the monochrome sketch character and gallery architecture frame that work.

## Approved Direction

- Use a lightweight Three.js scene rather than a CSS perspective simulation or physics-heavy game.
- Keep a small, visible, sketch-like black walking character in third-person view.
- Support keyboard movement on desktop and a translucent virtual joystick on touch devices.
- Open portfolio details inside the gallery instead of navigating away.
- Place the four primary services on the front wall.
- Replace the current graphic-design page completely.

## Experience Structure

### Entry

The route opens directly into a full-viewport exhibition. A short loading layer shows progress while textures and the renderer initialize. When ready, the gallery fades in and a compact control guide appears. The guide dismisses automatically after movement and remains available from a help control.

The site navigation remains accessible above the experience, but uses a restrained transparent treatment so it does not compete with the gallery. The page itself does not vertically scroll while the exhibition is active.

### Gallery

The room is a long, bright exhibition hall with:

- white plaster walls and floor;
- black frame, railing, and roof-line details;
- soft directional and ambient lighting;
- a fixed front wall visible from the entrance;
- four framed portfolio works distributed across the side walls;
- repeated architectural details that create depth without expensive geometry.

The existing portfolio images are used as emissive-safe texture maps:

1. Coffee campaign
2. Gaming controller
3. Berry shampoo
4. Raspberry lemonade

The front wall presents the CompassNCrew Design Studio name, a concise positioning statement, and the service list:

- Brand identity
- Digital design
- Campaign creative
- Packaging & editorial

### Character and Camera

The character is a deliberately abstract black scribble silhouette made from lightweight geometry and line/sprite details. It has a large textured head, small torso, short limbs, and a soft floor shadow. It remains near the lower center of the frame while the world moves around it.

Movement uses acceleration and damping rather than instant translation. Forward/back movement changes the character position along the room; left/right movement shifts laterally within safe room bounds. The character turns toward movement direction and receives a restrained walk cycle through limb rotation and vertical bob. The camera follows with smoothing and always looks slightly ahead of the character.

There is no collision physics engine. Room bounds and artwork interaction zones use simple numeric constraints and distance checks.

### Controls

Desktop:

- Arrow keys or WASD move the character.
- Enter opens the currently available portfolio item.
- Escape closes a detail panel or menu.
- A compact bottom legend communicates controls.

Mobile and touch:

- A translucent analog joystick sits in the lower-left safe area.
- A contextual `View work` button sits in the lower-right safe area.
- Dragging the joystick produces a normalized direction and movement strength.
- The browser page is locked against accidental scrolling while the joystick is active.

All controls have accessible labels and keyboard equivalents.

### Portfolio Interaction

Each artwork has a proximity zone. When the character enters it:

- the frame receives a subtle focus glow;
- a small label identifies the project;
- the contextual action changes to `View work`;
- Enter or the mobile action button opens the project.

The in-gallery detail panel overlays the scene without changing routes. It includes the full artwork, title, category, a short project description, and close/next/previous controls. Focus moves into the panel when opened and returns to the gallery action when closed. Background movement pauses while the panel is open.

## Technical Architecture

### Components

- `DesignGalleryExperience`: owns loading, menu, active project, help, and renderer lifecycle state.
- `DesignGalleryCanvas`: creates and disposes the Three.js scene, renderer, camera, lights, geometry, and texture maps.
- `CharacterController`: maintains position, velocity, facing, walk animation, and camera follow values.
- `GalleryControls`: translates keyboard and joystick input into a shared movement vector.
- `VirtualJoystick`: touch/pointer control with pointer capture and safe cancellation.
- `ProjectDetailPanel`: accessible modal-style in-gallery project presentation.
- `GalleryFallback`: static, keyboard-accessible portfolio and service presentation used when WebGL is unavailable.

### Data

Portfolio and service content lives in typed arrays outside the renderer implementation. Artwork records include texture URL, title, category, description, wall side, position, dimensions, and interaction radius. This keeps scene construction independent from content changes.

### Rendering

- One WebGL renderer with antialiasing enabled only on capable desktop devices.
- Device pixel ratio capped at 1.5 on desktop and 1 on mobile.
- Shared frame and architecture geometry/materials where practical.
- Standard image textures with anisotropy capped conservatively.
- No post-processing pipeline, realtime reflections, physics engine, or dynamically generated shadows.
- `requestAnimationFrame` runs only while the tab is visible; listeners and GPU resources are disposed on unmount.

### Responsive Quality Tiers

Desktop uses full decorative architecture, soft shadows, and longer camera smoothing. Mobile removes nonessential ceiling details, lowers pixel ratio, simplifies shadows, and shortens draw distance while preserving the same room, character, portfolio, and services wall.

## Visual Direction

The room uses the reference's graphic monochrome shell but introduces CompassNCrew's commercial design work as the only strong color. This contrast makes the portfolio feel curated rather than decorative. Typography remains clean and restrained. Interface controls use translucent off-white surfaces, black labels, thin borders, and minimal radius.

The character should feel hand-drawn rather than polished or mascot-like. Its motion is subtle and slightly elastic, but never comedic.

## Accessibility and Failure Modes

- A skip link provides immediate access to a non-3D portfolio list.
- WebGL detection selects the static fallback automatically when initialization fails.
- `prefers-reduced-motion` removes walk bob, camera lag, and animated panel transitions while preserving navigation.
- The project panel uses dialog semantics, focus trapping, Escape close, and descriptive image alternatives.
- Control labels remain readable at 200% zoom.
- Touch controls respect safe-area insets and minimum target sizes.
- Canvas failures are caught locally and do not crash the route.

## Verification

- Production build and TypeScript checks pass.
- Desktop keyboard movement, bounds, camera follow, proximity prompts, and detail panels are tested.
- Touch joystick is tested at narrow and tablet widths.
- WebGL fallback, reduced motion, focus return, Escape behavior, and page-scroll locking are tested.
- Visual screenshots are captured at the entrance, near artwork, front services wall, project panel, and mobile layout.
- Browser console is checked for renderer, hydration, texture, and resource-disposal errors.

## Out of Scope

- Multiplayer or shared visitors
- User accounts or saved gallery progress
- Physics-engine collision
- Audio narration or ambient soundtrack
- CMS editing interface
- Separate project detail routes
- Copying the reference site's artwork, branding, character assets, or source code
