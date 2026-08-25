"use client";

import { useEffect, useRef } from "react";
import styles from "./conveyor-journey.module.css";

const STAGES = [
  {
    label: "ATTRACT",
    desc: "New Lead",
    first: true,
    path: (
      <>
        <path d="M12 2 L12 6" strokeLinecap="round" />
        <path d="M12 18 L12 22" strokeLinecap="round" />
        <path d="M2 12 L6 12" strokeLinecap="round" />
        <path d="M18 12 L22 12" strokeLinecap="round" />
        <circle cx="12" cy="12" r="4" />
      </>
    ),
  },
  {
    label: "NURTURE",
    desc: "Follow-Up (Email / SMS)",
    path: (
      <>
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <path d="M4 7l8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    label: "CONVERT",
    desc: "Booking / Appointment",
    path: (
      <>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M4 10h16" strokeLinecap="round" />
        <path d="M8 3v4M16 3v4" strokeLinecap="round" />
        <path d="M9 14l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    label: "SERVE",
    desc: "Deliver Great Service",
    path: (
      <>
        <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    label: "DELIGHT",
    desc: "Review & Referral",
    path: (
      <path
        d="M12 4l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4-3.9-3.8 5.4-.8L12 4z"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: "RETAIN",
    desc: "Re-Engage & Upsell",
    path: (
      <>
        <path d="M4 12a8 8 0 0 1 13.7-5.7L20 8" strokeLinecap="round" />
        <path d="M20 4v4h-4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 12a8 8 0 0 1-13.7 5.7L4 16" strokeLinecap="round" />
        <path d="M4 20v-4h4" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    label: "GROW",
    desc: "Repeat Customer, More Revenue",
    path: (
      <>
        <path d="M3 17l6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 7h6v6" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
];

const NODE_WIDTH = 152;
const ARROW_WIDTH = 30;
const STAGE_UNIT = NODE_WIDTH + ARROW_WIDTH;
const GROUP_WIDTH = STAGE_UNIT * STAGES.length - ARROW_WIDTH;
const TOTAL_WIDTH = GROUP_WIDTH * 2;
const ROLLER_SPACING = 78;

function buildRollers() {
  const rollers: number[] = [];
  const count = Math.round(TOTAL_WIDTH / ROLLER_SPACING);
  for (let i = 0; i <= count; i += 1) {
    const x = 20 + i * ROLLER_SPACING;
    if (x > TOTAL_WIDTH - 20) break;
    rollers.push(x);
  }
  return rollers;
}

const ROLLERS = buildRollers();

function StageGroup() {
  return (
    <div className={styles.stage}>
      {STAGES.map((stage, index) => (
        <div key={`${stage.label}-${index}`} className={styles.stageItem}>
          <div className={`${styles.node} ${stage.first ? styles.nodeFirst : ""}`}>
            <div className={styles.icon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                {stage.path}
              </svg>
            </div>
            <div className={styles.label}>{stage.label}</div>
            <div className={styles.desc}>{stage.desc}</div>
          </div>
          {index < STAGES.length - 1 && (
            <div className={styles.arrow} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M4 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ServerMachine() {
  return (
    <div className={styles.svMachine} aria-hidden="true">
      <div className={styles.svLeft}>
        <div className={styles.svVentsTop}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div className={styles.svVentLine} key={i} />
          ))}
        </div>

        <div className={styles.svRacks}>
          {[
            [styles.svRed, styles.svBlinkSlow, styles.svGreen, styles.svBlinkR1],
            [styles.svBlue, styles.svBlinkFast, styles.svGreen, styles.svBlinkR2],
            [styles.svRed, "", styles.svGreen, styles.svBlinkR3],
            [styles.svYellow, styles.svBlinkSlow, styles.svGreen, styles.svBlinkFast],
            [styles.svRed, styles.svBlinkR1, styles.svBlue, styles.svBlinkSlow],
          ].map((leds, i) => (
            <div className={styles.svBlade} key={i}>
              <div className={styles.svBladeDots}>
                <div className={styles.svBladeDot} />
                <div className={styles.svBladeDot} />
                <div className={styles.svBladeDot} />
              </div>
              <div className={styles.svBladeLeds}>
                <div className={`${styles.svLed} ${leds[0]} ${leds[1]}`} />
                <div className={`${styles.svLed} ${leds[2]} ${leds[3]}`} />
              </div>
            </div>
          ))}
        </div>

        <div className={`${styles.svRacks} ${styles.svRacksBottom}`}>
          <div className={`${styles.svBlade} ${styles.svBladeShort}`}>
            <span className={styles.svScreenTitleMuted}>SERVS</span>
            <div className={styles.svBladeLeds}>
              <div className={`${styles.svLed} ${styles.svGreen} ${styles.svBlinkFast}`} />
              <div className={`${styles.svLed} ${styles.svGreen} ${styles.svBlinkFast}`} />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.svRight}>
        <div className={styles.svScreen}>
          <div className={styles.svScreenTitle}>Data Receiver</div>
          <svg className={styles.svMailIcon} viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
          </svg>
        </div>

        <div className={styles.svLedMatrix}>
          <div className={`${styles.svLed} ${styles.svGreen} ${styles.svBlinkR1}`} />
          <div className={`${styles.svLed} ${styles.svGreen} ${styles.svBlinkFast}`} />
          <div className={`${styles.svLed} ${styles.svGreen} ${styles.svBlinkR3}`} />
          <div className={`${styles.svLed} ${styles.svRed} ${styles.svBlinkSlow}`} />
          <div className={`${styles.svLed} ${styles.svBlue} ${styles.svBlinkR2}`} />
          <div className={`${styles.svLed} ${styles.svRed} ${styles.svBlinkFast}`} />
        </div>

        <div className={styles.svPorts}>
          <div className={styles.svPortWide} />
          <div className={styles.svPortSquare} />
          <div className={styles.svPortSquare} />
          <div className={styles.svPortWide} />
        </div>

        <div className={styles.svVentsBottom}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div className={styles.svVentLine} key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ConveyorJourney() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const track = trackRef.current;
    if (!scroller || !track) return;

    let resumeTimer: ReturnType<typeof setTimeout> | null = null;

    const pauseAuto = () => {
      scroller.classList.add(styles.paused);
      if (resumeTimer) clearTimeout(resumeTimer);
    };
    const scheduleResume = () => {
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => scroller.classList.remove(styles.paused), 2500);
    };
    const onScroll = () => {
      const half = track.scrollWidth / 2;
      if (scroller.scrollLeft >= half) {
        scroller.scrollLeft -= half;
      } else if (scroller.scrollLeft <= 0 && scroller.scrollLeft !== 0) {
        scroller.scrollLeft += half;
      }
    };

    const pauseEvents: (keyof HTMLElementEventMap)[] = ["pointerdown", "wheel", "touchstart"];
    const resumeEvents: (keyof HTMLElementEventMap)[] = ["pointerup", "touchend", "mouseleave"];

    pauseEvents.forEach((evt) => scroller.addEventListener(evt, pauseAuto, { passive: true }));
    resumeEvents.forEach((evt) => scroller.addEventListener(evt, scheduleResume, { passive: true }));
    scroller.addEventListener("mouseenter", pauseAuto);
    scroller.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      pauseEvents.forEach((evt) => scroller.removeEventListener(evt, pauseAuto));
      resumeEvents.forEach((evt) => scroller.removeEventListener(evt, scheduleResume));
      scroller.removeEventListener("mouseenter", pauseAuto);
      scroller.removeEventListener("scroll", onScroll);
      if (resumeTimer) clearTimeout(resumeTimer);
    };
  }, []);

  return (
    <div className={styles.stageWrap}>
      <ServerMachine />
      <div className={`${styles.fade} ${styles.fadeLeft}`} aria-hidden="true" />
      <div className={`${styles.fade} ${styles.fadeRight}`} aria-hidden="true" />

      <div className={styles.scroller} ref={scrollerRef} tabIndex={0} aria-label="Customer journey stages, drag to explore">
        <div className={`${styles.track} ${styles.trackAuto}`} ref={trackRef}>
          <StageGroup />
          <StageGroup />
          <div className={styles.beltWrap} style={{ width: TOTAL_WIDTH }}>
            <div className={styles.beltBand} />
            <div className={styles.beltLine} />
            {ROLLERS.map((x) => (
              <div className={styles.roller} key={x} style={{ left: x }}>
                <div className={styles.rollerInner} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
