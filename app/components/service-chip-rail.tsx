"use client";

import Link from "next/link";
import { getService } from "../content";
import { PixelDissolveCard } from "./pixel-dissolve-card";
import { GLASS_CARDS } from "./service-takeover";
import { Reveal } from "./reveal";

type Chip = { label: string; slug: string };

/**
 * Hovering (desktop) or clicking/tapping (any device) a chip swaps the
 * default hero card for that service's own glass card — see ./service-cards
 * — in the exact same box, via crossfade, so the two never fight for space
 * regardless of screen size. Selection is sticky: once a chip is active it
 * stays showing until another chip is hovered/clicked, or the SAME chip is
 * clicked again — that's the way back to the default screen. Clicking a
 * chip never navigates by itself; only the "View X" button inside the
 * active card does. Keyboard focus behaves the same as hover.
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
  const ActiveCard = hoveredSlug ? GLASS_CARDS[hoveredSlug] : null;

  return (
    <>
      <Reveal as="ul" className="order-2 flex flex-wrap gap-1.5 self-start lg:order-1 lg:w-[17rem] lg:flex-col lg:items-start lg:self-center">
        {chips.map((chip, i) => (
          <li key={chip.slug} style={{ transitionDelay: `${i * 40}ms` }}>
            <Link
              href={`/services/${chip.slug}`}
              className="pill"
              aria-current={chip.slug === hoveredSlug ? "true" : undefined}
              onMouseEnter={() => onHover(chip.slug)}
              onFocus={() => onHover(chip.slug)}
              onClick={(e) => {
                e.preventDefault();
                onHover(chip.slug === hoveredSlug ? null : chip.slug);
              }}
            >
              {chip.label}
            </Link>
          </li>
        ))}
      </Reveal>

      {/* `grid` + every child on col/row 1: the box auto-sizes to whichever
          child is tallest right now (default card or the active service's,
          which vary a lot in content length), instead of a guessed fixed
          min-height the taller ones would overflow past — on mobile, where
          the chip rail sits directly below this box, that overflow used to
          mean the card's bottom edge cutting through the chips. */}
      <Reveal className="relative order-1 grid lg:order-2" delay={120}>
        <PixelDissolveCard
          className={`col-start-1 row-start-1 min-h-[22rem] transition-opacity duration-500 lg:min-h-[24rem] ${
            active ? "pointer-events-none opacity-0" : "opacity-100"
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

        {ActiveCard && (
          <div
            className="col-start-1 row-start-1 self-start transition-all duration-700 ease-out"
            style={{
              opacity: active ? 1 : 0,
              transform: active ? "scale(1) translateY(0)" : "scale(0.96) translateY(10px)",
              transitionDelay: active ? "160ms" : "0ms",
              pointerEvents: active ? "auto" : "none",
            }}
          >
            <div className="relative">
              <ActiveCard entered={!!active} />
              {/* Explicit way back to the default screen — clicking the
                  same chip again does the same thing, but this is the
                  discoverable version. */}
              <button
                type="button"
                aria-label="Back to default"
                onClick={() => onHover(null)}
                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white/70 backdrop-blur-md transition-colors hover:bg-black/50 hover:text-white"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </Reveal>
    </>
  );
}
