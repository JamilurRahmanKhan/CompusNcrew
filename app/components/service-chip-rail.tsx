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

//           overflow-visible

//           px-0
//           pb-3

//           sm:mt-8

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

//           const progress = i / denominator;

//           /*
//            * Semicircle / arc.
//            */
//           const t = Math.sin(progress * Math.PI);

//           const isActive = chip.slug === hoveredSlug;

//           /* =====================================================
//              MOBILE VERTICAL CURVE

//              Keep the strong vertical curve.
//              ===================================================== */
//           const ay = -t * 110 - (isActive ? 5 : 0);

//           /* =====================================================
//              MOBILE HORIZONTAL COMPRESSION

//              Pull the outside of the arc strongly toward the center.

//              Left side  -> moves right
//              Right side -> moves left

//              72 controls how aggressively the arc is compressed.
//              ===================================================== */

//           const normalizedX = progress * 2 - 1;

//           const mobileX =
//             -normalizedX *
//             Math.pow(Math.abs(normalizedX), 1.35) *
//             72;

//           /* =====================================================
//              DESKTOP CURVE
//              ===================================================== */
//           const ax = t * 62 + (isActive ? 18 : 0);

//           return (
//             <li
//               key={chip.slug}
//               style={
//                 {
//                   transitionDelay: `${i * 40}ms`,

//                   "--ay": `${ay}px`,
//                   "--mobile-x": `${mobileX}px`,
//                   "--ax": `${ax}px`,
//                 } as React.CSSProperties
//               }
//               className="
//                 min-w-max
//                 shrink-0

//                 -mx-[3px]

//                 origin-bottom

//                 transition-transform
//                 duration-300
//                 ease-out

//                 [transform:translate(var(--mobile-x),var(--ay))]

//                 sm:-mx-[2px]

//                 lg:mx-0
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
//                   w-max
//                   min-w-max
//                   shrink-0

//                   items-center
//                   justify-center

//                   whitespace-nowrap
//                   overflow-visible

//                   px-2
//                   py-1.5

//                   text-[0.62rem]
//                   leading-none

//                   transition-transform
//                   duration-300
//                   ease-out

//                   min-[380px]:px-2.5
//                   min-[380px]:text-[0.65rem]

//                   sm:px-3
//                   sm:text-[0.7rem]

//                   md:px-3
//                   md:text-[0.8125rem]

//                   lg:inline-flex
//                   lg:w-auto
//                   lg:max-w-none
//                   lg:px-4
//                   lg:py-2
//                   lg:text-[0.875rem]

//                   ${
//                     isActive
//                       ? "scale-[1.04] lg:scale-110"
//                       : "scale-100"
//                   }
//                 `}
//                 title={chip.label}
//               >
//                 <span className="block whitespace-nowrap">
//                   {chip.label}
//                 </span>
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

//             ${
//               active
//                 ? "pointer-events-none opacity-0"
//                 : "opacity-100"
//             }
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
//                   className="block max-w-full"
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
//                 className="pill max-w-full text-center"
//               >
//                 Start a project
//               </Link>

//               <Link
//                 href="/method"
//                 className="pill max-w-full text-center"
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
//           mt-6

//           grid
//           w-full
//           min-w-0
//           max-w-full

//           grid-cols-4
//           gap-2

//           px-1
//           pb-3

//           sm:mt-7
//           sm:gap-2.5
//           sm:px-2

//           md:mt-8
//           md:gap-3
//           md:px-3

//           lg:order-1
//           lg:mt-0
//           lg:flex
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
//           const progress = i / denominator;

//           /*
//            * Desktop semicircle curve only.
//            * Mobile + tablet use the normal 4-column grid.
//            */
//           const t = Math.sin(progress * Math.PI);

//           const isActive = chip.slug === hoveredSlug;

//           /*
//            * Desktop horizontal arc.
//            */
//           const ax = t * 62 + (isActive ? 18 : 0);

//           return (
//             <li
//               key={chip.slug}
//               style={
//                 {
//                   transitionDelay: `${i * 40}ms`,
//                   "--ax": `${ax}px`,
//                 } as React.CSSProperties
//               }
//               className="
//                 min-w-0
//                 w-full

//                 transition-transform
//                 duration-300
//                 ease-out

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

//                   flex
//                   w-full
//                   min-w-0

//                   items-center
//                   justify-center

//                   whitespace-nowrap

//                   px-1.5
//                   py-2

//                   text-center
//                   text-[0.58rem]
//                   leading-none

//                   transition-transform
//                   duration-300
//                   ease-out

//                   min-[360px]:px-2
//                   min-[360px]:text-[0.62rem]

//                   min-[400px]:text-[0.67rem]

//                   sm:px-2.5
//                   sm:py-2.5
//                   sm:text-[0.72rem]

//                   md:px-3
//                   md:text-[0.8rem]

//                   lg:inline-flex
//                   lg:w-auto
//                   lg:min-w-max
//                   lg:px-4
//                   lg:py-2
//                   lg:text-[0.875rem]

//                   ${
//                     isActive
//                       ? "scale-[1.03] lg:scale-110"
//                       : "scale-100"
//                   }
//                 `}
//                 title={chip.label}
//               >
//                 <span
//                   className="
//                     block
//                     min-w-0
//                     max-w-full
//                     overflow-hidden
//                     text-ellipsis
//                     whitespace-nowrap
//                   "
//                 >
//                   {chip.label}
//                 </span>
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

//             ${
//               active
//                 ? "pointer-events-none opacity-0"
//                 : "opacity-100"
//             }
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
//                   className="block max-w-full"
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
//                 className="pill max-w-full text-center"
//               >
//                 Start a project
//               </Link>

//               <Link
//                 href="/method"
//                 className="pill max-w-full text-center"
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

//           Mobile + Tablet:
//           - 4 columns
//           - 2 rows
//           - moved slightly upward toward glass card

//           Desktop:
//           - original curved vertical rail
//           ========================================================= */}
//       <Reveal
//         as="ul"
//         className="
//           order-2

//           -mt-2

//           grid
//           w-full
//           min-w-0
//           max-w-full

//           grid-cols-4

//           gap-x-2
//           gap-y-2

//           px-1
//           pb-2

//           sm:-mt-3
//           sm:gap-x-2.5
//           sm:gap-y-2
//           sm:px-2

//           md:-mt-4
//           md:gap-x-3
//           md:gap-y-2.5
//           md:px-3

//           lg:order-1
//           lg:mt-0

//           lg:flex

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
//           const progress = i / denominator;

//           /*
//            * Desktop semicircle curve only.
//            *
//            * Mobile/tablet ignore this transform
//            * and remain in the 4-column grid.
//            */
//           const t = Math.sin(progress * Math.PI);

//           const isActive = chip.slug === hoveredSlug;

//           /*
//            * Original desktop horizontal curve.
//            */
//           const ax = t * 62 + (isActive ? 18 : 0);

//           return (
//             <li
//               key={chip.slug}
//               style={
//                 {
//                   transitionDelay: `${i * 40}ms`,
//                   "--ax": `${ax}px`,
//                 } as React.CSSProperties
//               }
//               className="
//                 w-full
//                 min-w-0

//                 transition-transform
//                 duration-300
//                 ease-out

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

//                   flex
//                   w-full
//                   min-w-0

//                   items-center
//                   justify-center

//                   overflow-hidden
//                   whitespace-nowrap

//                   px-1.5
//                   py-2

//                   text-center
//                   text-[0.58rem]
//                   leading-none

//                   transition-transform
//                   duration-300
//                   ease-out

//                   min-[360px]:px-2
//                   min-[360px]:text-[0.62rem]

//                   min-[400px]:text-[0.67rem]

//                   sm:px-2.5
//                   sm:py-2.5
//                   sm:text-[0.72rem]

//                   md:px-3
//                   md:py-2.5
//                   md:text-[0.8rem]

//                   lg:inline-flex
//                   lg:w-auto
//                   lg:min-w-max

//                   lg:px-4
//                   lg:py-2

//                   lg:text-[0.875rem]

//                   ${
//                     isActive
//                       ? "scale-[1.03] lg:scale-110"
//                       : "scale-100"
//                   }
//                 `}
//                 title={chip.label}
//               >
//                 <span
//                   className="
//                     block
//                     min-w-0
//                     max-w-full

//                     overflow-hidden
//                     text-ellipsis
//                     whitespace-nowrap
//                   "
//                 >
//                   {chip.label}
//                 </span>
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

//             ${
//               active
//                 ? "pointer-events-none opacity-0"
//                 : "opacity-100"
//             }
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
//             {/* Lead */}
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

//             {/* Headline */}
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

//             {/* CTA buttons */}
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
//               {/* Active service component */}
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

//               {/* Close / reset button */}
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
          SERVICE OPTIONS

          Mobile / tablet:
          - 4 columns x 2 rows
          - when a service is active, move options higher

          Desktop:
          - original curved rail
          ========================================================= */}
      <Reveal
        as="ul"
        className={`
          order-2

          grid
          w-full
          min-w-0
          max-w-full

          grid-cols-4

          gap-x-2
          gap-y-2

          px-1
          pb-2

          transition-all
          duration-500
          ease-out

          ${
            hoveredSlug
              ? "-mt-8 sm:-mt-10 md:-mt-12"
              : "-mt-2 sm:-mt-3 md:-mt-4"
          }

          sm:gap-x-2.5
          sm:gap-y-2
          sm:px-2

          md:gap-x-3
          md:gap-y-2.5
          md:px-3

          lg:order-1
          lg:mt-0

          lg:flex

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
        `}
      >
        {chips.map((chip, i) => {
          const denominator = Math.max(chips.length - 1, 1);
          const progress = i / denominator;

          const t = Math.sin(progress * Math.PI);
          const isActive = chip.slug === hoveredSlug;

          const ax = t * 62 + (isActive ? 18 : 0);

          return (
            <li
              key={chip.slug}
              style={
                {
                  transitionDelay: `${i * 40}ms`,
                  "--ax": `${ax}px`,
                } as React.CSSProperties
              }
              className="
                w-full
                min-w-0

                transition-transform
                duration-300
                ease-out

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
                  // Always select — never toggle off. Touch fires
                  // onMouseEnter just before onClick, which already sets
                  // hoveredSlug to this chip; a toggle here would then
                  // read isActive as true and close it right back to
                  // default instead of switching. The × button (see
                  // GlassCard) is the one way back to default now.
                  e.preventDefault();
                  onHover(chip.slug);
                }}
                className={`
                  pill

                  flex
                  w-full
                  min-w-0

                  items-center
                  justify-center

                  overflow-hidden
                  whitespace-nowrap

                  px-1.5
                  py-2

                  text-center
                  text-[0.58rem]
                  leading-none

                  transition-transform
                  duration-300
                  ease-out

                  min-[360px]:px-2
                  min-[360px]:text-[0.62rem]

                  min-[400px]:text-[0.67rem]

                  sm:px-2.5
                  sm:py-2.5
                  sm:text-[0.72rem]

                  md:px-3
                  md:py-2.5
                  md:text-[0.8rem]

                  lg:inline-flex
                  lg:w-auto
                  lg:min-w-max

                  lg:px-4
                  lg:py-2

                  lg:text-[0.875rem]

                  ${
                    isActive
                      ? "scale-[1.03] lg:scale-110"
                      : "scale-100"
                  }
                `}
                title={chip.label}
              >
                <span
                  className="
                    block
                    min-w-0
                    max-w-full

                    overflow-hidden
                    text-ellipsis
                    whitespace-nowrap
                  "
                >
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
        {/* DEFAULT CARD */}
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

        {/* ACTIVE SERVICE CARD */}
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