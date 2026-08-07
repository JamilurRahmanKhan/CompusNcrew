"use client";

import Link from "next/link";
import { type FocusEventHandler } from "react";
import { getService } from "../content";
import { PixelDissolveCard } from "./pixel-dissolve-card";
import { Reveal } from "./reveal";

type Chip = { label: string; slug: string };

/**
 * MetaLab's actual interaction, not a scaled-down imitation of it: hovering
 * (or tabbing to, for keyboard users) a chip crossfades the ENTIRE hero
 * content column — headline, description, CTA — into a dedicated view for
 * that service, with its real sub-services. The matching full-screen
 * takeover (liquid background + phone mockup) is a sibling of this,
 * controlled by the same `hoveredSlug` — see <Hero> and <ServiceTakeover>.
 *
 * Both states here stay mounted, layered with absolute positioning and
 * opacity, so the swap is a true crossfade rather than a layout jump — and
 * so the default brand content (the thing playbook §8 calls "the outcome
 * headline, understood in ten seconds") is what search engines and no-JS
 * visitors see, never the transient hover state.
 *
 * This is a pointer/keyboard enhancement. Touch has no hover — chips there
 * are just links straight to the service page, which is arguably the more
 * useful outcome on a phone anyway.
 */
export function ServiceChipRail({
  chips,
  headline,
  lead,
  hoveredSlug,
  onHover,
}: {
  chips: Chip[];
  headline: string[];
  lead: string;
  hoveredSlug: string | null;
  onHover: (slug: string | null) => void;
}) {
  const active = hoveredSlug ? getService(hoveredSlug) : null;

  // Reveal's props are typed for the generic case (always a <div>), even
  // though `as="ul"` renders a real <ul> at runtime — `.contains()` works
  // identically either way, so the mismatch is type-only.
  const handleBlur: FocusEventHandler<HTMLDivElement> = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) onHover(null);
  };

  return (
    <>
      <Reveal
        as="ul"
        className="order-2 flex flex-wrap gap-1.5 self-start lg:order-1 lg:w-[17rem] lg:flex-col lg:items-start lg:self-center"
        onMouseLeave={() => onHover(null)}
        onBlur={handleBlur}
      >
        {chips.map((chip, i) => (
          <li key={chip.slug} style={{ transitionDelay: `${i * 40}ms` }}>
            <Link
              href={`/services/${chip.slug}`}
              className="pill"
              aria-current={chip.slug === hoveredSlug ? "true" : undefined}
              onMouseEnter={() => onHover(chip.slug)}
              onFocus={() => onHover(chip.slug)}
            >
              {chip.label}
            </Link>
          </li>
        ))}
      </Reveal>

      <Reveal className="relative order-1 lg:order-2" delay={120}>
        {/* Default brand content only — always mounted, defines the card's
            height. When a chip is active, the whole card fades out rather
            than swapping to service copy: <ServiceTakeover>'s own glass
            card, positioned over that service's real backdrop image, is now
            the single place hover content renders. Two cards on screen at
            once (this one AND the takeover's) was the bug — not two views
            of one card. */}
        <PixelDissolveCard
          className={`min-h-[22rem] transition-opacity duration-500 lg:min-h-[24rem] ${
            active ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="flex h-full flex-col justify-end" aria-hidden={active ? "true" : undefined}>
            <p
              className="max-w-[38ch] text-[1.0625rem] leading-relaxed text-muted lg:ml-auto lg:mb-10 lg:text-right"
              style={{ textShadow: "0 2px 16px rgba(0,0,0,0.5)" }}
            >
              {lead}
            </p>

            <h1 className="display display-xl" style={{ textShadow: "0 4px 30px rgba(0,0,0,0.55)" }}>
              {headline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/contact" className="pill">
                Start a project
              </Link>
              <Link href="/method" className="pill">
                How we work
              </Link>
            </div>
          </div>
        </PixelDissolveCard>
      </Reveal>
    </>
  );
}
