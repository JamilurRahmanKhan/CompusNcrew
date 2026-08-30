# Email Marketing — Conversion Atelier Design

## Goal

Redesign `/services/email-sms` as an email-marketing-only experience that explains a specific commercial problem: businesses generate leads but lose them through generic, poorly timed, unconvincing email. The page must show how CompassNCrew turns those leads into replies, meetings, and clients.

The experience opens with a 20–25 second real-time, code-driven 3D cinematic. It is not a prerecorded video. The cinematic plays on every visit, includes a persistent skip control, and transitions in place into a conventional scrollable service page.

## Core concept: The Conversion Atelier

The visual metaphor is a premium editorial workshop where an ignored generic email is examined, rewritten, designed, timed, and transformed into a relevant customer journey.

The atelier must not resemble:

- the road-and-car software portfolio;
- the node-based AI automation workflow;
- a game interface;
- a cyberpunk control room;
- a generic SaaS dashboard;
- the mechanics or artwork of the reference website.

Its identity combines tactile correspondence, editorial craft, restrained technology, and human communication.

## Opening cinematic

### Runtime and behavior

- Target runtime: 20–25 seconds.
- Play automatically on every route visit.
- Render in real time with Three.js/WebGL and DOM typography.
- Provide a keyboard-accessible **Skip introduction** control in a safe-area-aware corner.
- Skipping uses a short, smooth transition to the service page rather than a hard cut.
- Show a minimal progress line without chapter controls or playback buttons.
- Do not require user interaction to complete the story.

### Scene 1 — The ignored lead (0–4 seconds)

The camera enters a refined editorial workspace. A warm lead arrives in a translucent profile capsule beside a dull, generic email. The email reads like an impersonal broadcast, travels toward an inbox, and drops into an **Unopened** tray.

In-scene evidence remains concise:

- Opens: 0
- Replies: 0
- Meetings: 0

Cinematic copy:

> You generated the lead.<br>
> But the message lost them.

### Scene 2 — The actual problem (4–7 seconds)

Several identical grey emails gather in the ignored tray. The lead capsule reveals only the signals needed to communicate relevance: industry, intent, previous action, buying stage, and primary problem.

Cinematic copy:

> Leads do not need more email.<br>
> They need the right reason to respond.

### Scene 3 — The atelier activates (7–15 seconds)

The workspace warms and the email separates into layers. It passes through four physical editorial instruments that belong to one coherent room rather than appearing as disconnected cards or automation nodes.

1. **Audience lens** — Interprets the lead's context and replaces generic language with a relevant premise.
2. **Message desk** — Refines the subject, opening, proposition, proof, and CTA.
3. **Design frame** — Applies branded hierarchy, responsive layout, relevant imagery, and one clear action.
4. **Delivery clock** — Selects the appropriate sequence and moment, then applies a sender-trust seal.

The transformation uses editorial movement: type rearranges, paper layers align, and materials become warmer and more intentional. Avoid decorative particle overload.

### Scene 4 — Conversion (15–20 seconds)

The finished email folds into a luminous envelope and travels through a controlled delivery passage. It reaches an inbox, is opened, read, and acted upon. The lead capsule changes from cool glass to warm copper-gold.

The outcome is expressed as a short progression:

> Lead → Reader → Reply → Meeting → Client

The earlier indicators update to **Opened**, **Engaged**, **Meeting booked**, and **Client won**.

Cinematic copy:

> Better emails do not chase attention.<br>
> They turn attention into action.

### Scene 5 — Transition (20–25 seconds)

The camera pulls back to reveal a calm, functioning correspondence system. The atelier surface expands into the background of the 2D page while service-page typography rises from the same spatial plane.

Final copy:

> We turn leads into conversations.<br>
> And conversations into clients.

The transition changes presentation without navigating to another route.

## Visual system

### Palette

The foundation is a clearly visible, medium-deep ink navy rather than near-black.

- **Visible ink navy:** approximately `#17243A` to `#21314A` for large cinematic surfaces.
- **Raised navy:** approximately `#2A3C57` for platforms and instruments.
- **Parchment:** warm off-white for correspondence and the 2D reading surface.
- **Burnished copper:** the principal accent for transformation and primary actions.
- **Soft amber:** successful attention and human warmth.
- **Desaturated blue-grey:** ignored or generic states.
- **Muted green:** reserved for confirmed conversion states.

Background objects, edges, and shadows must remain distinguishable without increasing glare. The opening begins cool and becomes warmer as relevance and trust increase. The composition should never collapse into black-on-black imagery.

### Typography

- A refined editorial serif carries emotional statements and key section headings.
- A clean grotesk sans-serif carries body copy, email content, navigation, and evidence.
- Use sentence case except for very small functional labels.
- Keep cinematic captions to two short lines.
- Avoid fictional technical jargon and illegibly small interface copy.

### Materials and light

- Frosted glass for lead profiles.
- Fine paper grain for email surfaces.
- Brushed navy metal for atelier tools.
- Matte work surfaces with layered, directionally consistent shadows.
- Copper and amber area lights that reveal form instead of producing neon outlines.

## Scrollable service page

### 1. Opening statement

Headline: **Emails that turn interest into action.**

Supporting copy explains that strategy, writing, design, and lifecycle journeys move qualified leads toward a conversation and decision.

Primary CTA: **Build my email system**<br>
Secondary CTA: **Explore our approach**

### 2. The conversion gap

Use one composed correspondence table rather than a grid of generic cards.

**Before:** generic broadcasts, weak subjects, unclear offers, inconsistent follow-up, and cold leads.<br>
**After:** relevant segmentation, clear messaging, branded design, timely sequences, and measurable conversations.

### 3. Service system

Present five connected editorial chapters:

1. Email strategy
2. Copywriting
3. Email design
4. Lifecycle sequences
5. Testing and optimization

Each chapter explains its role in the same conversion system. Avoid five visually identical floating cards.

### 4. Customer journey

Desktop uses a horizontal lifecycle; mobile uses a vertical progression:

> New lead → Welcome → Education → Trust → Offer → Follow-up → Client

Each stage reveals what the customer needs, what message is sent, and what action the email should create.

### 5. Selected email work

Create a premium **Campaign Archive** that can accept real projects later. Each entry supports:

- client or category;
- original business problem;
- sequence preview;
- mobile and desktop email layouts;
- strategic decision;
- verified result.

Use honest placeholders until real project content exists. Do not invent clients, testimonials, or performance figures.

### 6. Process

Use four concise steps that reference the atelier instruments:

1. Understand the lead
2. Shape the message
3. Build the journey
4. Improve through evidence

### 7. Final conversion section

Return to the warmer atelier palette.

Headline:

> Your leads are already listening.<br>
> Give them something worth responding to.

CTA: **Plan your email marketing system**

## Responsive direction

### Desktop and large screens

- Use dimensional camera travel and layered atelier depth.
- Allow multiple instruments to share a shot only when their labels remain readable.
- Keep cinematic copy away from active objects.
- Use asymmetric editorial layouts on the service page.

### Tablet

- Bring the camera closer to the active instrument.
- Reduce background props and simultaneous motion.
- Keep text blocks short and preserve large touch targets.
- Convert the archive into a controlled, swipeable sequence where required.

### Mobile

- Author mobile camera framing separately; do not merely scale down the desktop scene.
- Focus on one active subject per shot.
- Keep the email or lead capsule large enough to understand immediately.
- Position skip and progress UI inside device safe areas.
- Convert the lifecycle into a vertical story.
- Present one campaign project per viewport.
- Do not rely on hover interactions.

## Accessibility and fallbacks

- Skip control is reachable first by keyboard and has at least a 44 × 44 px target.
- DOM captions maintain WCAG contrast over the visible navy foundation.
- Respect `prefers-reduced-motion` with a shorter sequence of gentle state changes and crossfades.
- If WebGL is unavailable, show a designed 2D animated correspondence sequence that preserves the same story and transition.
- The scrollable page remains fully accessible and usable independently of the cinematic.

## Performance strategy

- Prefer procedural geometry and reusable materials over large downloaded 3D models.
- Use compressed textures only where texture materially improves realism.
- Avoid a detailed human character; represent recipient behavior through the inbox and response interaction.
- Lazy-load lower-page imagery while the cinematic runs.
- Reduce pixel ratio, secondary lighting, and ambient effects on constrained mobile devices.
- Keep the main thread responsive so the skip action is immediate.

## Technical boundaries

Implement the cinematic as isolated scene, timeline, and transition modules. The service page must not depend on the WebGL scene to render. A single orchestration state controls `playing`, `skipping`, `transitioning`, and `content` modes, preventing duplicate timers or conflicting scroll locks.

The existing route changes from Email & SMS to email marketing exclusively. Remove SMS-specific page language while preserving global site navigation and footer behavior outside the full-screen opening.

## Acceptance criteria

- The opening is a real-time 3D sequence, not a video.
- The complete sequence lasts 20–25 seconds and plays on every visit.
- Skip works at any moment and transitions smoothly to content.
- The story clearly shows a generic email losing a lead and a strategic email generating a client action.
- The foundation navy is visibly lighter than near-black and preserves object separation.
- The page exclusively describes email marketing.
- Desktop, tablet, and mobile receive intentionally composed layouts.
- Reduced-motion and WebGL fallbacks preserve the message.
- The service page includes the conversion gap, services, customer journey, campaign archive, process, and CTA.
- No fabricated customer work or performance claims appear.
