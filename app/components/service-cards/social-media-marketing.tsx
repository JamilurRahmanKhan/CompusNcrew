"use client";

// Fully standalone glass card for "social-media-marketing" — edit freely, no other service
// is affected. Copy this file's shape for a new service if ever needed.

import Link from "next/link";
import { getService } from "../../content";

const GLASS =
  "border-beam-orange relative overflow-hidden rounded-[1.75rem] border border-orange-200/15 bg-[#2b1206]/40 px-8 py-9 backdrop-blur-md md:px-11 md:py-11 shadow-[inset_0_1px_0_rgba(255,200,150,0.3),inset_0_-2px_0_rgba(0,0,0,0.5),0_30px_80px_-24px_rgba(194,65,12,0.6)]";

const CTA = { from: "#ffb37a", to: "#ea580c", text: "#2b0f02", glow: "rgba(234,88,12,0.7)" };

export function SocialMediaMarketingGlassCard({ entered }: { entered: boolean }) {
  const service = getService("social-media-marketing");
  if (!service) return null;

  return (
    <div className={GLASS}>
      <div className="flex items-center gap-2">
        <span className="h-[3px] w-[3px] rounded-full bg-orange-400" />
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-orange-400">
          {service.name}
        </p>
      </div>

      <h2 className="mt-4 font-display text-[2.25rem] leading-[1.04] tracking-[-0.02em] text-orange-50 sm:text-[2.65rem]">
        {service.headline}
      </h2>

      <p className="mt-4 max-w-[36ch] text-[0.9375rem] leading-relaxed text-orange-100/55">
        {service.teaser}
      </p>

      <div className="mt-7 h-px w-full bg-gradient-to-r from-orange-200/15 to-transparent" />

      <div className="mt-6 flex flex-wrap gap-2">
        {service.subServices.slice(0, 4).map((sub) => (
          <span
            key={sub}
            className="rounded-full border border-orange-200/10 bg-orange-400/[0.06] px-3.5 py-1.5 text-[0.75rem] font-medium text-orange-100/70"
          >
            {sub}
          </span>
        ))}
      </div>

      <Link
        href={`/services/${service.slug}`}
        className="group mt-8 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[0.875rem] font-semibold transition-transform duration-300 ease-out hover:scale-[1.03]"
        style={{
          background: `linear-gradient(to bottom, ${CTA.from}, ${CTA.to})`,
          color: CTA.text,
          boxShadow: `0 10px 30px -8px ${CTA.glow}`,
        }}
      >
        View {service.name}
        <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">
          →
        </span>
      </Link>
    </div>
  );
}
