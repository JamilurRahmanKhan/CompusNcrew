"use client";

// Fully standalone glass card for "business-marketing" — edit freely, no other service
// is affected. Copy this file's shape for a new service if ever needed.

import Link from "next/link";
import { getService } from "../../content";

const GLASS =
  "border-beam-violet relative overflow-hidden rounded-[1.75rem] border border-violet-200/15 bg-[#1a1030]/40 px-8 py-9 backdrop-blur-md md:px-11 md:py-11 shadow-[inset_0_1px_0_rgba(216,204,255,0.3),inset_0_-2px_0_rgba(0,0,0,0.5),0_30px_80px_-24px_rgba(76,29,149,0.55)]";

const CTA = { from: "#c9a9ff", to: "#7c4fe0", text: "#1a1533", glow: "rgba(124,79,224,0.6)" };

export function BusinessMarketingGlassCard({ entered }: { entered: boolean }) {
  const service = getService("business-marketing");
  if (!service) return null;

  return (
    <div className={GLASS}>
      <div className="flex items-center gap-2">
        <span className="h-[3px] w-[3px] rounded-full bg-violet-300" />
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-violet-300">
          {service.name}
        </p>
      </div>

      <h2 className="mt-4 font-display text-[2.25rem] leading-[1.04] tracking-[-0.02em] text-white sm:text-[2.65rem]">
        {service.headline}
      </h2>

      <p className="mt-4 max-w-[36ch] text-[0.9375rem] leading-relaxed text-violet-100/60">
        {service.teaser}
      </p>

      <div className="mt-7 h-px w-full bg-gradient-to-r from-violet-200/15 to-transparent" />

      <div className="mt-6 flex flex-wrap gap-2">
        {service.subServices.slice(0, 4).map((sub) => (
          <span
            key={sub}
            className="rounded-full border border-violet-200/10 bg-violet-300/[0.06] px-3.5 py-1.5 text-[0.75rem] font-medium text-violet-100/70"
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
