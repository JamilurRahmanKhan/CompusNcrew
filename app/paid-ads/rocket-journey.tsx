"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import type { Service } from "../content";

/* ─── Interpolation ──────────────────────────────────────────────────────── */

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function smoothstep(e0: number, e1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}
function interpAt<T extends Record<string, number>>(path: T[], p: number): T {
  if (p <= path[0].p) return path[0];
  const last = path[path.length - 1];
  if (p >= last.p) return last;
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i];
    const b = path[i + 1];
    if (p <= b.p) {
      const t = smoothstep(a.p, b.p, p);
      const out = {} as T;
      for (const k of Object.keys(a) as (keyof T)[]) {
        out[k] = (k === "p" ? p : lerp(a[k] as number, b[k] as number, t)) as T[keyof T];
      }
      return out;
    }
  }
  return last;
}

/* ─── Waypoint tables (progress 0→1 across the whole pinned scene) ────────
   Chapters: intro (0–.09) → ignite + ascend to Google (.09–.35) →
   dock at Google (.35–.50) → relaunch + travel to Meta (.50–.72) →
   dock at Meta (.72–.90) → release (.90–1). Mobile uses a narrower x range
   so the rocket and panels never approach the viewport edge. Panels are
   lane-centred (see StationPanel) rather than edge-anchored, which is what
   keeps the rocket clear of the panel at any viewport width — the docked x
   here matches each panel's lane centre. */

type Pose = { p: number; x: number; y: number; rot: number; scale: number };

const ROCKET_DESKTOP: Pose[] = [
  { p: 0.0, x: 50, y: 70, rot: 0, scale: 1.0 },
  { p: 0.09, x: 50, y: 66, rot: 0, scale: 1.0 },
  { p: 0.24, x: 27, y: 30, rot: -16, scale: 0.68 },
  { p: 0.35, x: 24, y: 20, rot: -3, scale: 0.48 },
  { p: 0.5, x: 24, y: 20, rot: -3, scale: 0.48 },
  { p: 0.61, x: 50, y: 24, rot: 12, scale: 0.78 },
  { p: 0.72, x: 76, y: 20, rot: 3, scale: 0.48 },
  { p: 0.9, x: 76, y: 20, rot: 3, scale: 0.48 },
  { p: 1.0, x: 76, y: 4, rot: 3, scale: 0.3 },
];

const ROCKET_MOBILE: Pose[] = [
  { p: 0.0, x: 50, y: 70, rot: 0, scale: 1.0 },
  { p: 0.09, x: 50, y: 66, rot: 0, scale: 1.0 },
  { p: 0.24, x: 36, y: 28, rot: -14, scale: 0.4 },
  { p: 0.35, x: 33, y: 19, rot: -3, scale: 0.26 },
  { p: 0.5, x: 33, y: 19, rot: -3, scale: 0.26 },
  { p: 0.61, x: 50, y: 22, rot: 10, scale: 0.46 },
  { p: 0.72, x: 67, y: 19, rot: 3, scale: 0.26 },
  { p: 0.9, x: 67, y: 19, rot: 3, scale: 0.26 },
  { p: 1.0, x: 67, y: 4, rot: 3, scale: 0.22 },
];

const FLAME: { p: number; v: number }[] = [
  { p: 0.0, v: 0.05 },
  { p: 0.05, v: 0.05 },
  { p: 0.1, v: 1 },
  { p: 0.28, v: 1 },
  { p: 0.34, v: 0.32 },
  { p: 0.5, v: 0.32 },
  { p: 0.56, v: 1 },
  { p: 0.68, v: 1 },
  { p: 0.74, v: 0.32 },
  { p: 0.9, v: 0.32 },
  { p: 0.95, v: 1 },
  { p: 1.0, v: 0.8 },
];

/* Hard pose swaps, not a crossfade — the upright and banked renders are two
   different photographed silhouettes, so blending their opacity together
   (the previous 0.06-wide fade windows) showed both at once as a ghosted
   double image. A near-instant swap at the peak of each turn reads as a
   clean sprite change instead, hidden by the rocket's own motion. */
const BANK: { p: number; o: number }[] = [
  { p: 0.0, o: 0 },
  { p: 0.18, o: 0 },
  { p: 0.181, o: 1 },
  { p: 0.3, o: 1 },
  { p: 0.301, o: 0 },
  { p: 0.63, o: 0 },
  { p: 0.631, o: 1 },
  { p: 0.69, o: 1 },
  { p: 0.691, o: 0 },
  { p: 1.0, o: 0 },
];

const GOOGLE_PANEL: { p: number; o: number; y: number }[] = [
  { p: 0.0, o: 0, y: 20 },
  { p: 0.35, o: 0, y: 20 },
  { p: 0.41, o: 1, y: 0 },
  { p: 0.51, o: 1, y: 0 },
  { p: 0.57, o: 0, y: -14 },
  { p: 1.0, o: 0, y: -14 },
];

const META_PANEL: { p: number; o: number; y: number }[] = [
  { p: 0.0, o: 0, y: 20 },
  { p: 0.72, o: 0, y: 20 },
  { p: 0.78, o: 1, y: 0 },
  { p: 0.89, o: 1, y: 0 },
  { p: 0.94, o: 0, y: -14 },
  { p: 1.0, o: 0, y: -14 },
];

const INTRO: { p: number; o: number; y: number }[] = [
  { p: 0.0, o: 1, y: 0 },
  { p: 0.06, o: 1, y: 0 },
  { p: 0.14, o: 0, y: -24 },
  { p: 1.0, o: 0, y: -24 },
];

const CUE: { p: number; o: number }[] = [
  { p: 0.0, o: 1 },
  { p: 0.05, o: 1 },
  { p: 0.09, o: 0 },
  { p: 1.0, o: 0 },
];

const CHAPTERS_VH = 520;
const BASE = "/media/services/paid-ads";

export function RocketJourney({ service }: { service: Service }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const rocketRef = useRef<HTMLDivElement>(null);
  const bankRef = useRef<HTMLImageElement>(null);
  const flameRef = useRef<HTMLDivElement>(null);
  const starNearRef = useRef<HTMLDivElement>(null);
  const starFarRef = useRef<HTMLDivElement>(null);
  const googlePanelRef = useRef<HTMLDivElement>(null);
  const metaPanelRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef(false);

  const [reducedMotion, setReducedMotion] = useState<boolean | null>(null);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);
    const onMotionChange = () => setReducedMotion(motionQuery.matches);
    motionQuery.addEventListener("change", onMotionChange);

    const widthQuery = window.matchMedia("(max-width: 720px)");
    mobileRef.current = widthQuery.matches;
    const onWidthChange = (e: MediaQueryListEvent) => {
      mobileRef.current = e.matches;
    };
    widthQuery.addEventListener("change", onWidthChange);

    return () => {
      motionQuery.removeEventListener("change", onMotionChange);
      widthQuery.removeEventListener("change", onWidthChange);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion !== false) return;
    const stage = stageRef.current;
    if (!stage) return;

    let visible = false;
    let ticking = false;

    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), {
      threshold: 0,
    });
    io.observe(stage);

    function apply(p: number) {
      const rocketPath = mobileRef.current ? ROCKET_MOBILE : ROCKET_DESKTOP;
      const pose = interpAt(rocketPath, p);
      if (rocketRef.current) {
        rocketRef.current.style.transform = `translate3d(${pose.x}vw, ${pose.y}vh, 0) translate(-50%, -50%) rotate(${pose.rot}deg) scale(${pose.scale})`;
      }
      if (flameRef.current) flameRef.current.style.opacity = String(interpAt(FLAME, p).v);
      if (bankRef.current) bankRef.current.style.opacity = String(interpAt(BANK, p).o);

      const gp = interpAt(GOOGLE_PANEL, p);
      if (googlePanelRef.current) {
        googlePanelRef.current.style.opacity = String(gp.o);
        googlePanelRef.current.style.transform = `translate(-50%, 0) translateY(${gp.y}px)`;
      }
      const mp = interpAt(META_PANEL, p);
      if (metaPanelRef.current) {
        metaPanelRef.current.style.opacity = String(mp.o);
        metaPanelRef.current.style.transform = `translate(-50%, 0) translateY(${mp.y}px)`;
      }
      const intro = interpAt(INTRO, p);
      if (introRef.current) {
        introRef.current.style.opacity = String(intro.o);
        introRef.current.style.transform = `translateY(${intro.y}px)`;
      }
      if (cueRef.current) cueRef.current.style.opacity = String(interpAt(CUE, p).o);
      if (starNearRef.current) starNearRef.current.style.transform = `translate3d(0, ${-p * 160}px, 0)`;
      if (starFarRef.current) starFarRef.current.style.transform = `translate3d(0, ${-p * 70}px, 0)`;
    }

    function onScroll() {
      if (!visible || ticking || !stage) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const rect = stage.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
        apply(p);
      });
    }

    // Apply the starting pose synchronously so nothing flashes at its
    // unstyled default — onScroll() alone would defer this through both an
    // IntersectionObserver callback and a rAF tick.
    {
      const rect = stage.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      apply(total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [reducedMotion]);

  if (reducedMotion === null) return <div className="rocket-stage h-[70svh]" />;
  if (reducedMotion) return <StaticJourney service={service} />;

  return (
    <section
      ref={stageRef}
      className="relative"
      style={{ height: `${CHAPTERS_VH}vh` }}
      aria-label={`${service.name} — Google Ads and Meta Ads`}
    >
      <div className="on-dark rocket-stage sticky top-0 h-[100dvh] overflow-hidden">
        <div ref={starFarRef} className="rocket-star-layer rocket-star-layer--far" aria-hidden="true" />
        <div ref={starNearRef} className="rocket-star-layer rocket-star-layer--near" aria-hidden="true" />

        {/* Screen-reader summary — the visual journey is decorative motion,
            this carries the same content in plain reading order. */}
        <p className="sr-only">
          {service.headline} {service.lead} Two stations: Google Ads for search
          demand, and Meta Ads for feed-native creative.
        </p>

        <div ref={introRef} className="absolute inset-x-0 top-[13%] px-6 text-center" aria-hidden="true">
          <p className="eyebrow">Two channels, one trajectory.</p>
          <h1 className="display display-lg mx-auto mt-4 max-w-[24ch]">{service.headline}</h1>
          <p className="lead mx-auto mt-4 max-w-[42ch]">{service.lead}</p>
        </div>

        <StationPanel
          panelRef={googlePanelRef}
          lane="left"
          index="01"
          icon={`${BASE}/google-ads-badge.webp`}
          mockup={`${BASE}/google-ads-mockup.webp`}
          accent="from-[#4285F4] via-[#FBBC05] to-[#34A853]"
          eyebrow="Station 01 — Google Ads"
          heading="Search demand, caught the moment it appears."
          body="Campaigns built where people are already looking — Search, Shopping and remarketing, tracked back to a real lead."
          tags={["Search", "Shopping", "Landing Pages"]}
        />
        <StationPanel
          panelRef={metaPanelRef}
          lane="right"
          index="02"
          icon={`${BASE}/meta-ads-badge.webp`}
          mockup={`${BASE}/meta-ads-mockup.webp`}
          accent="from-[#0064E0] to-[#00C6FF]"
          eyebrow="Station 02 — Meta Ads"
          heading="Feed-native creative that stops the scroll."
          body="Facebook and Instagram placements with creative tested in structure, not on a hunch, and retargeting that closes the loop."
          tags={["Feed & Stories", "Retargeting", "Creative Testing"]}
        />

        <div
          ref={rocketRef}
          className="absolute left-0 top-0 aspect-[728/1210] w-[clamp(120px,16vw,240px)]"
          style={{ willChange: "transform" }}
        >
          <div
            ref={flameRef}
            className="rocket-flame absolute left-1/2 top-[88%] h-[30%] w-[40%] -translate-x-1/2"
            aria-hidden="true"
          />
          {/* Both poses fill the same fixed-aspect box (object-contain,
              bottom-anchored) so crossfading between them never changes the
              rocket's apparent size — the two source images have different
              natural aspect ratios. */}
          <img
            src={`${BASE}/rocket-upright.webp`}
            alt=""
            className="absolute inset-0 block h-full w-full object-contain object-bottom"
            aria-hidden="true"
          />
          <img
            ref={bankRef}
            src={`${BASE}/rocket-bank.webp`}
            alt=""
            className="absolute inset-0 block h-full w-full object-contain object-bottom opacity-0"
            aria-hidden="true"
          />
        </div>

        <div ref={cueRef} className="absolute inset-x-0 bottom-8 text-center" aria-hidden="true">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.3em] text-white/45">
            Scroll to launch
          </p>
        </div>
      </div>
    </section>
  );
}

/* Lane-centred, not edge-anchored: left/right sit at 24%/76% of the viewport
   (matching the rocket's docked x above) and the width is capped in vw so
   the panel's own half-width never reaches the rocket's lane or the
   viewport edge, at any window size. Mobile collapses both lanes to a
   single centred column. */
function StationPanel({
  panelRef,
  lane,
  index,
  icon,
  mockup,
  accent,
  eyebrow,
  heading,
  body,
  tags,
}: {
  panelRef: RefObject<HTMLDivElement | null>;
  lane: "left" | "right";
  index: string;
  icon: string;
  mockup: string;
  accent: string;
  eyebrow: string;
  heading: string;
  body: string;
  tags: string[];
}) {
  const laneClass = lane === "left" ? "md:left-[24%]" : "md:left-[76%]";
  return (
    <div
      ref={panelRef}
      className={`rocket-panel isolate absolute left-1/2 bottom-[3%] w-[min(22rem,88vw)] overflow-hidden opacity-0 md:w-[min(22rem,40vw)] ${laneClass}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-1 -z-10 select-none font-display text-[4.5rem] leading-none text-white/[0.05]"
      >
        {index}
      </span>

      <div className="relative aspect-[16/6.5] w-full overflow-hidden">
        <img src={mockup} alt="" className="block h-full w-full object-cover object-top" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c12] via-[#0a0c12]/10 to-transparent" />
        <div className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${accent}`} />
      </div>

      <div className="px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
        <div className="flex items-center gap-2.5">
          <img src={icon} alt="" className="h-5 w-5 rounded-full" aria-hidden="true" />
          <p className="text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-white/50">{eyebrow}</p>
        </div>
        <h3 className="mt-2.5 font-display text-[1.3rem] leading-[1.1] text-white sm:text-[1.45rem]">{heading}</h3>
        <p className="mt-2.5 text-[0.8rem] leading-relaxed text-white/60">{body}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[0.7rem] font-medium text-white/55">
          {tags.map((tag, i) => (
            <span key={tag} className="inline-flex items-center gap-3">
              {i > 0 && <span aria-hidden="true" className="h-1 w-1 rounded-full bg-white/25" />}
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function StaticJourney({ service }: { service: Service }) {
  return (
    <section className="on-dark rocket-stage relative overflow-hidden px-6 py-24">
      <div className="relative mx-auto max-w-[40rem] text-center">
        <p className="eyebrow">Two channels, one trajectory.</p>
        <h1 className="display display-lg mt-4">{service.headline}</h1>
        <p className="lead mx-auto mt-4">{service.lead}</p>
      </div>

      <div className="relative mx-auto mt-16 grid max-w-[64rem] gap-8 sm:grid-cols-2">
        <StaticStation
          icon={`${BASE}/google-ads-badge.webp`}
          mockup={`${BASE}/google-ads-mockup.webp`}
          accent="from-[#4285F4] via-[#FBBC05] to-[#34A853]"
          eyebrow="Station 01 — Google Ads"
          heading="Search demand, caught the moment it appears."
          body="Campaigns built where people are already looking — Search, Shopping and remarketing, tracked back to a real lead."
          tags={["Search", "Shopping", "Landing Pages"]}
        />
        <StaticStation
          icon={`${BASE}/meta-ads-badge.webp`}
          mockup={`${BASE}/meta-ads-mockup.webp`}
          accent="from-[#0064E0] to-[#00C6FF]"
          eyebrow="Station 02 — Meta Ads"
          heading="Feed-native creative that stops the scroll."
          body="Facebook and Instagram placements with creative tested in structure, not on a hunch, and retargeting that closes the loop."
          tags={["Feed & Stories", "Retargeting", "Creative Testing"]}
        />
      </div>
    </section>
  );
}

function StaticStation({
  icon,
  mockup,
  accent,
  eyebrow,
  heading,
  body,
  tags,
}: {
  icon: string;
  mockup: string;
  accent: string;
  eyebrow: string;
  heading: string;
  body: string;
  tags: string[];
}) {
  return (
    <div className="rocket-panel overflow-hidden">
      <div className="relative aspect-[16/6.5] w-full overflow-hidden">
        <img src={mockup} alt="" className="block h-full w-full object-cover object-top" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c12] via-[#0a0c12]/10 to-transparent" />
        <div className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${accent}`} />
      </div>
      <div className="px-7 pb-7 pt-5">
        <div className="flex items-center gap-2.5">
          <img src={icon} alt="" className="h-5 w-5 rounded-full" aria-hidden="true" />
          <p className="text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-white/50">{eyebrow}</p>
        </div>
        <h3 className="mt-3 font-display text-[1.4rem] leading-[1.1] text-white">{heading}</h3>
        <p className="mt-3 text-[0.85rem] leading-relaxed text-white/60">{body}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[0.75rem] font-medium text-white/55">
          {tags.map((tag, i) => (
            <span key={tag} className="inline-flex items-center gap-3">
              {i > 0 && <span aria-hidden="true" className="h-1 w-1 rounded-full bg-white/25" />}
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
