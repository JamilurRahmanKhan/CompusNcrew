"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./graphic-design.module.css";

const services = [
  {
    title: "Digital Product Design",
    desc: "We design digital products from early concepts to scalable systems. Combining product strategy, UX and interface design, we help startups and established companies turn complex ideas into clear, usable experiences.",
  },
  {
    title: "Web Design & Development",
    desc: "We create marketing websites that explain products clearly, strengthen brands and support business growth. From structure and content to responsive design and development, every website is built around a specific goal.",
  },
  {
    title: "UX Research & UI Design",
    desc: "We uncover how people use digital products and where their experience breaks down. Through research, user flows, wireframes and prototypes, we improve usability before moving into interface design.",
  },
  {
    title: "Brand Identity",
    desc: "We create visual identities that give companies a distinct and consistent presence. From typography and color to digital guidelines and campaign assets, every element is designed to work as one system.",
  },
  {
    title: "Creative Development",
    desc: "We bring ambitious digital concepts to life through motion, 3D and interactive development. Using technologies such as WebGL, GSAP and modern JavaScript frameworks, we build experiences that standard templates cannot deliver.",
  },
];

/** Sticky-stacking service cards — each opens to its description as it pins to the top. */
export function ServiceStack() {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const activeRef = useRef(-1);

  useEffect(() => {
    // Hysteresis: a card opens as soon as it nears the top of the viewport,
    // but only closes once it has been scrolled a long way back down —
    // so a small scroll up doesn't immediately close it.
    const openLine = () => window.innerHeight * 0.4;
    const closeLine = () => window.innerHeight * 0.55;

    let raf = 0;
    const measure = () => {
      raf = 0;
      let idx = activeRef.current;

      while (
        idx + 1 < services.length &&
        itemRefs.current[idx + 1] &&
        itemRefs.current[idx + 1]!.getBoundingClientRect().top <= openLine()
      ) {
        idx++;
      }
      while (
        idx >= 0 &&
        itemRefs.current[idx] &&
        itemRefs.current[idx]!.getBoundingClientRect().top >= closeLine()
      ) {
        idx--;
      }

      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActiveIndex(idx);
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="bg-white px-6 py-24 md:px-16">
      <div className="mx-auto mb-16 flex max-w-4xl flex-col gap-4 md:flex-row md:items-start md:gap-16">
        <p className="text-sm font-medium tracking-[0.2em] text-black/40 uppercase">
          What we do
        </p>
        <p className="max-w-2xl text-2xl leading-snug text-black/70 md:text-3xl">
          Every engagement starts with the same question — what does this
          brand need to say, and how do we make it impossible to ignore.
          From there we build the identity, the campaign, and everything
          that carries it.
        </p>
      </div>

      <div className="mx-auto max-w-4xl">
        {services.map((item, i) => {
          const state = i <= activeIndex ? "active" : "idle";
          return (
            <div
              key={item.title}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              data-index={i}
              className={styles.stackItem}
              style={
                i === services.length - 1
                  ? undefined
                  : { height: state === "active" ? "15rem" : "6.5rem" }
              }
            >
              <div
                className={`${styles.stackCard} ${
                  state === "idle" ? styles.stackIdle : styles.stackDark
                } ${state === "active" ? styles.stackActive : ""}`}
                style={{ top: `${5.5 + i * 1.1}rem` }}
              >
                <div
                  aria-hidden="true"
                  className={`${styles.stackPattern} ${styles[`stackPattern${i % 5}`]}`}
                />
                <div className="relative flex items-center justify-between gap-6">
                  <h3 className="text-2xl font-medium md:text-3xl">{item.title}</h3>
                  <span className={styles.stackNum}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div
                  className={`relative ${styles.stackDescWrap} ${
                    state === "active" ? styles.stackDescOpen : ""
                  }`}
                >
                  <p className="max-w-xl pt-4 text-white/70">{item.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
