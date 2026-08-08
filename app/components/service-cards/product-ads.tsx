// "use client";

// // Fully standalone glass card for "product-ads" — edit freely, no other service
// // is affected. Copy this file's shape for a new service if ever needed.

// import Link from "next/link";
// import { getService } from "../../content";

// const GLASS =
//   "border-beam-green relative overflow-hidden rounded-[1.75rem] border border-emerald-200/15 bg-[#07170f]/40 px-8 py-9 backdrop-blur-md md:px-11 md:py-11 shadow-[inset_0_1px_0_rgba(190,255,220,0.3),inset_0_-2px_0_rgba(0,0,0,0.5),0_30px_80px_-24px_rgba(16,105,60,0.55)]";

// const CTA = { from: "#86efac", to: "#16a34a", text: "#04210f", glow: "rgba(22,163,74,0.6)" };

// export function ProductAdsGlassCard({ entered }: { entered: boolean }) {
//   const service = getService("product-ads");
//   if (!service) return null;

//   return (
//     <div className={GLASS}>
//       <div className="flex items-center gap-2">
//         <span className="h-[3px] w-[3px] rounded-full bg-emerald-300" />
//         <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-emerald-300">
//           {service.name}
//         </p>
//       </div>

//       <h2 className="mt-4 font-display text-[2.25rem] leading-[1.04] tracking-[-0.02em] text-white sm:text-[2.65rem]">
//         {service.headline}
//       </h2>

//       <p className="mt-4 max-w-[36ch] text-[0.9375rem] leading-relaxed text-emerald-100/55">
//         {service.teaser}
//       </p>

//       <div className="mt-7 h-px w-full bg-gradient-to-r from-emerald-200/15 to-transparent" />

//       <div className="mt-6 flex flex-wrap gap-2">
//         {service.subServices.slice(0, 4).map((sub) => (
//           <span
//             key={sub}
//             className="rounded-full border border-emerald-200/10 bg-emerald-300/[0.06] px-3.5 py-1.5 text-[0.75rem] font-medium text-emerald-100/70"
//           >
//             {sub}
//           </span>
//         ))}
//       </div>

//       <Link
//         href={`/services/${service.slug}`}
//         className="group mt-8 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[0.875rem] font-semibold transition-transform duration-300 ease-out hover:scale-[1.03]"
//         style={{
//           background: `linear-gradient(to bottom, ${CTA.from}, ${CTA.to})`,
//           color: CTA.text,
//           boxShadow: `0 10px 30px -8px ${CTA.glow}`,
//         }}
//       >
//         View {service.name}
//         <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">
//           →
//         </span>
//       </Link>
//     </div>
//   );
// }



"use client";

// Product Ads / Paid Ads card.
// Responsive sizing matched to the Software Development card.

import Link from "next/link";
import { getService } from "../../content";

const CTA = {
  from: "#86efac",
  to: "#16a34a",
  text: "#04210f",
  glow: "rgba(22,163,74,0.6)",
};

export function ProductAdsGlassCard({
  entered,
}: {
  entered: boolean;
}) {
  const service = getService("product-ads");

  if (!service) return null;

  return (
    <div
      className="
        border-beam-green
        relative
        overflow-hidden

        rounded-[1.5rem]

        border
        border-emerald-200/15

        bg-[#07170f]/40

        px-5
        py-6

        backdrop-blur-md

        shadow-[
          inset_0_1px_0_rgba(190,255,220,0.3),
          inset_0_-2px_0_rgba(0,0,0,0.5),
          0_30px_80px_-24px_rgba(16,105,60,0.55)
        ]

        sm:rounded-[1.6rem]
        sm:px-6
        sm:py-6

        md:rounded-[1.65rem]
        md:px-7
        md:py-7

        lg:rounded-[1.75rem]
        lg:px-11
        lg:py-11
      "
    >
      {/* LABEL */}
      <div className="flex min-w-0 items-center gap-2">
        <span
          className="
            h-[3px]
            w-[3px]
            shrink-0
            rounded-full
            bg-emerald-300
          "
        />

        <p
          className="
            min-w-0
            truncate

            text-[0.58rem]
            font-semibold
            uppercase
            tracking-[0.18em]
            text-emerald-300

            sm:text-[0.6rem]
            sm:tracking-[0.19em]

            md:text-[0.625rem]
            md:tracking-[0.2em]

            lg:text-[0.6875rem]
            lg:tracking-[0.22em]
          "
        >
          {service.name}
        </p>
      </div>

      {/* HEADLINE */}
      <h2
        className="
          mt-3

          font-display

          text-[1.8rem]
          leading-[1.03]
          tracking-[-0.02em]
          text-white

          sm:text-[1.95rem]

          md:mt-3.5
          md:text-[2.1rem]

          lg:mt-4
          lg:text-[2.65rem]
          lg:leading-[1.04]
        "
      >
        {service.headline}
      </h2>

      {/* TEASER */}
      <p
        className="
          mt-3

          max-w-[36ch]

          text-[0.8rem]
          leading-[1.5]
          text-emerald-100/55

          sm:text-[0.82rem]

          md:text-[0.85rem]

          lg:mt-4
          lg:text-[0.9375rem]
          lg:leading-relaxed
        "
      >
        {service.teaser}
      </p>

      {/* DIVIDER */}
      <div
        className="
          mt-4
          h-px
          w-full

          bg-gradient-to-r
          from-emerald-200/15
          to-transparent

          md:mt-5

          lg:mt-7
        "
      />

      {/* SUB SERVICES */}
      <div
        className="
          mt-4

          flex
          min-w-0
          max-w-full
          flex-wrap

          gap-1.5

          sm:gap-2

          md:mt-4

          lg:mt-6
          lg:gap-2
        "
      >
        {service.subServices.slice(0, 4).map((sub) => (
          <span
            key={sub}
            className="
              min-w-0

              rounded-full

              border
              border-emerald-200/10

              bg-emerald-300/[0.06]

              px-2.5
              py-1

              text-[0.64rem]
              font-medium
              leading-tight
              text-emerald-100/70

              sm:px-3
              sm:text-[0.67rem]

              md:px-3
              md:text-[0.7rem]

              lg:px-3.5
              lg:py-1.5
              lg:text-[0.75rem]
            "
          >
            {sub}
          </span>
        ))}
      </div>

      {/* CTA */}
      <Link
        href={`/services/${service.slug}`}
        className="
          group

          mt-5

          inline-flex
          max-w-full

          items-center
          gap-2

          rounded-full

          px-4
          py-2

          text-[0.76rem]
          font-semibold
          leading-none

          transition-transform
          duration-300
          ease-out

          hover:scale-[1.02]

          sm:px-4.5
          sm:py-2.25
          sm:text-[0.78rem]

          md:mt-6
          md:px-5
          md:py-2.5
          md:text-[0.82rem]

          lg:mt-8
          lg:text-[0.875rem]

          lg:hover:scale-[1.03]
        "
        style={{
          background: `linear-gradient(to bottom, ${CTA.from}, ${CTA.to})`,
          color: CTA.text,
          boxShadow: `0 10px 30px -8px ${CTA.glow}`,
        }}
      >
        <span className="truncate">
          View {service.name}
        </span>

        <span
          aria-hidden="true"
          className="
            shrink-0

            transition-transform
            duration-300

            group-hover:translate-x-0.5
          "
        >
          →
        </span>
      </Link>
    </div>
  );
}