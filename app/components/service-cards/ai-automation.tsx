// // "use client";

// // // Fully standalone glass card for "ai-automation" — edit freely, no other service
// // // is affected. Copy this file's shape for a new service if ever needed.

// // import Link from "next/link";
// // import { getService } from "../../content";

// // const GLASS =
// //   "border-beam relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-black/18 px-8 py-9 backdrop-blur-md md:px-11 md:py-11 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-2px_0_rgba(0,0,0,0.5),0_30px_80px_-24px_rgba(0,0,0,0.7)]";

// // const CTA = { from: "#c9c4ff", to: "#7c6ef0", text: "#1a1533", glow: "rgba(124,110,240,0.6)" };

// // export function AiAutomationGlassCard({ entered }: { entered: boolean }) {
// //   const service = getService("ai-automation");
// //   if (!service) return null;

// //   return (
// //     <div className={GLASS}>
// //       <div className="flex items-center gap-2">
// //         <span className="h-[3px] w-[3px] rounded-full bg-accent" />
// //         <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-accent">
// //           {service.name}
// //         </p>
// //       </div>

// //       <h2 className="mt-4 font-display text-[2.25rem] leading-[1.04] tracking-[-0.02em] text-white sm:text-[2.65rem]">
// //         {service.headline}
// //       </h2>

// //       <p className="mt-4 max-w-[36ch] text-[0.9375rem] leading-relaxed text-white/55">
// //         {service.teaser}
// //       </p>

// //       <div className="mt-7 h-px w-full bg-gradient-to-r from-white/15 to-transparent" />

// //       <div className="mt-6 flex flex-wrap gap-2">
// //         {service.subServices.slice(0, 4).map((sub) => (
// //           <span
// //             key={sub}
// //             className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[0.75rem] font-medium text-white/65"
// //           >
// //             {sub}
// //           </span>
// //         ))}
// //       </div>

// //       <Link
// //         href={`/services/${service.slug}`}
// //         className="group mt-8 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[0.875rem] font-semibold transition-transform duration-300 ease-out hover:scale-[1.03]"
// //         style={{
// //           background: `linear-gradient(to bottom, ${CTA.from}, ${CTA.to})`,
// //           color: CTA.text,
// //           boxShadow: `0 10px 30px -8px ${CTA.glow}`,
// //         }}
// //       >
// //         View {service.name}
// //         <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">
// //           →
// //         </span>
// //       </Link>
// //     </div>
// //   );
// // }




// "use client";

// // AI Automation card.
// // Same overall size/layout as Software Development card,
// // but with darker graphite-violet glass styling to match the AI background.

// import Link from "next/link";
// import { getService } from "../../content";

// const CTA = {
//   from: "#9f98ff",
//   to: "#6256d9",
//   text: "#ffffff",
//   glow: "rgba(98,86,217,0.52)",
// };

// export function AiAutomationGlassCard({
//   entered,
// }: {
//   entered: boolean;
// }) {
//   const service = getService("ai-automation");

//   if (!service) return null;

//   return (
//     <div
//       className={`
//         border-beam-violet
//         group
//         relative
//         isolate
//         overflow-hidden

//         rounded-[2.15rem]

//         border
//         border-white/[0.20]

//         bg-gradient-to-br
//         from-[#302f3b]/[0.72]
//         via-[#17171f]/[0.82]
//         to-[#09090e]/[0.94]

//         px-8
//         py-9

//         backdrop-blur-[28px]
//         backdrop-saturate-[1.22]

//         shadow-[
//           inset_0_1.5px_0_rgba(255,255,255,0.36),
//           inset_1px_0_0_rgba(255,255,255,0.09),
//           inset_-1px_0_0_rgba(157,146,255,0.10),
//           inset_0_-2px_3px_rgba(0,0,0,0.78),
//           inset_0_0_40px_rgba(122,108,240,0.025),
//           0_18px_40px_-18px_rgba(98,86,217,0.08),
//           0_35px_80px_-25px_rgba(0,0,0,0.88),
//           0_60px_130px_-40px_rgba(0,0,0,0.98)
//         ]

//         transition-all
//         duration-700
//         ease-out

//         hover:-translate-y-1
//         hover:scale-[1.005]

//         hover:border-white/[0.28]

//         hover:shadow-[
//           inset_0_1.5px_0_rgba(255,255,255,0.44),
//           inset_1px_0_0_rgba(255,255,255,0.11),
//           inset_-1px_0_0_rgba(157,146,255,0.14),
//           inset_0_-2px_3px_rgba(0,0,0,0.82),
//           inset_0_0_48px_rgba(122,108,240,0.035),
//           0_20px_45px_-18px_rgba(98,86,217,0.12),
//           0_45px_95px_-28px_rgba(0,0,0,0.93),
//           0_70px_150px_-42px_rgba(0,0,0,0.99)
//         ]

//         md:px-11
//         md:py-11
//       `}
//     >
//       {/* OUTER COOL-VIOLET AURA */}
//       <div
//         aria-hidden="true"
//         className="
//           pointer-events-none
//           absolute
//           -inset-[14px]
//           -z-20

//           rounded-[2.5rem]

//           bg-gradient-to-r
//           from-violet-400/[0.035]
//           via-transparent
//           to-indigo-400/[0.035]

//           blur-2xl
//         "
//       />

//       {/* BOTTOM AMBIENT GLOW */}
//       <div
//         aria-hidden="true"
//         className="
//           pointer-events-none
//           absolute
//           -bottom-14
//           left-1/2
//           -z-20

//           h-24
//           w-[72%]

//           -translate-x-1/2

//           rounded-full
//           bg-violet-500/[0.10]

//           blur-[60px]
//         "
//       />

//       {/* GLASS SURFACE */}
//       <div
//         aria-hidden="true"
//         className="
//           pointer-events-none
//           absolute
//           inset-0
//           -z-10

//           overflow-hidden
//           rounded-[2.15rem]
//         "
//       >
//         {/* top light */}
//         <div
//           className="
//             absolute
//             inset-x-0
//             top-0

//             h-[48%]

//             bg-gradient-to-b
//             from-white/[0.05]
//             via-white/[0.015]
//             to-transparent
//           "
//         />

//         {/* left cool reflection */}
//         <div
//           className="
//             absolute
//             -left-[15%]
//             -top-[35%]

//             h-[360px]
//             w-[420px]

//             rounded-full
//             bg-white/[0.045]

//             blur-[110px]
//           "
//         />

//         {/* violet reflection */}
//         <div
//           className="
//             absolute
//             left-[35%]
//             top-[5%]

//             h-[270px]
//             w-[320px]

//             rounded-full
//             bg-violet-400/[0.045]

//             blur-[100px]
//           "
//         />

//         {/* right smoked shading */}
//         <div
//           className="
//             absolute
//             inset-y-0
//             right-0

//             w-[38%]

//             bg-gradient-to-l
//             from-black/[0.40]
//             via-black/[0.12]
//             to-transparent
//           "
//         />

//         {/* bottom thickness */}
//         <div
//           className="
//             absolute
//             inset-x-0
//             bottom-0

//             h-[42%]

//             bg-gradient-to-t
//             from-black/[0.52]
//             via-black/[0.18]
//             to-transparent
//           "
//         />

//         {/* moving white reflection */}
//         <div
//           className="
//             absolute
//             -left-[30%]
//             -top-[125%]

//             h-[320%]
//             w-[24%]

//             rotate-[20deg]

//             bg-gradient-to-r
//             from-transparent
//             via-white/[0.055]
//             to-transparent

//             blur-xl

//             opacity-55

//             transition-all
//             duration-[1400ms]
//             ease-out

//             group-hover:left-[18%]
//             group-hover:opacity-85
//           "
//         />

//         {/* secondary violet reflection */}
//         <div
//           className="
//             absolute
//             -right-[20%]
//             -top-[50%]

//             h-[220%]
//             w-[18%]

//             rotate-[20deg]

//             bg-gradient-to-r
//             from-transparent
//             via-violet-300/[0.04]
//             to-transparent

//             blur-2xl
//           "
//         />
//       </div>

//       {/* TOP WHITE RIM */}
//       <div
//         aria-hidden="true"
//         className="
//           pointer-events-none
//           absolute
//           left-[4%]
//           right-[4%]
//           top-0

//           h-px

//           bg-gradient-to-r
//           from-transparent
//           via-white/75
//           to-transparent
//         "
//       />

//       {/* VIOLET TOP RIM */}
//       <div
//         aria-hidden="true"
//         className="
//           pointer-events-none
//           absolute
//           left-[16%]
//           right-[16%]
//           top-0

//           h-px

//           bg-gradient-to-r
//           from-transparent
//           via-violet-300/45
//           to-transparent
//         "
//       />

//       {/* LEFT EDGE */}
//       <div
//         aria-hidden="true"
//         className="
//           pointer-events-none
//           absolute
//           bottom-[8%]
//           left-0
//           top-[8%]

//           w-px

//           bg-gradient-to-b
//           from-transparent
//           via-white/18
//           to-transparent
//         "
//       />

//       {/* RIGHT VIOLET EDGE */}
//       <div
//         aria-hidden="true"
//         className="
//           pointer-events-none
//           absolute
//           bottom-[10%]
//           right-0
//           top-[10%]

//           w-px

//           bg-gradient-to-b
//           from-transparent
//           via-violet-200/20
//           to-transparent
//         "
//       />

//       {/* BOTTOM EDGE */}
//       <div
//         aria-hidden="true"
//         className="
//           pointer-events-none
//           absolute
//           bottom-0
//           left-[10%]
//           right-[10%]

//           h-px

//           bg-gradient-to-r
//           from-transparent
//           via-violet-300/22
//           to-transparent
//         "
//       />

//       {/* TOP LEFT SPECULAR */}
//       <div
//         aria-hidden="true"
//         className="
//           pointer-events-none
//           absolute
//           -left-2
//           -top-2

//           h-12
//           w-12

//           rounded-full
//           bg-white/[0.15]

//           blur-xl
//         "
//       />

//       {/* TOP RIGHT VIOLET SPECULAR */}
//       <div
//         aria-hidden="true"
//         className="
//           pointer-events-none
//           absolute
//           -right-2
//           -top-2

//           h-12
//           w-12

//           rounded-full
//           bg-violet-300/[0.15]

//           blur-xl
//         "
//       />

//       {/* INNER BEVEL */}
//       <div
//         aria-hidden="true"
//         className="
//           pointer-events-none
//           absolute
//           inset-[2px]

//           rounded-[2rem]

//           border
//           border-white/[0.035]

//           shadow-[
//             inset_0_0_24px_rgba(255,255,255,0.018),
//             inset_0_-30px_65px_rgba(0,0,0,0.24)
//           ]
//         "
//       />

//       {/* INNER EDGE */}
//       <div
//         aria-hidden="true"
//         className="
//           pointer-events-none
//           absolute
//           inset-[5px]

//           rounded-[1.85rem]

//           border
//           border-white/[0.018]
//         "
//       />

//       {/* CONTENT */}
//       <div className="relative z-10">
//         <div className="flex items-center gap-2">
//           <span
//             className="
//               h-[4px]
//               w-[4px]
//               rounded-full

//               bg-[#9f98ff]

//               shadow-[0_0_12px_rgba(159,152,255,0.90)]
//             "
//           />

//           <p
//             className="
//               text-[0.6875rem]
//               font-semibold
//               uppercase

//               tracking-[0.24em]

//               text-[#aaa4ff]
//             "
//           >
//             {service.name}
//           </p>
//         </div>

//         <h2
//           className="
//             mt-4

//             font-display

//             text-[2.25rem]
//             leading-[1.04]

//             tracking-[-0.02em]

//             text-white

//             drop-shadow-[0_5px_20px_rgba(0,0,0,0.48)]

//             sm:text-[2.65rem]
//           "
//         >
//           {service.headline}
//         </h2>

//         <p
//           className="
//             mt-4

//             max-w-[38ch]

//             text-[0.96rem]
//             leading-[1.75]

//             text-white/55
//           "
//         >
//           {service.teaser}
//         </p>

//         {/* DIVIDER */}
//         <div
//           className="
//             mt-7

//             h-px
//             w-full

//             bg-gradient-to-r
//             from-white/[0.16]
//             via-white/[0.07]
//             to-transparent
//           "
//         />

//         {/* SUB SERVICES */}
//         <div className="mt-6 flex flex-wrap gap-2.5">
//           {service.subServices.slice(0, 4).map((sub) => (
//             <span
//               key={sub}
//               className="
//                 rounded-full

//                 border
//                 border-white/[0.11]

//                 bg-gradient-to-b
//                 from-white/[0.065]
//                 to-black/[0.18]

//                 px-4
//                 py-1.5

//                 text-[0.74rem]
//                 font-medium

//                 text-white/65

//                 backdrop-blur-xl

//                 shadow-[
//                   inset_0_1px_0_rgba(255,255,255,0.09),
//                   inset_0_-1px_0_rgba(0,0,0,0.44),
//                   0_8px_20px_-12px_rgba(0,0,0,0.95)
//                 ]

//                 transition-all
//                 duration-300

//                 hover:-translate-y-[1px]
//                 hover:border-violet-300/30
//                 hover:bg-violet-300/[0.06]
//                 hover:text-white/90
//               "
//             >
//               {sub}
//             </span>
//           ))}
//         </div>

//         {/* CTA */}
//         <Link
//           href={`/services/${service.slug}`}
//           className="
//             group/cta
//             relative

//             mt-8

//             inline-flex
//             items-center
//             gap-3

//             overflow-hidden

//             rounded-full

//             px-6
//             py-2.5

//             text-[0.9rem]
//             font-semibold

//             transition-all
//             duration-300
//             ease-out

//             hover:-translate-y-[2px]
//             hover:scale-[1.035]
//           "
//           style={{
//             background: `
//               linear-gradient(
//                 180deg,
//                 ${CTA.from} 0%,
//                 #8176ef 48%,
//                 ${CTA.to} 100%
//               )
//             `,
//             color: CTA.text,
//             boxShadow: `
//               inset 0 1px 0 rgba(255,255,255,0.45),
//               inset 0 -2px 4px rgba(35,27,105,0.34),
//               0 0 0 1px rgba(160,150,255,0.14),
//               0 10px 26px -8px ${CTA.glow},
//               0 22px 50px -15px ${CTA.glow}
//             `,
//           }}
//         >
//           {/* button reflection */}
//           <span
//             aria-hidden="true"
//             className="
//               pointer-events-none
//               absolute
//               left-[12%]
//               right-[12%]
//               top-[1px]

//               h-px

//               bg-gradient-to-r
//               from-transparent
//               via-white/75
//               to-transparent
//             "
//           />

//           {/* moving button shine */}
//           <span
//             aria-hidden="true"
//             className="
//               pointer-events-none
//               absolute
//               -left-[45%]
//               top-0

//               h-full
//               w-[35%]

//               skew-x-[-20deg]

//               bg-gradient-to-r
//               from-transparent
//               via-white/22
//               to-transparent

//               transition-all
//               duration-700

//               group-hover/cta:left-[120%]
//             "
//           />

//           <span className="relative z-10">
//             View {service.name}
//           </span>

//           <span
//             aria-hidden="true"
//             className="
//               relative
//               z-10

//               text-lg

//               transition-transform
//               duration-300

//               group-hover/cta:translate-x-1
//             "
//           >
//             →
//           </span>
//         </Link>
//       </div>
//     </div>
//   );
// }





"use client";

// AI Automation card.
// Same responsive size/layout behaviour as Software Development,
// while preserving the premium graphite-violet glass styling.

import Link from "next/link";
import { getService } from "../../content";

const CTA = {
  from: "#9f98ff",
  to: "#6256d9",
  text: "#ffffff",
  glow: "rgba(98,86,217,0.52)",
};

export function AiAutomationGlassCard({
  entered,
}: {
  entered: boolean;
}) {
  const service = getService("ai-automation");

  if (!service) return null;

  return (
    <div
      className={`
        border-beam-violet
        group
        relative
        isolate
        overflow-hidden

        rounded-[1.5rem]

        border
        border-white/[0.20]

        bg-gradient-to-br
        from-[#302f3b]/[0.72]
        via-[#17171f]/[0.82]
        to-[#09090e]/[0.94]

        px-5
        py-6

        backdrop-blur-[28px]
        backdrop-saturate-[1.22]

        shadow-[
          inset_0_1.5px_0_rgba(255,255,255,0.36),
          inset_1px_0_0_rgba(255,255,255,0.09),
          inset_-1px_0_0_rgba(157,146,255,0.10),
          inset_0_-2px_3px_rgba(0,0,0,0.78),
          inset_0_0_40px_rgba(122,108,240,0.025),
          0_18px_40px_-18px_rgba(98,86,217,0.08),
          0_35px_80px_-25px_rgba(0,0,0,0.88),
          0_60px_130px_-40px_rgba(0,0,0,0.98)
        ]

        transition-all
        duration-700
        ease-out

        hover:-translate-y-1
        hover:scale-[1.005]

        hover:border-white/[0.28]

        hover:shadow-[
          inset_0_1.5px_0_rgba(255,255,255,0.44),
          inset_1px_0_0_rgba(255,255,255,0.11),
          inset_-1px_0_0_rgba(157,146,255,0.14),
          inset_0_-2px_3px_rgba(0,0,0,0.82),
          inset_0_0_48px_rgba(122,108,240,0.035),
          0_20px_45px_-18px_rgba(98,86,217,0.12),
          0_45px_95px_-28px_rgba(0,0,0,0.93),
          0_70px_150px_-42px_rgba(0,0,0,0.99)
        ]

        sm:rounded-[1.6rem]
        sm:px-6
        sm:py-6

        md:rounded-[1.65rem]
        md:px-7
        md:py-7

        lg:rounded-[2.15rem]
        lg:px-11
        lg:py-11
      `}
    >
      {/* OUTER COOL-VIOLET AURA */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -inset-[14px]
          -z-20

          rounded-[2.5rem]

          bg-gradient-to-r
          from-violet-400/[0.035]
          via-transparent
          to-indigo-400/[0.035]

          blur-2xl
        "
      />

      {/* BOTTOM AMBIENT GLOW */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-14
          left-1/2
          -z-20

          h-24
          w-[72%]

          -translate-x-1/2

          rounded-full
          bg-violet-500/[0.10]

          blur-[60px]
        "
      />

      {/* GLASS SURFACE */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          -z-10

          overflow-hidden

          rounded-[1.5rem]

          sm:rounded-[1.6rem]
          md:rounded-[1.65rem]
          lg:rounded-[2.15rem]
        "
      >
        {/* top light */}
        <div
          className="
            absolute
            inset-x-0
            top-0

            h-[48%]

            bg-gradient-to-b
            from-white/[0.05]
            via-white/[0.015]
            to-transparent
          "
        />

        {/* left cool reflection */}
        <div
          className="
            absolute
            -left-[15%]
            -top-[35%]

            h-[360px]
            w-[420px]

            rounded-full
            bg-white/[0.045]

            blur-[110px]
          "
        />

        {/* violet reflection */}
        <div
          className="
            absolute
            left-[35%]
            top-[5%]

            h-[270px]
            w-[320px]

            rounded-full
            bg-violet-400/[0.045]

            blur-[100px]
          "
        />

        {/* right smoked shading */}
        <div
          className="
            absolute
            inset-y-0
            right-0

            w-[38%]

            bg-gradient-to-l
            from-black/[0.40]
            via-black/[0.12]
            to-transparent
          "
        />

        {/* bottom thickness */}
        <div
          className="
            absolute
            inset-x-0
            bottom-0

            h-[42%]

            bg-gradient-to-t
            from-black/[0.52]
            via-black/[0.18]
            to-transparent
          "
        />

        {/* moving white reflection */}
        <div
          className="
            absolute
            -left-[30%]
            -top-[125%]

            h-[320%]
            w-[24%]

            rotate-[20deg]

            bg-gradient-to-r
            from-transparent
            via-white/[0.055]
            to-transparent

            blur-xl
            opacity-55

            transition-all
            duration-[1400ms]
            ease-out

            group-hover:left-[18%]
            group-hover:opacity-85
          "
        />

        {/* secondary violet reflection */}
        <div
          className="
            absolute
            -right-[20%]
            -top-[50%]

            h-[220%]
            w-[18%]

            rotate-[20deg]

            bg-gradient-to-r
            from-transparent
            via-violet-300/[0.04]
            to-transparent

            blur-2xl
          "
        />
      </div>

      {/* TOP WHITE RIM */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-[4%]
          right-[4%]
          top-0

          h-px

          bg-gradient-to-r
          from-transparent
          via-white/75
          to-transparent
        "
      />

      {/* VIOLET TOP RIM */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-[16%]
          right-[16%]
          top-0

          h-px

          bg-gradient-to-r
          from-transparent
          via-violet-300/45
          to-transparent
        "
      />

      {/* LEFT EDGE */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-[8%]
          left-0
          top-[8%]

          w-px

          bg-gradient-to-b
          from-transparent
          via-white/18
          to-transparent
        "
      />

      {/* RIGHT VIOLET EDGE */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-[10%]
          right-0
          top-[10%]

          w-px

          bg-gradient-to-b
          from-transparent
          via-violet-200/20
          to-transparent
        "
      />

      {/* BOTTOM EDGE */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-0
          left-[10%]
          right-[10%]

          h-px

          bg-gradient-to-r
          from-transparent
          via-violet-300/22
          to-transparent
        "
      />

      {/* TOP LEFT SPECULAR */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -left-2
          -top-2

          h-12
          w-12

          rounded-full
          bg-white/[0.15]

          blur-xl
        "
      />

      {/* TOP RIGHT VIOLET SPECULAR */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-2
          -top-2

          h-12
          w-12

          rounded-full
          bg-violet-300/[0.15]

          blur-xl
        "
      />

      {/* INNER BEVEL */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-[2px]

          rounded-[1.4rem]

          border
          border-white/[0.035]

          shadow-[
            inset_0_0_24px_rgba(255,255,255,0.018),
            inset_0_-30px_65px_rgba(0,0,0,0.24)
          ]

          sm:rounded-[1.5rem]
          md:rounded-[1.55rem]
          lg:rounded-[2rem]
        "
      />

      {/* INNER EDGE */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-[5px]

          rounded-[1.3rem]

          border
          border-white/[0.018]

          sm:rounded-[1.4rem]
          md:rounded-[1.45rem]
          lg:rounded-[1.85rem]
        "
      />

      {/* CONTENT */}
      <div className="relative z-10">
        {/* LABEL */}
        <div className="flex items-center gap-2">
          <span
            className="
              h-[3px]
              w-[3px]
              shrink-0

              rounded-full

              bg-[#9f98ff]

              shadow-[0_0_12px_rgba(159,152,255,0.90)]

              lg:h-[4px]
              lg:w-[4px]
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

              text-[#aaa4ff]

              sm:text-[0.6rem]
              sm:tracking-[0.19em]

              md:text-[0.625rem]
              md:tracking-[0.2em]

              lg:text-[0.6875rem]
              lg:tracking-[0.24em]
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

            drop-shadow-[0_5px_20px_rgba(0,0,0,0.48)]

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

            max-w-[38ch]

            text-[0.8rem]
            leading-[1.5]

            text-white/55

            sm:text-[0.82rem]

            md:text-[0.85rem]

            lg:mt-4
            lg:text-[0.96rem]
            lg:leading-[1.75]
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
            from-white/[0.16]
            via-white/[0.07]
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
            flex-wrap

            gap-1.5

            sm:gap-2

            md:mt-4

            lg:mt-6
            lg:gap-2.5
          "
        >
          {service.subServices.slice(0, 4).map((sub) => (
            <span
              key={sub}
              className="
                rounded-full

                border
                border-white/[0.11]

                bg-gradient-to-b
                from-white/[0.065]
                to-black/[0.18]

                px-2.5
                py-1

                text-[0.64rem]
                font-medium

                text-white/65

                backdrop-blur-xl

                shadow-[
                  inset_0_1px_0_rgba(255,255,255,0.09),
                  inset_0_-1px_0_rgba(0,0,0,0.44),
                  0_8px_20px_-12px_rgba(0,0,0,0.95)
                ]

                transition-all
                duration-300

                hover:-translate-y-[1px]
                hover:border-violet-300/30
                hover:bg-violet-300/[0.06]
                hover:text-white/90

                sm:px-3
                sm:text-[0.67rem]

                md:px-3
                md:text-[0.7rem]

                lg:px-4
                lg:py-1.5
                lg:text-[0.74rem]
              "
            >
              {sub}
            </span>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/ai-automation"
          className="
            group/cta
            relative

            mt-5

            inline-flex
            max-w-full

            items-center
            gap-2

            overflow-hidden

            rounded-full

            px-4
            py-2

            text-[0.76rem]
            font-semibold

            transition-all
            duration-300
            ease-out

            hover:-translate-y-[1px]
            hover:scale-[1.02]

            sm:px-4.5
            sm:py-2.25
            sm:text-[0.78rem]

            md:mt-6
            md:px-5
            md:py-2.5
            md:text-[0.82rem]

            lg:mt-8
            lg:gap-3
            lg:px-6
            lg:py-2.5
            lg:text-[0.9rem]

            lg:hover:-translate-y-[2px]
            lg:hover:scale-[1.035]
          "
          style={{
            background: `
              linear-gradient(
                180deg,
                ${CTA.from} 0%,
                #8176ef 48%,
                ${CTA.to} 100%
              )
            `,
            color: CTA.text,
            boxShadow: `
              inset 0 1px 0 rgba(255,255,255,0.45),
              inset 0 -2px 4px rgba(35,27,105,0.34),
              0 0 0 1px rgba(160,150,255,0.14),
              0 10px 26px -8px ${CTA.glow},
              0 22px 50px -15px ${CTA.glow}
            `,
          }}
        >
          {/* BUTTON REFLECTION */}
          <span
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              left-[12%]
              right-[12%]
              top-[1px]

              h-px

              bg-gradient-to-r
              from-transparent
              via-white/75
              to-transparent
            "
          />

          {/* MOVING BUTTON SHINE */}
          <span
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              -left-[45%]
              top-0

              h-full
              w-[35%]

              skew-x-[-20deg]

              bg-gradient-to-r
              from-transparent
              via-white/22
              to-transparent

              transition-all
              duration-700

              group-hover/cta:left-[120%]
            "
          />

          <span className="relative z-10 truncate">
            View {service.name}
          </span>

          <span
            aria-hidden="true"
            className="
              relative
              z-10
              shrink-0

              text-base

              transition-transform
              duration-300

              group-hover/cta:translate-x-1

              lg:text-lg
            "
          >
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
