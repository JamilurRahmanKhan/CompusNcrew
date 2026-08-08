// "use client";

// import Link from "next/link";
// import { getService } from "../content";
// import { PixelDissolveCard } from "./pixel-dissolve-card";
// import { GLASS_CARDS } from "./service-takeover";
// import { Reveal } from "./reveal";

// type Chip = { label: string; slug: string };

// /**
//  * Hovering (desktop) or clicking/tapping (any device) a chip swaps the
//  * default hero card for that service's own glass card — see ./service-cards
//  * — in the exact same box, via crossfade, so the two never fight for space
//  * regardless of screen size. Selection is sticky: once a chip is active it
//  * stays showing until another chip is hovered/clicked, or the SAME chip is
//  * clicked again — that's the way back to the default screen. Clicking a
//  * chip never navigates by itself; only the "View X" button inside the
//  * active card does. Keyboard focus behaves the same as hover.
//  */
// export function ServiceChipRail({
//   chips,
//   headline,
//   lead,
//   hoveredSlug,
//   onHover,
// }: {
//   chips: Chip[];
//   headline: string[];
//   lead: string;
//   hoveredSlug: string | null;
//   onHover: (slug: string | null) => void;
// }) {
//   const active = hoveredSlug ? getService(hoveredSlug) : null;
//   const ActiveCard = hoveredSlug ? GLASS_CARDS[hoveredSlug] : null;

//   return (
//     <>
//       {/* Sine bulge, both axes: mobile curves down (a smile, hugging the
//           card's bottom edge) via translateY, desktop curves right (a
//           half-circle) via translateX — same formula, different axis per
//           layout. Active chip steps further out + scales up. */}
//       <Reveal as="ul" className="order-2 flex flex-wrap gap-1.5 self-start lg:order-1 lg:w-[17rem] lg:flex-col lg:items-start lg:gap-2.5 lg:self-center">
//         {chips.map((chip, i) => {
//           const t = Math.sin((i / Math.max(chips.length - 1, 1)) * Math.PI);
//           const isActive = chip.slug === hoveredSlug;
//           return (
//             <li
//               key={chip.slug}
//               style={{
//                 transitionDelay: `${i * 40}ms`,
//                 ["--ay" as string]: `${-t * 22 - (isActive ? 8 : 0)}px`,
//                 ["--ax" as string]: `${t * 52 + (isActive ? 18 : 0)}px`,
//               }}
//               className="origin-top transition-transform duration-300 ease-out [transform:translateY(var(--ay))] lg:origin-left lg:[transform:translateX(var(--ax))]"
//             >
//               <Link
//                 href={`/services/${chip.slug}`}
//                 className={`pill transition-transform duration-300 ${isActive ? "scale-110" : ""}`}
//                 aria-current={isActive ? "true" : undefined}
//                 onMouseEnter={() => onHover(chip.slug)}
//                 onFocus={() => onHover(chip.slug)}
//                 onClick={(e) => {
//                   e.preventDefault();
//                   onHover(isActive ? null : chip.slug);
//                 }}
//               >
//                 {chip.label}
//               </Link>
//             </li>
//           );
//         })}
//       </Reveal>

//       {/* `grid` + every child on col/row 1: the box auto-sizes to whichever
//           child is tallest right now (default card or the active service's,
//           which vary a lot in content length), instead of a guessed fixed
//           min-height the taller ones would overflow past — on mobile, where
//           the chip rail sits directly below this box, that overflow used to
//           mean the card's bottom edge cutting through the chips. */}
//       <Reveal className="relative order-1 grid lg:order-2" delay={120}>
//         <PixelDissolveCard
//           className={`col-start-1 row-start-1 min-h-[22rem] transition-opacity duration-500 lg:min-h-[24rem] ${
//             active ? "pointer-events-none opacity-0" : "opacity-100"
//           }`}
//         >
//           <div className="flex h-full flex-col justify-end" aria-hidden={active ? "true" : undefined}>
//             <p
//               className="max-w-[38ch] text-[1.0625rem] leading-relaxed text-muted lg:ml-auto lg:mb-10 lg:text-right"
//               style={{ textShadow: "0 2px 16px rgba(0,0,0,0.5)" }}
//             >
//               {lead}
//             </p>

//             <h1 className="display display-xl" style={{ textShadow: "0 4px 30px rgba(0,0,0,0.55)" }}>
//               {headline.map((line) => (
//                 <span key={line} className="block">
//                   {line}
//                 </span>
//               ))}
//             </h1>

//             <div className="mt-9 flex flex-wrap gap-3">
//               <Link href="/contact" className="pill">
//                 Start a project
//               </Link>
//               <Link href="/method" className="pill">
//                 How we work
//               </Link>
//             </div>
//           </div>
//         </PixelDissolveCard>

//         {ActiveCard && (
//           <div
//             className="col-start-1 row-start-1 self-start transition-all duration-700 ease-out"
//             style={{
//               opacity: active ? 1 : 0,
//               transform: active ? "scale(1) translateY(0)" : "scale(0.96) translateY(10px)",
//               transitionDelay: active ? "160ms" : "0ms",
//               pointerEvents: active ? "auto" : "none",
//             }}
//           >
//             <div className="relative">
//               <ActiveCard entered={!!active} />
//               {/* Explicit way back to the default screen — clicking the
//                   same chip again does the same thing, but this is the
//                   discoverable version. */}
//               <button
//                 type="button"
//                 aria-label="Back to default"
//                 onClick={() => onHover(null)}
//                 className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white/70 backdrop-blur-md transition-colors hover:bg-black/50 hover:text-white"
//               >
//                 ×
//               </button>
//             </div>
//           </div>
//         )}
//       </Reveal>
//     </>
//   );
// }

// "use client";

// import Link from "next/link";
// import { getService } from "../content";
// import { PixelDissolveCard } from "./pixel-dissolve-card";
// import { GLASS_CARDS } from "./service-takeover";
// import { Reveal } from "./reveal";

// type Chip = {
//   label: string;
//   slug: string;
// };

// /**
//  * Mobile:
//  * - Chips stay completely inside the viewport.
//  * - Pills shrink automatically on very small screens.
//  * - The smile/arc layout is preserved.
//  * - Glass cards are forced to respect the available width.
//  *
//  * Desktop:
//  * - Keeps the existing right-side half-circle layout.
//  */
// export function ServiceChipRail({
//   chips,
//   headline,
//   lead,
//   hoveredSlug,
//   onHover,
// }: {
//   chips: Chip[];
//   headline: string[];
//   lead: string;
//   hoveredSlug: string | null;
//   onHover: (slug: string | null) => void;
// }) {
//   const active = hoveredSlug ? getService(hoveredSlug) : null;
//   const ActiveCard = hoveredSlug ? GLASS_CARDS[hoveredSlug] : null;

//   return (
//     <>
//       {/* =========================================================
//           SERVICE OPTIONS / CHIP RAIL
//           ========================================================= */}
//       <Reveal
//         as="ul"
//         className="
//           order-2
//           mt-20

//           flex
//           w-full
//           min-w-0
//           max-w-full
//           flex-nowrap
//           items-end
//           justify-center

         
//           gap-0
//           overflow-visible

//           px-2
//           pb-3

//           sm:mt-8
//           sm:gap-1
//           sm:px-3

//           lg:order-1
//           lg:mt-0
//           lg:w-[17rem]
//           lg:min-w-[17rem]
//           lg:max-w-[17rem]
//           lg:flex-col
//           lg:items-start
//           lg:justify-start
//           lg:gap-2.5
//           lg:self-center
//           lg:px-0
//           lg:pb-0
//         "
//       >
//         {chips.map((chip, i) => {
//           const denominator = Math.max(chips.length - 1, 1);

//           const t = Math.sin((i / denominator) * Math.PI);

//           const isActive = chip.slug === hoveredSlug;

//           /*
//            * Mobile curve.
//            *
//            * Reduced from 28px to 22px because extremely narrow screens
//            * have less vertical/horizontal breathing room.
//            */
//           const ay = -t * 110 - (isActive ? 5 : 0);

//           /*
//            * Desktop half-circle.
//            */
//           const ax = t * 62 + (isActive ? 18 : 0);

//           return (
//             <li
//               key={chip.slug}
//               style={
//                 {
//                   transitionDelay: `${i * 40}ms`,

//                   "--ay": `${ay}px`,
//                   "--ax": `${ax}px`,

//                   /*
//                    * Each mobile chip receives an equal fraction
//                    * of the available viewport width.
//                    */
//                   "--chip-count": chips.length,
//                 } as React.CSSProperties
//               }
//               className="
//                 min-w-max
//                 shrink-0

//                 origin-bottom

//                 transition-transform
//                 duration-300
//                 ease-out

//                 [transform:translateY(var(--ay))]

//                 lg:w-auto
//                 lg:min-w-max
//                 lg:shrink-0
//                 lg:origin-left
//                 lg:[transform:translateX(var(--ax))]
//               "
//             >
//               <Link
//                 href={`/services/${chip.slug}`}
//                 aria-current={isActive ? "true" : undefined}
//                 onMouseEnter={() => onHover(chip.slug)}
//                 onFocus={() => onHover(chip.slug)}
//                 onClick={(e) => {
//                   e.preventDefault();

//                   onHover(isActive ? null : chip.slug);
//                 }}
//                 className={`
//                   pill

//                   inline-flex
// w-max
// min-w-max
// shrink-0
// items-center
// justify-center

// overflow-visible
// whitespace-nowrap

//                   px-[clamp(0.1rem,0.7vw,0.3rem)]
//                   py-1.5

//                   text-[clamp(0.52rem,1.7vw,0.65rem)]
//                   leading-none

//                   transition-transform
//                   duration-300

//                   sm:px-2
//                   sm:text-[0.7rem]

//                   md:px-2.5
//                   md:text-[0.8125rem]

//                   lg:inline-flex
//                   lg:w-auto
//                   lg:max-w-none
//                   lg:overflow-visible
//                   lg:px-4
//                   lg:py-2
//                   lg:text-[0.875rem]

//                   ${isActive ? "scale-[1.04] lg:scale-110" : "scale-100"}
//                 `}
//                 title={chip.label}
//               >
//                 <span className="block whitespace-nowrap">
//   {chip.label}
// </span>
//               </Link>
//             </li>
//           );
//         })}
//       </Reveal>

//       {/* =========================================================
//           HERO / GLASS CARD AREA
//           ========================================================= */}
//       <Reveal
//         delay={120}
//         className="
//           relative
//           order-1

//           grid

//           w-full
//           min-w-0
//           max-w-full

//           overflow-visible

//           lg:order-2
//         "
//       >
//         {/* =======================================================
//             DEFAULT CARD
//             ======================================================= */}
//         <PixelDissolveCard
//           className={`
//             col-start-1
//             row-start-1

//             w-full
//             min-w-0
//             max-w-full

//             min-h-[18rem]

//             overflow-hidden

//             transition-opacity
//             duration-500

//             sm:min-h-[21rem]
//             lg:min-h-[24rem]

//             ${active ? "pointer-events-none opacity-0" : "opacity-100"}
//           `}
//         >
//           <div
//             className="
//               flex
//               h-full
//               w-full
//               min-w-0
//               max-w-full
//               flex-col
//               justify-end
//             "
//             aria-hidden={active ? "true" : undefined}
//           >
//             <p
//               className="
//                 max-w-[38ch]

//                 text-[0.95rem]
//                 leading-relaxed
//                 text-muted

//                 sm:text-[1rem]
//                 md:text-[1.0625rem]

//                 lg:mb-10
//                 lg:ml-auto
//                 lg:text-right
//               "
//               style={{
//                 textShadow: "0 2px 16px rgba(0,0,0,0.5)",
//               }}
//             >
//               {lead}
//             </p>

//             <h1
//               className="
//                 display
//                 display-xl

//                 max-w-full

//                 break-words
//               "
//               style={{
//                 textShadow: "0 4px 30px rgba(0,0,0,0.55)",
//               }}
//             >
//               {headline.map((line) => (
//                 <span
//                   key={line}
//                   className="
//                     block
//                     max-w-full
//                   "
//                 >
//                   {line}
//                 </span>
//               ))}
//             </h1>

//             <div
//               className="
//                 mt-7

//                 flex
//                 max-w-full
//                 flex-wrap

//                 gap-2

//                 sm:mt-9
//                 sm:gap-3
//               "
//             >
//               <Link
//                 href="/contact"
//                 className="
//                   pill
//                   max-w-full
//                   text-center
//                 "
//               >
//                 Start a project
//               </Link>

//               <Link
//                 href="/method"
//                 className="
//                   pill
//                   max-w-full
//                   text-center
//                 "
//               >
//                 How we work
//               </Link>
//             </div>
//           </div>
//         </PixelDissolveCard>

//         {/* =======================================================
//             ACTIVE SERVICE GLASS CARD
//             ======================================================= */}
//         {ActiveCard && (
//           <div
//             className="
//               col-start-1
//               row-start-1

//               w-full
//               min-w-0
//               max-w-full

//               self-start

//               transition-all
//               duration-700
//               ease-out
//             "
//             style={{
//               opacity: active ? 1 : 0,

//               transform: active
//                 ? "scale(1) translateY(0)"
//                 : "scale(0.97) translateY(10px)",

//               transitionDelay: active ? "160ms" : "0ms",

//               pointerEvents: active ? "auto" : "none",
//             }}
//           >
//             <div
//               className="
//                 relative

//                 w-full
//                 min-w-0
//                 max-w-full

//                 overflow-hidden

//                 rounded-[2.15rem]
//               "
//             >
//               {/* Prevent service cards from exceeding viewport width */}
//               <div
//                 className="
//                   w-full
//                   min-w-0
//                   max-w-full

//                   [&>*]:w-full
//                   [&>*]:min-w-0
//                   [&>*]:max-w-full
//                 "
//               >
//                 <ActiveCard entered={!!active} />
//               </div>

//               {/* Back button */}
//               <button
//                 type="button"
//                 aria-label="Back to default"
//                 onClick={() => onHover(null)}
//                 className="
//                   absolute
//                   right-3
//                   top-3
//                   z-20

//                   flex
//                   h-8
//                   w-8
//                   shrink-0

//                   items-center
//                   justify-center

//                   rounded-full

//                   border
//                   border-white/15

//                   bg-black/30

//                   text-lg
//                   text-white/70

//                   backdrop-blur-md

//                   transition-colors

//                   hover:bg-black/50
//                   hover:text-white

//                   sm:right-4
//                   sm:top-4
//                 "
//               >
//                 ×
//               </button>
//             </div>
//           </div>
//         )}
//       </Reveal>
//     </>
//   );
// }




"use client";

import Link from "next/link";
import { getService } from "../content";
import { PixelDissolveCard } from "./pixel-dissolve-card";
import { GLASS_CARDS } from "./service-takeover";
import { Reveal } from "./reveal";

type Chip = {
  label: string;
  slug: string;
};

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
      {/* =========================================================
          SERVICE OPTIONS / CHIP RAIL
          ========================================================= */}
      <Reveal
        as="ul"
        className="
          order-2
          mt-20

          flex
          w-full
          min-w-0
          max-w-full
          flex-nowrap
          items-end
          justify-center

          overflow-visible

          px-0
          pb-3

          sm:mt-8

          lg:order-1
          lg:mt-0
          lg:w-[17rem]
          lg:min-w-[17rem]
          lg:max-w-[17rem]
          lg:flex-col
          lg:items-start
          lg:justify-start
          lg:gap-2.5
          lg:self-center
          lg:px-0
          lg:pb-0
        "
      >
        {chips.map((chip, i) => {
          const denominator = Math.max(chips.length - 1, 1);

          const progress = i / denominator;

          /*
           * Semicircle / arc.
           */
          const t = Math.sin(progress * Math.PI);

          const isActive = chip.slug === hoveredSlug;

          /* =====================================================
             MOBILE VERTICAL CURVE

             Keep the strong vertical curve.
             ===================================================== */
          const ay = -t * 110 - (isActive ? 5 : 0);

          /* =====================================================
             MOBILE HORIZONTAL COMPRESSION

             Pull the outside of the arc strongly toward the center.

             Left side  -> moves right
             Right side -> moves left

             72 controls how aggressively the arc is compressed.
             ===================================================== */

          const normalizedX = progress * 2 - 1;

          const mobileX =
            -normalizedX *
            Math.pow(Math.abs(normalizedX), 1.35) *
            72;

          /* =====================================================
             DESKTOP CURVE
             ===================================================== */
          const ax = t * 62 + (isActive ? 18 : 0);

          return (
            <li
              key={chip.slug}
              style={
                {
                  transitionDelay: `${i * 40}ms`,

                  "--ay": `${ay}px`,
                  "--mobile-x": `${mobileX}px`,
                  "--ax": `${ax}px`,
                } as React.CSSProperties
              }
              className="
                min-w-max
                shrink-0

                -mx-[3px]

                origin-bottom

                transition-transform
                duration-300
                ease-out

                [transform:translate(var(--mobile-x),var(--ay))]

                sm:-mx-[2px]

                lg:mx-0
                lg:w-auto
                lg:min-w-max
                lg:shrink-0
                lg:origin-left

                lg:[transform:translateX(var(--ax))]
              "
            >
              <Link
                href={`/services/${chip.slug}`}
                aria-current={isActive ? "true" : undefined}
                onMouseEnter={() => onHover(chip.slug)}
                onFocus={() => onHover(chip.slug)}
                onClick={(e) => {
                  e.preventDefault();
                  onHover(isActive ? null : chip.slug);
                }}
                className={`
                  pill

                  inline-flex
                  w-max
                  min-w-max
                  shrink-0

                  items-center
                  justify-center

                  whitespace-nowrap
                  overflow-visible

                  px-2
                  py-1.5

                  text-[0.62rem]
                  leading-none

                  transition-transform
                  duration-300
                  ease-out

                  min-[380px]:px-2.5
                  min-[380px]:text-[0.65rem]

                  sm:px-3
                  sm:text-[0.7rem]

                  md:px-3
                  md:text-[0.8125rem]

                  lg:inline-flex
                  lg:w-auto
                  lg:max-w-none
                  lg:px-4
                  lg:py-2
                  lg:text-[0.875rem]

                  ${
                    isActive
                      ? "scale-[1.04] lg:scale-110"
                      : "scale-100"
                  }
                `}
                title={chip.label}
              >
                <span className="block whitespace-nowrap">
                  {chip.label}
                </span>
              </Link>
            </li>
          );
        })}
      </Reveal>

      {/* =========================================================
          HERO / GLASS CARD AREA
          ========================================================= */}
      <Reveal
        delay={120}
        className="
          relative
          order-1

          grid

          w-full
          min-w-0
          max-w-full

          overflow-visible

          lg:order-2
        "
      >
        {/* =======================================================
            DEFAULT CARD
            ======================================================= */}
        <PixelDissolveCard
          className={`
            col-start-1
            row-start-1

            w-full
            min-w-0
            max-w-full

            min-h-[18rem]

            overflow-hidden

            transition-opacity
            duration-500

            sm:min-h-[21rem]
            lg:min-h-[24rem]

            ${
              active
                ? "pointer-events-none opacity-0"
                : "opacity-100"
            }
          `}
        >
          <div
            className="
              flex
              h-full
              w-full
              min-w-0
              max-w-full
              flex-col
              justify-end
            "
            aria-hidden={active ? "true" : undefined}
          >
            <p
              className="
                max-w-[38ch]

                text-[0.95rem]
                leading-relaxed
                text-muted

                sm:text-[1rem]
                md:text-[1.0625rem]

                lg:mb-10
                lg:ml-auto
                lg:text-right
              "
              style={{
                textShadow: "0 2px 16px rgba(0,0,0,0.5)",
              }}
            >
              {lead}
            </p>

            <h1
              className="
                display
                display-xl

                max-w-full
                break-words
              "
              style={{
                textShadow: "0 4px 30px rgba(0,0,0,0.55)",
              }}
            >
              {headline.map((line) => (
                <span
                  key={line}
                  className="block max-w-full"
                >
                  {line}
                </span>
              ))}
            </h1>

            <div
              className="
                mt-7

                flex
                max-w-full
                flex-wrap

                gap-2

                sm:mt-9
                sm:gap-3
              "
            >
              <Link
                href="/contact"
                className="pill max-w-full text-center"
              >
                Start a project
              </Link>

              <Link
                href="/method"
                className="pill max-w-full text-center"
              >
                How we work
              </Link>
            </div>
          </div>
        </PixelDissolveCard>

        {/* =======================================================
            ACTIVE SERVICE GLASS CARD
            ======================================================= */}
        {ActiveCard && (
          <div
            className="
              col-start-1
              row-start-1

              w-full
              min-w-0
              max-w-full

              self-start

              transition-all
              duration-700
              ease-out
            "
            style={{
              opacity: active ? 1 : 0,

              transform: active
                ? "scale(1) translateY(0)"
                : "scale(0.97) translateY(10px)",

              transitionDelay: active ? "160ms" : "0ms",

              pointerEvents: active ? "auto" : "none",
            }}
          >
            <div
              className="
                relative

                w-full
                min-w-0
                max-w-full

                overflow-hidden

                rounded-[2.15rem]
              "
            >
              <div
                className="
                  w-full
                  min-w-0
                  max-w-full

                  [&>*]:w-full
                  [&>*]:min-w-0
                  [&>*]:max-w-full
                "
              >
                <ActiveCard entered={!!active} />
              </div>

              <button
                type="button"
                aria-label="Back to default"
                onClick={() => onHover(null)}
                className="
                  absolute
                  right-3
                  top-3
                  z-20

                  flex
                  h-8
                  w-8
                  shrink-0

                  items-center
                  justify-center

                  rounded-full

                  border
                  border-white/15

                  bg-black/30

                  text-lg
                  text-white/70

                  backdrop-blur-md

                  transition-colors

                  hover:bg-black/50
                  hover:text-white

                  sm:right-4
                  sm:top-4
                "
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