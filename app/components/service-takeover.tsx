"use client";

import { useRef } from "react";
import { serviceBackdrops, type ServiceBackdrop } from "../service-backdrops";
import { serviceProducts } from "../service-products";
import { SoftwareDevelopmentGlassCard } from "./service-cards/software-development";
import { AiAutomationGlassCard } from "./service-cards/ai-automation";
import { BusinessMarketingGlassCard } from "./service-cards/business-marketing";
import { ProductAdsGlassCard } from "./service-cards/product-ads";
import { SocialMediaMarketingGlassCard } from "./service-cards/social-media-marketing";
import { EmailSmsGlassCard } from "./service-cards/email-sms";
import { GraphicDesignGlassCard } from "./service-cards/graphic-design";
import { VideoEditingGlassCard } from "./service-cards/video-editing";

// Each service owns its entire card file under ./service-cards — editing one
// never touches another. This map just routes a slug to its component; it's
// also used directly by <ServiceChipRail> to render the active card in the
// same box as the default hero card (see that file for why).
export const GLASS_CARDS: Record<string, (props: { entered: boolean }) => React.JSX.Element | null> = {
  "software-development": SoftwareDevelopmentGlassCard,
  "ai-automation": AiAutomationGlassCard,
  "business-marketing": BusinessMarketingGlassCard,
  "product-ads": ProductAdsGlassCard,
  "social-media-marketing": SocialMediaMarketingGlassCard,
  "email-sms": EmailSmsGlassCard,
  "graphic-design": GraphicDesignGlassCard,
  "video-editing": VideoEditingGlassCard,
};

/**
 * Hovering, clicking, or tabbing to a service chip replaces the hero
 * backdrop with that service's own photography, full-bleed — and, where a
 * product shot exists, slides a cutout in from the bottom-right corner.
 * The glass card itself lives in <ServiceChipRail>, not here — see that
 * file for why (same box as the default card, so it can never overlap it).
 *
 * Until a slug has real images (see ../service-backdrops.ts and
 * ../service-products.ts), the backdrop falls back to a restrained dark
 * gradient in the service's tone and the product shot simply doesn't render
 * — never a broken image, never a placeholder standing in.
 */

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

// Positioned relative to the whole section (not the constrained content
// column), so it only ever lands in the empty page margin outside the card
// on genuinely wide screens — never competes with the card's width. Sized
// with `clamp()` off viewport width so it actually grows on bigger monitors
// instead of sitting at one small fixed size everywhere; the vw rate here
// is deliberately mild so it stays mathematically clear of the card's own
// (untouched, full-width) right edge even as both grow. On only from 2xl,
// where the centered content column first leaves real margin to sit in.
function ProductShot({ slug, entered }: { slug: string; entered: boolean }) {
  const product = serviceProducts[slug];
  if (!product?.src) return null;

  return (
    <div
      className={`pointer-events-none absolute -bottom-[4%] -right-[3%] hidden h-[62%] w-[clamp(10rem,16vw,26rem)] transition-all ease-[cubic-bezier(0.16,1,0.3,1)] duration-[1100ms] 2xl:block ${
        entered ? "translate-x-0 translate-y-0 opacity-100" : "translate-x-[24%] translate-y-[18%] opacity-0"
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

// Full-bleed backdrop + small corner accent. The glass card itself lives in
// <ServiceChipRail>, in the exact box the default hero card occupies — its
// width is never touched here.
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
          <ProductShot slug={displaySlug} entered={isOpen} />
        </>
      )}
    </div>
  );
}
