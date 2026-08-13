# Social Media Video Hero Design

## Goal

Replace the opening experience of `/services/social-media-marketing` with a full-viewport cinematic video hero. This is the first isolated step of a later full-page redesign.

## Hero behavior

- The supplied `SOCIAL EDITED.mp4` fills the first visible viewport.
- Playback starts automatically, is muted, loops continuously, and uses inline playback on mobile.
- The video uses `object-fit: cover` and centered positioning, allowing slight side cropping on portrait screens.
- The opening viewport contains only the video. It has no site header, text, buttons, icons, controls, gradients, badges, chapter counters, sound controls, or other overlays.
- Existing social-media information remains below the video for now and becomes visible through normal vertical scrolling.

## Responsive contract

- The hero occupies `100svh` with a `100vh` fallback.
- The video covers the hero on desktop, laptop, tablet, and mobile without distortion.
- Native video controls remain disabled.
- `playsInline`, `muted`, `autoPlay`, and `loop` are set on the video element for reliable browser autoplay.

## Asset handling

- Create a web-delivery copy of the supplied file in the app's public media directory under a stable web-safe filename. Preserve the 1080p picture while removing unused audio and reducing transfer size.
- Use the native HTML video element rather than embedding a player library.
- Retain a solid dark background behind the video so loading never reveals an unrelated page color.

## Accessibility and performance

- Mark the decorative cinematic video as `aria-hidden` because it contains no required interface content in this hero.
- Use `preload="auto"` on the optimized delivery asset and explicitly retry muted playback when the hero mounts, improving autoplay reliability without adding controls.
- Do not add an artificial reduced-motion replacement because the user explicitly wants the video experience as the default screen; browser and OS media controls remain authoritative.

## Out of scope

- Redesigning the information sections below the hero.
- Adding video audio controls or automatic sound.
- Editing, trimming, or changing the narrative or visual content of the video.
- Adding navigation over the video.

## Acceptance criteria

- Visiting the route shows only the video in the first viewport.
- The video autoplays muted, loops, and has no visible controls.
- Portrait mobile view fills the screen with intentional cropping and no horizontal overflow.
- Scrolling reveals the existing service content below.
