"use client";

import { useRef } from "react";
import Link from "next/link";
import { getService } from "../content";
import { serviceBackdrops, type ServiceBackdrop } from "../service-backdrops";
import { serviceProducts } from "../service-products";

/**
 * The full-screen hover takeover: hovering a service chip replaces the
 * entire hero backdrop with that service's own photography — full-bleed,
 * under one minimal glass card carrying the copy — and, where a product shot
 * exists for that service, slides a cutout (a hand holding a phone, a device
 * on its own) in from off-screen past the bottom-right corner to rest there.
 *
 * Until a slug has real images (see ../service-backdrops.ts and
 * ../service-products.ts), the backdrop falls back to a restrained dark
 * gradient in the service's tone and the product shot simply doesn't render
 * — never a broken image, never a placeholder standing in.
 */

// CTA colors per service — gold reads well on most backdrops, but AI
// Automation's cool gray/violet tablet UI needs a matching accent instead
// of gold fighting the theme.
const CTA_THEME: Record<string, { from: string; to: string; text: string; glow: string }> = {
  default: { from: "#ffc873", to: "#f0932b", text: "#2b1a02", glow: "rgba(240,147,43,0.65)" },
  "ai-automation": { from: "#c9c4ff", to: "#7c6ef0", text: "#1a1533", glow: "rgba(124,110,240,0.6)" },
};

const FALLBACK_TONE: Record<ServiceBackdrop["tone"], string> = {
  gold: "radial-gradient(120% 90% at 78% 30%, #3a2f10 0%, #17130a 45%, #050403 100%)",
  steel: "radial-gradient(120% 90% at 78% 30%, #16202e 0%, #0d141c 45%, #030507 100%)",
  amber: "radial-gradient(120% 90% at 78% 30%, #3a2410 0%, #1c1209 45%, #060402 100%)",
  ember: "radial-gradient(120% 90% at 78% 30%, #3a1810 0%, #1c0d09 45%, #060302 100%)",
  indigo: "radial-gradient(120% 90% at 78% 30%, #221a3a 0%, #120e1e 45%, #050408 100%)",
};

function ImageBackdrop({ backdrop, active }: { backdrop: ServiceBackdrop; active: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {backdrop.src ? (
        <img
          src={backdrop.src}
          alt={backdrop.alt}
          className={`h-full w-full ${backdrop.fit === "contain" ? "object-contain" : "object-cover"} transition-transform duration-[9000ms] ease-out ${
            active ? "scale-[1.06]" : "scale-100"
          }`}
        />
      ) : (
        <div className="h-full w-full" style={{ background: FALLBACK_TONE[backdrop.tone] }} />
      )}

      {/* Contrast floor — a fixed dark wash, independent of what the image
          brings, so the glass card reads at the same strength on every
          service regardless of how bright the photography is. Left-heavy,
          not bottom-heavy: the product shot lives bottom-right and needs to
          stay clean, not dimmed by a wash meant for the text side. */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/5" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/15" />
    </div>
  );
}

function ProductShot({ slug, entered }: { slug: string; entered: boolean }) {
  const product = serviceProducts[slug];
  if (!product?.src) return null;

  return (
    <div
      className={`pointer-events-none absolute -bottom-[6%] -right-[4%] h-[78%] w-[46%] max-w-[34rem] transition-all ease-[cubic-bezier(0.16,1,0.3,1)] duration-[1100ms] ${
        entered ? "translate-x-0 translate-y-0 opacity-100" : "translate-x-[38%] translate-y-[30%] opacity-0"
      }`}
      style={{ transitionDelay: entered ? "80ms" : "0ms" }}
    >
      <img
        src={product.src}
        alt={product.alt}
        className="h-full w-full object-contain object-bottom drop-shadow-[0_35px_60px_rgba(0,0,0,0.55)]"
      />
    </div>
  );
}

function GlassCard({ slug, entered }: { slug: string; entered: boolean }) {
  const service = getService(slug);
  if (!service) return null;
  const cta = CTA_THEME[slug] ?? CTA_THEME.default;

  return (
    // The outer element only ever handles layout — centering the card in
    // the gap between the chip rail (reserved via lg:pl) and the product
    // shot (reserved via lg:pr) — so it can't fight with the entrance
    // animation, which lives entirely on the inner card via transform/opacity.
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 lg:pl-[23rem] lg:pr-[16rem]">
      <div
        className="pointer-events-auto w-full max-w-[42rem] transition-all duration-700 ease-out"
        style={{
          opacity: entered ? 1 : 0,
          transform: entered ? "scale(1) translateY(0)" : "scale(0.96) translateY(10px)",
          transitionDelay: entered ? "160ms" : "0ms",
        }}
      >
        {/* Same plain glass treatment as the default hero card
            (<PixelDissolveCard>): a flat dark scrim behind a hairline
            border, not a gold-ringed showpiece — consistency across the two
            cards the visitor actually compares side by side. */}
        <div className="border-beam relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-black/18 px-8 py-9 backdrop-blur-md md:px-11 md:py-11 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-2px_0_rgba(0,0,0,0.5),0_30px_80px_-24px_rgba(0,0,0,0.7)]">

          <div className="flex items-center gap-2">
            <span className="h-[3px] w-[3px] rounded-full bg-accent" />
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-accent">
              {service.name}
            </p>
          </div>

          <h2 className="mt-4 font-display text-[2.25rem] leading-[1.04] tracking-[-0.02em] text-white sm:text-[2.65rem]">
            {service.headline}
          </h2>

          <p className="mt-4 max-w-[36ch] text-[0.9375rem] leading-relaxed text-white/55">
            {service.teaser}
          </p>

          <div className="mt-7 h-px w-full bg-gradient-to-r from-white/15 to-transparent" />

          <div className="mt-6 flex flex-wrap gap-2">
            {service.subServices.slice(0, 4).map((sub) => (
              <span
                key={sub}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[0.75rem] font-medium text-white/65"
              >
                {sub}
              </span>
            ))}
          </div>

          <Link
            href={`/services/${service.slug}`}
            className="group mt-8 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[0.875rem] font-semibold transition-transform duration-300 ease-out hover:scale-[1.03]"
            style={{
              background: `linear-gradient(to bottom, ${cta.from}, ${cta.to})`,
              color: cta.text,
              boxShadow: `0 10px 30px -8px ${cta.glow}`,
            }}
          >
            View {service.name}
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ServiceTakeover({ activeSlug }: { activeSlug: string | null }) {
  // Keep rendering the last-hovered service's backdrop through the fade-out
  // — clearing it the instant activeSlug goes null would cut the image
  // before the opacity transition finishes, making the exit look broken.
  const lastSlugRef = useRef<string | null>(null);
  if (activeSlug) lastSlugRef.current = activeSlug;
  const displaySlug = activeSlug ?? lastSlugRef.current;
  const isOpen = !!activeSlug;
  const backdrop = displaySlug ? serviceBackdrops[displaySlug] : undefined;

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-700 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    >
      {displaySlug && backdrop && (
        <>
          <ImageBackdrop key={displaySlug} backdrop={backdrop} active={isOpen} />
          <GlassCard slug={displaySlug} entered={isOpen} />
          <ProductShot slug={displaySlug} entered={isOpen} />
        </>
      )}
    </div>
  );
}
