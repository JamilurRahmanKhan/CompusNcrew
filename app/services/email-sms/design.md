<<<<<<< HEAD
# Email & SMS page design brief

- Direction: deep-navy editorial minimalism translated from the supplied video, with off-white content surfaces and restrained amber accents.
- Product truth: this page sells consent-led lifecycle infrastructure, segmentation, deliverability, campaign craft and retention—not generic “growth hacking.”
- Hierarchy: immersive outcome-led hero, point of view, four-step operating process, three connected foundations, concrete deliverables, boundaries, decisive contact CTA.
- Typography: retain the project’s Instrument Serif and Inter pairing; oversized display type is reserved for section arguments, while operational content stays compact and scannable.
- Motion: use only existing navigation motion and small hover feedback; no scroll-jacking or decorative animation. Respect reduced-motion preferences.
- Responsive rule: all split layouts collapse to one column below tablet width, media keeps a reserved aspect, and no content depends on hover.
=======
# Email marketing page design brief

- Source: layout and copy follow `resources/full.png` section-for-section (hero, revenue-leak grid, customer-journey conveyor, top 10 services, industries + how-it-works + before/after, process, calculator + real results, platforms + FAQ, final CTA). Footer and top nav are the site's existing global components, not rebuilt here.
- Theme: the reference mock's generic white/blue SaaS palette is replaced entirely with the project's deep-navy editorial system — `--navy` / `--navy-soft`, `--paper` / `--paper-bright`, `--amber` as the sole accent, plus muted `--success` / `--danger` for before/after and calculator states. Sections alternate navy and paper for rhythm, same pattern as the previous hero/foundation/cta split.
- Conveyor: `app/components/email-marketing/conveyor-journey.tsx` ports the supplied conveyor-belt component, recolored to amber/copper. It auto-drifts continuously, pauses on pointerdown/hover/wheel/touch, resumes 2.5s after release, and is natively draggable/swipeable via horizontal scroll with an infinite wrap.
- Interactive pieces: revenue calculator (`revenue-calculator.tsx`) and FAQ accordion (`faq-accordion.tsx`) are isolated client components; the route itself stays a server component so metadata export still works.
- Motion: conveyor drift, hero live-pulse, floating badges and the CTA rocket all respect `prefers-reduced-motion`. No scroll-jacking.
- Responsive rule: hero stacks with the panel above the copy under 900px; grids collapse from 5 → 3 → 2 → 1 columns; all interactive targets stay ≥44px; no section introduces horizontal overflow.
>>>>>>> emon
