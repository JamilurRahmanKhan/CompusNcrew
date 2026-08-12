"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ChevronDown, Clapperboard, Layers, Lightbulb, Play, ScanSearch, Send, SlidersHorizontal, Sparkles, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styles from "./video-editing.module.css";

const capabilities = [
  [Clapperboard, "Product video", "Shape features and benefits into a concise story people can understand without a sales call."],
  [Layers, "Social cuts", "Platform-native edits in vertical, square and landscape formats—with interface-safe composition."],
  [Zap, "Ad creative", "Multiple openings and pacing variants made to test which idea earns the next second."],
  [Sparkles, "Case stories", "Turn interviews, proof and product footage into an argument a buyer will actually finish."],
] as const;

const process = [
  ["01", "Find the promise", "We define the audience, desired response and single idea the cut must make obvious."],
  ["02", "Build the openings", "Several hooks are scripted against the same footage before the timeline gets precious."],
  ["03", "Cut the system", "Rhythm, captions, sound, graphics and platform formats are edited as one connected system."],
  ["04", "Learn from retention", "Drop-off and commercial response guide the next variant—not opinions in the review thread."],
] as const;

const faqs = [
  ["Do you film the footage?", "Editing is the core scope. Filming and on-site production can be quoted separately when required."],
  ["How many versions do we receive?", "The standard scope includes one approved master, platform-specific formats and agreed hook variants."],
  ["Are captions and motion graphics included?", "Yes. Burned-in captions, lower thirds, end cards and scoped motion graphics are part of the edit."],
  ["How do revisions work?", "Two structured revision rounds are included. Additional rounds or a changed brief are estimated before work continues."],
] as const;

function DaVinciResolveIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <title>DaVinci Resolve</title>
      <path d="M17.621 0 5.977.004c-1.37 0-2.756.345-3.762 1.11a4.925 4.925 0 0 0-1.61 2.003C.233 3.93 0 5.02 0 5.951l.012 12.2c.002 1.604.479 3.057 1.461 4.112.984 1.056 2.462 1.683 4.331 1.691L16.856 24c1.26.005 3.095-.036 4.303-.714 1.075-.605 2.025-1.556 2.497-2.984.278-.84.345-2.084.344-3.147l-.021-11.13c-.002-.888-.15-2.023-.547-2.934-.425-.976-1.181-1.815-2.322-2.425C20.353.26 19.123 0 17.622 0zm0 .93c1.378 0 2.538.295 3.04.565.977.523 1.544 1.166 1.889 1.96.315.721.47 1.793.473 2.572l.018 11.13c.002 1.013-.097 2.257-.298 2.86-.396 1.202-1.146 1.946-2.063 2.462-.814.457-2.612.593-3.82.588l-11.05-.044c-1.657-.007-2.832-.534-3.626-1.386-.792-.851-1.212-2.06-1.212-3.485L.999 5.95c0-.829.196-1.827.474-2.437.345-.757.75-1.207 1.365-1.674C3.585 1.27 4.868.97 6.08.97zm-5.66 3.423c-1.976.089-3.204 1.658-3.214 3.29.019 1.443 1.635 3.481 2.884 4.53.12.099.154.109.33.18.062.025.198-.047.327-.135.36-.245.993-.947 1.648-1.738a7.67 7.67 0 0 0 1.031-1.683c.409-.89.261-1.599.235-1.888a3.983 3.983 0 0 0-.99-1.692 3.36 3.36 0 0 0-2.251-.864zm4.172 7.922a10.185 10.185 0 0 0-3.244.61c-.15.058-.26.1-.374.17-.057.036-.11.135-.105.292.017.433.29 1.278.624 2.27.384 1.135 1.066 2.27 1.844 2.74a3.23 3.23 0 0 0 2.53.342c.832-.243 1.595-.868 1.962-1.546.986-1.818.19-3.548-1.121-4.417-.447-.296-1.133-.445-1.89-.46-.074 0-.15-.002-.226-.001zm-8.432.038a6.201 6.201 0 0 0-.752.047c-.596.078-.932.273-1.29.51a3.177 3.177 0 0 0-1.365 1.979c-.075.552-.086 1.053.033 1.507.433 1.389 1.326 2.222 2.847 2.452.636.028 1.37-.063 1.99-.45 1.269-.782 2.08-3.17 2.412-4.742.053-.176.035-.357-.013-.42-.005-.067-.044-.113-.19-.183-.398-.192-1.32-.417-2.375-.6a7.68 7.68 0 0 0-1.297-.1z" />
    </svg>
  );
}

export function VideoEditingStudio() {
  const pageRef = useRef<HTMLDivElement>(null);
  const heroMediaRef = useRef<HTMLElement>(null);
  const processRef = useRef<HTMLElement>(null);
  const capabilityListRef = useRef<HTMLDivElement>(null);
  const capabilityIndicatorRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState("All work");

  // Reference: the indicator bar slides to sit under whichever card is
  // hovered (matching its offsetLeft/width) and stays there on
  // mouseleave — it doesn't reset. Starts under the first card.
  useEffect(() => {
    const bar = capabilityIndicatorRef.current;
    if (!bar) return;
    // Double rAF: wait for the grid's layout to settle before measuring —
    // reading offsetLeft/clientWidth on the same tick as mount can catch
    // an intermediate (pre-layout) size.
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => {
      const first = capabilityListRef.current?.querySelector<HTMLElement>("article");
      if (first) {
        bar.style.transform = `translateX(${first.offsetLeft}px)`;
        bar.style.width = `${first.clientWidth}px`;
      }
    }));
    return () => cancelAnimationFrame(frame);
  }, []);

  function slideCapabilityIndicator(e: React.MouseEvent<HTMLElement>) {
    const el = e.currentTarget;
    const bar = capabilityIndicatorRef.current;
    if (!bar) return;
    bar.style.transform = `translateX(${el.offsetLeft}px)`;
    bar.style.width = `${el.clientWidth}px`;
  }

  useEffect(() => {
    const root = pageRef.current;
    if (!root || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const elements = [...root.querySelectorAll<HTMLElement>("[data-reveal]")];
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        (entry.target as HTMLElement).dataset.visible = "true";
        observer.unobserve(entry.target);
      }
    }), { threshold: .12, rootMargin: "0px 0px -7%" });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = processRef.current;
    if (!section) return;

    const cards = [...section.querySelectorAll<HTMLElement>("[data-process-card]")];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const updateRoadmap = () => {
      frame = 0;
      if (reducedMotion.matches || window.innerWidth <= 650) {
        cards.forEach((card) => card.style.setProperty("--card-progress", "1"));
        return;
      }

      const viewportHeight = window.innerHeight;
      cards.forEach((card) => {
        const top = card.getBoundingClientRect().top;
        const raw = Math.min(1, Math.max(0, (viewportHeight * .92 - top) / (viewportHeight * .58)));
        const eased = raw * raw * (3 - 2 * raw);
        card.style.setProperty("--card-progress", eased.toFixed(4));
      });
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateRoadmap);
    };

    updateRoadmap();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    reducedMotion.addEventListener("change", requestUpdate);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      reducedMotion.removeEventListener("change", requestUpdate);
    };
  }, []);

  useEffect(() => {
    const media = heroMediaRef.current;
    const page = pageRef.current;
    if (!media || !page) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const updateMediaScale = () => {
      frame = 0;

      if (reducedMotion.matches || window.innerWidth <= 650) {
        media.style.setProperty("--media-progress", "1");
        return;
      }

      const pageTop = page.getBoundingClientRect().top + window.scrollY;
      const travel = Math.max(560, window.innerHeight * 0.92);
      const rawProgress = Math.min(1, Math.max(0, (window.scrollY - pageTop) / travel));
      const easedProgress = rawProgress * rawProgress * (3 - 2 * rawProgress);
      media.style.setProperty("--media-progress", easedProgress.toFixed(4));
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateMediaScale);
    };

    updateMediaScale();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    reducedMotion.addEventListener("change", requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      reducedMotion.removeEventListener("change", requestUpdate);
    };
  }, []);

  return (
    <div className={styles.page} ref={pageRef}>
      <section className={styles.hero} aria-labelledby="video-title">
        <h1 id="video-title">Making video for businesses that refuse to be scrolled past.</h1>
        <Link href="/contact" className={styles.darkButton}>Start your project</Link>
        <p className={styles.heroAside}>Good footage is only potential. We turn it into a clear opening, a reason to keep watching and a finish that moves the viewer somewhere useful.</p>
      </section>

      <div className={styles.heroMediaStage}>
        <section ref={heroMediaRef} className={styles.heroMedia} aria-label="Video editing preview">
          <Image src="/media/services/video-editing-bg-2.jpg" alt="Video editing interface showing a fast-paced automotive project" fill priority sizes="(max-width: 650px) calc(100vw - 1.5rem), calc(100vw - 8rem)" />
          <span><Play size={16} fill="currentColor" aria-hidden="true" /> From raw footage to final cut</span>
        </section>
      </div>

      <section className={styles.audience} data-reveal aria-labelledby="audience-title">
        <h2 id="audience-title">Who this service works best for.</h2>
        <div className={styles.audienceGrid}>
          <article><span>01</span><h3>Teams with a good product</h3><p>The offer already works. The missing piece is video that communicates its value as clearly as the team does.</p></article>
          <article><span>02</span><h3>Brands producing consistently</h3><p>You need an editing system that can create variants and formats without reinventing the visual language every week.</p></article>
          <article><span>03</span><h3>Campaigns with a real outcome</h3><p>The video has a job beyond “engagement”: a click, a qualified view, a purchase or a stronger sales conversation.</p></article>
        </div>
      </section>

      <section className={styles.capabilities} data-reveal aria-labelledby="capabilities-title">
        <header><h2 id="capabilities-title">What we can shape from your footage.</h2><p>Creative judgement and technical execution, organised around the moment the video must perform.</p></header>
        <div className={styles.capabilityList} ref={capabilityListRef}>
          <span className={styles.capabilityIndicator} ref={capabilityIndicatorRef} aria-hidden="true" />
          {capabilities.map(([Icon, title, copy]) => <article key={title} onMouseEnter={slideCapabilityIndicator}><Icon aria-hidden="true" /><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>

      <section className={styles.work} data-reveal aria-labelledby="work-title">
        <div className={styles.workTop}><h2 id="work-title">Examples of the editing system.</h2><div className={styles.filters} role="group" aria-label="Filter work examples">{["All work", "Product", "Social", "Ads"].map(label => <button key={label} type="button" aria-pressed={active === label} onClick={() => setActive(label)}>{label}</button>)}</div></div>
        <div className={styles.workGrid}>
          <article className={styles.workLarge}><div><Image src="/media/services/video-editing-bg-2.jpg" alt="Automotive product video being edited" fill sizes="(max-width: 760px) 100vw, 60vw" /></div><h3>Velocity / Product launch</h3><p>Master film · vertical cuts · motion graphics</p></article>
          <article><div><Image src="/media/services/video-editing-bg.jpg" alt="Professional colour grading workflow" fill sizes="(max-width: 760px) 100vw, 40vw" /></div><h3>Proof / Brand story</h3><p>Interview edit · colour · captions</p></article>
          <article><div><Image src="/media/services/video-editing-bg.jpg" alt="Editor building multiple video variants" fill sizes="(max-width: 760px) 100vw, 40vw" /></div><h3>Loop / Social system</h3><p>Hook variants · platform formats</p></article>
        </div>
      </section>

      <section ref={processRef} className={styles.process} aria-labelledby="process-title">
        <div className={styles.processHeading}><h2 id="process-title">How the edit moves.<br />Clear & controlled.</h2></div>
        <div className={styles.roadmap}>
          <div className={styles.roadmapGlow} aria-hidden="true" />
          <div className={styles.roadmapLine} aria-hidden="true" />
          {process.map(([index,title,copy], cardIndex) => {
            const Icon = [Lightbulb, ScanSearch, SlidersHorizontal, Send][cardIndex];
            return (
              <article key={index} data-process-card className={styles.processCard}>
                <Icon aria-hidden="true" />
                <p><strong>{title}.</strong> {copy}</p>
              </article>
            );
          })}
          <DaVinciResolveIcon className={styles.roadmapHeart} aria-hidden="true" />
        </div>
      </section>

      <section id="video-package" className={styles.package} data-reveal aria-labelledby="package-title">
        <div><p className={styles.overline}>A practical starting scope</p><h2 id="package-title">One editing system, ready to publish.</h2><p>Final scope follows the footage, formats and campaign—not an artificial one-size package.</p></div>
        <div className={styles.packageCard}>
          <p>Typical project includes</p>
          <ul>{["Edited master film", "Platform-specific cuts", "Multiple opening variants", "Burned-in captions", "Motion graphics and end cards", "Two revision rounds"].map(item => <li key={item}><Check size={17} aria-hidden="true" />{item}</li>)}</ul>
          <Link href="/contact">Request a project scope <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
      </section>

      <section className={styles.faq} data-reveal aria-labelledby="faq-title">
        <h2 id="faq-title">Questions before the first cut.</h2>
        <div>{faqs.map(([question,answer]) => <details key={question}><summary>{question}<ChevronDown aria-hidden="true" /></summary><p>{answer}</p></details>)}</div>
      </section>

      <section className={styles.contact} data-reveal aria-labelledby="contact-title">
        <div><p className={styles.overline}>Need something specific?</p><h2 id="contact-title">Tell us what the video needs to change.</h2><p>Share the footage, intended audience, platform and commercial goal. We will tell you what the edit should include.</p></div>
        <Link href="/contact">Start your video project <ArrowRight size={18} aria-hidden="true" /></Link>
      </section>
    </div>
  );
}
