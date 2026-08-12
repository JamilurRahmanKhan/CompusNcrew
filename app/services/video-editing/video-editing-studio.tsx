"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ChevronDown, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styles from "./video-editing.module.css";

const capabilities = [
  ["01", "Product video", "Shape features and benefits into a concise story people can understand without a sales call."],
  ["02", "Social cuts", "Platform-native edits in vertical, square and landscape formats—with interface-safe composition."],
  ["03", "Ad creative", "Multiple openings and pacing variants made to test which idea earns the next second."],
  ["04", "Case stories", "Turn interviews, proof and product footage into an argument a buyer will actually finish."],
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

export function VideoEditingStudio() {
  const pageRef = useRef<HTMLDivElement>(null);
  const heroMediaRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState("All work");

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
        <div className={styles.capabilityList}>
          {capabilities.map(([index, title, copy]) => <article key={title}><span>{index}</span><h3>{title}</h3><p>{copy}</p><ArrowRight aria-hidden="true" /></article>)}
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

      <section className={styles.process} data-reveal aria-labelledby="process-title">
        <h2 id="process-title">How the edit moves. Clear & controlled.</h2>
        <div className={styles.processGrid}>{process.map(([index,title,copy]) => <article key={index}><span>{index}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
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
