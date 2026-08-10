"use client";

import { useState } from "react";
import { home } from "../content";
import { LiquidVideoBackdrop } from "./liquid-video-backdrop";
import { ServiceChipRail } from "./service-chip-rail";
import { ServiceTakeover } from "./service-takeover";

/**
 * The MetaLab first impression, rebuilt.
 *
 *   1. A full-bleed liquid-metal video, clipped to a notch-cornered card via
 *      SVG mask — see <LiquidVideoBackdrop>. Decorative and `aria-hidden`,
 *      same as every other ambient layer on the site.
 *   2. Floating pill chips down the left, carrying capability rather than
 *      client logos — we have no client logos yet and will not fake them.
 *   3. Headline, lead and CTA live inside a glass card (<PixelDissolveCard>)
 *      over the video, `.on-dark`-scoped so the shared type tokens flip
 *      light-on-dark without a separate dark-mode component.
 *   4. Hovering (or tabbing to) a chip crossfades the card's content —
 *      headline, description, CTA — into a dedicated view for that service.
 *   5. The same hover replaces the video with a full-screen liquid takeover
 *      in that service's tone, and slides a phone mockup in from the bottom
 *      right. See <ServiceTakeover>.
 *
 * `hoveredSlug` lives here, one level above both consumers, because the
 * takeover (5) needs to render as a full-bleed sibling of the constrained
 * content grid — nested inside it, an `inset-0` would only ever cover the
 * centred max-width column, not the actual full-width hero.
 */
export function Hero() {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const activeSlug = selectedSlug ?? hoveredSlug;

  function previewService(slug: string | null) {
    if (!selectedSlug) setHoveredSlug(slug);
  }

  function selectService(slug: string) {
    setSelectedSlug(slug);
    setHoveredSlug(slug);
  }

  function closeService() {
    setSelectedSlug(null);
    setHoveredSlug(null);
  }

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-center pb-14 pt-28">
      <LiquidVideoBackdrop />
      <ServiceTakeover activeSlug={activeSlug} />

      <div className="on-dark relative mx-auto grid w-full max-w-[80rem] gap-12 px-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:px-20 xl:px-28">
        <ServiceChipRail
          chips={home.hero.chips}
          headline={home.hero.headline}
          lead={home.hero.lead}
          hoveredSlug={activeSlug}
          onHover={previewService}
          onSelect={selectService}
          onClose={closeService}
        />
      </div>
    </section>
  );
}
