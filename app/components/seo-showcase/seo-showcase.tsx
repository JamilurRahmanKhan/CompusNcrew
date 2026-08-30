"use client";

import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Code2,
  FileSearch,
  Globe2,
  Layers3,
  Link2,
  MapPin,
  Search,
  Check,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import { useEffect, useState } from "react";
import styles from "./seo-showcase.module.css";

// Scoped to this page only — the rest of the site keeps Instrument Serif +
// Inter (see app/layout.tsx). Space Grotesk stands in for the reference
// design's headline face; DM Sans for its body copy.
const seoDisplay = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--seo-font-display",
});

const seoSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--seo-font-sans",
});

const services = [
  {
    icon: FileSearch,
    title: "SEO audit",
    copy: "A prioritised view of the technical, content and authority issues holding search performance back.",
    scope: "Site health · search gaps · action plan",
  },
  {
    icon: Search,
    title: "On-page SEO",
    copy: "Search intent, page structure and content aligned around the questions your buyers actually ask.",
    scope: "Intent mapping · page optimisation",
  },
  {
    icon: Code2,
    title: "Technical SEO",
    copy: "Crawlability, indexing, structured data and site performance made dependable before content scales.",
    scope: "Indexing · schema · performance",
  },
  {
    icon: MapPin,
    title: "Local SEO",
    copy: "Location pages and business profiles shaped to turn nearby searches into calls and visits.",
    scope: "Maps · profiles · location pages",
  },
  {
    icon: Link2,
    title: "Content & authority",
    copy: "Useful editorial content and credible links that build topical trust without shortcuts.",
    scope: "Editorial strategy · credible links",
  },
] as const;

const aiEngines = [
  {
    name: "ChatGPT Search",
    icon: "/media/services/seo-chatgpt-icon.webp",
    copy: "Citation-ready pages and structured data built for OpenAI's answer engine.",
  },
  {
    name: "Claude",
    icon: "/media/services/seo-claude-icon.webp",
    copy: "Entity-rich, well-sourced content designed to earn trust with Claude's reasoning.",
  },
  {
    name: "DeepSeek",
    icon: "/media/services/seo-deepseek-icon.webp",
    copy: "Fast-indexing, technically precise content tuned for DeepSeek's retrieval search.",
  },
] as const;

const impactStats = [
  ["01", "Entity-first", "Structured data ships before content scales"],
  ["02", "4 engines", "ChatGPT, Claude, Gemini and DeepSeek"],
  ["03", "Fast indexing", "Pages built to be crawlable from day one"],
  ["04", "24/7", "Ranking and citation signal monitoring"],
] as const;

const signalFrames = [
  {
    label: "Search health",
    value: "82 / 100",
    detail: "Technical foundation",
  },
  {
    label: "Priority pages",
    value: "24 / 30",
    detail: "Intent mapped",
  },
  {
    label: "Local presence",
    value: "Strong",
    detail: "Profiles connected",
  },
] as const;

const searchWork = [
  {
    index: "01",
    title: "Commerce search architecture",
    category: "Technical SEO",
    summary:
      "A structured search foundation for large catalogues: crawl paths, intent-led collections and cleaner discovery.",
    query: "high-intent product discovery",
    output: "Architecture system",
    disciplines: ["Information architecture", "Indexation", "Page systems"],
    theme: "commerce",
  },
  {
    index: "02",
    title: "Local discovery system",
    category: "Local SEO",
    summary:
      "A connected local presence designed around profiles, location pages and the moments that lead to action.",
    query: "best service near me",
    output: "Local visibility model",
    disciplines: ["Maps presence", "Location strategy", "Conversion paths"],
    theme: "local",
  },
  {
    index: "03",
    title: "Editorial authority engine",
    category: "Content & authority",
    summary:
      "An editorial system that turns expert knowledge into useful pages, strong internal pathways and topical trust.",
    query: "expert answers for buyers",
    output: "Editorial framework",
    disciplines: ["Content strategy", "Topic structure", "Authority building"],
    theme: "authority",
  },
] as const;

export function SeoShowcase() {
  const [activeSignal, setActiveSignal] = useState(0);
  const [activeProject, setActiveProject] = useState(0);
  const selectedProject = searchWork[activeProject];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const timer = window.setInterval(
      () => setActiveSignal((current) => (current + 1) % signalFrames.length),
      1700,
    );

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className={`${styles.page} ${seoDisplay.variable} ${seoSans.variable}`}>
      <section className={styles.hero} aria-labelledby="seo-title">
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <div className={styles.heroEyebrow}>
              <span className={styles.eyebrowDot} aria-hidden="true" />
              Search &amp; GEO growth engine
            </div>

            <h1 id="seo-title" className={styles.heroTitle}>
              Rank higher.
              <span> Get found everywhere.</span>
            </h1>

            <p className={styles.heroLead}>
              We connect technical SEO, content intelligence and local GEO
              signals into one accountable system — built to turn search
              visibility into qualified demand.
            </p>

            <div className={styles.heroActions}>
              <a href="#seo-services" className={styles.primaryButton}>
                Explore SEO services
                <ArrowRight size={17} aria-hidden="true" />
              </a>
              <Link href="/contact" className={styles.secondaryButton}>
                Get a free audit
              </Link>
            </div>

            <div className={styles.trustRow} aria-label="SEO focus areas">
              {[
                ["01", "Technical clarity"],
                ["02", "Qualified demand"],
                ["03", "Local visibility"],
              ].map(([index, item]) => (
                <span key={item}>
                  <small>{index}</small>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.machineStage}>
            <div className={styles.heroOrbitA} aria-hidden="true" />
            <div className={styles.heroOrbitB} aria-hidden="true" />
            <div className={styles.mediaFrame}>
              <div className={styles.mediaBar}>
                <span>
                  <i aria-hidden="true" />
                  Visibility instrument
                </span>
                <span>Signal / live</span>
              </div>

              <div className={styles.videoShell}>
                <video
                  className={styles.machineVideo}
                  src="/media/services/seo-machine.mp4"
                  poster="/media/services/seo-machine-poster.jpg"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  aria-label="Animated SEO machine"
                />
                <div className={styles.videoSheen} aria-hidden="true" />
                <div className={styles.videoCaption}>
                  <span>Search model</span>
                  <strong>From crawl to conversion</strong>
                </div>
              </div>

              <div className={styles.signalConsole} aria-label="Search visibility preview metrics">
                <div className={styles.consoleIntro}>
                  <Search size={17} aria-hidden="true" />
                  <span>
                    <small>LIVE SYSTEM READOUT</small>
                    Search signal analysis
                  </span>
                </div>
                <div className={styles.consoleMetric}>
                  <span key={`${activeSignal}-label`}>
                    {signalFrames[activeSignal].label}
                  </span>
                  <strong key={`${activeSignal}-value`}>
                    {signalFrames[activeSignal].value}
                  </strong>
                  <small key={`${activeSignal}-detail`}>
                    {signalFrames[activeSignal].detail}
                  </small>
                </div>
                <div className={styles.consoleProgress} aria-hidden="true">
                  {signalFrames.map((frame, index) => (
                    <i
                      key={frame.label}
                      className={index === activeSignal ? styles.progressActive : ""}
                    />
                  ))}
                </div>
              </div>
              <span className={`${styles.frameCorner} ${styles.frameCornerTop}`} aria-hidden="true" />
              <span className={`${styles.frameCorner} ${styles.frameCornerBottom}`} aria-hidden="true" />
            </div>

            <div className={`${styles.floatCard} ${styles.floatOrganic}`}>
              <small>Organic traffic</small>
              <b>+175% ↑</b>
            </div>
            <div className={`${styles.floatCard} ${styles.floatTarget}`}>
              <span aria-hidden="true">◎</span>
              <div>
                <b>Top 3</b>
                <small>Keyword positions</small>
              </div>
            </div>
            <div className={`${styles.floatCard} ${styles.floatSignal}`}>
              <small>Search visibility</small>
              <b>+230% ↗</b>
            </div>
          </div>
        </div>
      </section>

      <section id="geo" className={styles.geoIntroSection} aria-labelledby="geo-services-title">
        <div className={styles.geoIntroInner}>
          <div className={styles.geoIntroCopy}>
            <span className={styles.kicker}>Dominate local. Grow faster.</span>
            <h2 id="geo-services-title">
              GEO services that put you <span>on the map.</span>
            </h2>
            <p>
              Our local search system connects your business to the places,
              categories and intent signals that matter — so customers find
              you when they are ready to act.
            </p>

            <ul className={styles.geoIntroList}>
              {[
                "Google Business Profile optimisation",
                "Local keyword targeting",
                "Map ranking and review management",
                "Local citations and directory listings",
              ].map((item) => (
                <li key={item}>
                  <Check size={14} strokeWidth={3} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link href="/contact" className={styles.geoIntroButton}>
              Get started now
              <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
            </Link>
          </div>

          <div className={styles.geoIntroVisual} aria-label="Local search growth illustration">
            <div className={styles.geoIntroHalo} aria-hidden="true" />
            <Image
              className={styles.geoIntroImage}
              src="/media/services/seo-geo-map.webp"
              alt="Local search map with improved rankings, calls and direction requests"
              width={1200}
              height={800}
              sizes="(max-width: 800px) 94vw, 52vw"
            />
            <div className={styles.geoSignalCard} aria-hidden="true">
              <span>Local intent</span>
              <strong>Captured</strong>
            </div>
          </div>
        </div>
      </section>

      <section id="seo-services" className={styles.servicesSection}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.kicker}>A complete search foundation</span>
            <h2>Five focused services. One clear direction.</h2>
          </div>
          <p>
            Every engagement starts with evidence, fixes the foundation, then
            builds the pages and authority needed to compete.
          </p>
        </div>

        <div className={styles.methodRail} aria-label="Our SEO engagement sequence">
          {[
            ["01", "Evidence", "See what is holding search back"],
            ["02", "Foundation", "Fix the technical and page system"],
            ["03", "Growth", "Build useful visibility over time"],
          ].map(([index, label, detail]) => (
            <div key={label}>
              <span>{index}</span>
              <strong>{label}</strong>
              <small>{detail}</small>
            </div>
          ))}
        </div>

        <div className={styles.serviceBoard}>
          <article className={styles.featuredService}>
            <div className={styles.featuredIcon}>
              <FileSearch size={25} strokeWidth={1.8} aria-hidden="true" />
            </div>
            <div>
              <span className={styles.serviceLabel}>The starting point</span>
              <h3>{services[0].title}</h3>
              <p>{services[0].copy}</p>
            </div>
            <div className={styles.featuredScope}>{services[0].scope}</div>
            <Link href="/contact" className={styles.auditLink}>
              Request an audit
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
          </article>

          <div className={styles.serviceList}>
            {services.slice(1).map(({ icon: Icon, title, copy, scope }) => (
              <article key={title} className={styles.serviceRow}>
                <div className={styles.rowIcon}>
                  <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                </div>
                <div className={styles.rowCopy}>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                  <span>{scope}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.workSection} aria-labelledby="search-work-title">
        <div className={styles.workHeading}>
          <div>
            <span className={styles.workKicker}>Selected search work</span>
            <h2 id="search-work-title">The strategy becomes a working system.</h2>
          </div>
          <p>
            A flexible portfolio stage for the SEO projects you have delivered.
            Replace these editorial project profiles with client names, imagery
            and verified outcomes when they are ready.
          </p>
        </div>

        <div className={styles.workStage}>
          <div className={styles.projectTabs} role="tablist" aria-label="SEO project examples">
            {searchWork.map((project, index) => (
              <button
                key={project.title}
                type="button"
                role="tab"
                aria-selected={activeProject === index}
                aria-controls="seo-project-panel"
                className={activeProject === index ? styles.projectTabActive : undefined}
                onClick={() => setActiveProject(index)}
              >
                <span>{project.index}</span>
                <strong>{project.title}</strong>
                <ArrowUpRight size={15} strokeWidth={1.8} aria-hidden="true" />
              </button>
            ))}
          </div>

          <div
            id="seo-project-panel"
            className={`${styles.projectPanel} ${styles[`projectTheme${activeProject + 1}`]}`}
            role="tabpanel"
          >
            <div className={styles.projectVisual} key={`${selectedProject.title}-visual`}>
              <div className={styles.projectBrowser}>
                <div className={styles.browserBar}>
                  <span /><span /><span />
                  <small>search-system / project-{selectedProject.index}</small>
                </div>
                <div className={styles.searchField}>
                  <Search size={16} strokeWidth={1.8} aria-hidden="true" />
                  <span>{selectedProject.query}</span>
                  <kbd>↵</kbd>
                </div>
                <div className={styles.resultStack} aria-hidden="true">
                  <span className={styles.resultPrimary} />
                  <span />
                  <span />
                </div>
                <div className={styles.projectGraph} aria-hidden="true">
                  <i /><i /><i /><i /><i /><i />
                </div>
              </div>

              <div className={styles.projectArtifact}>
                <div>
                  {activeProject === 0 ? <Layers3 size={22} /> : activeProject === 1 ? <Globe2 size={22} /> : <BarChart3 size={22} />}
                  <span>Strategy artifact</span>
                </div>
                <strong>{selectedProject.output}</strong>
                <div className={styles.artifactLines} aria-hidden="true"><i /><i /><i /></div>
              </div>
            </div>

            <div className={styles.projectDetail} key={`${selectedProject.title}-detail`}>
              <div className={styles.projectIdentity}>
                <span>{selectedProject.category}</span>
                <small>Project {selectedProject.index}</small>
              </div>
              <h3>{selectedProject.title}</h3>
              <p>{selectedProject.summary}</p>
              <ul>
                {selectedProject.disciplines.map((discipline) => (
                  <li key={discipline}>{discipline}</li>
                ))}
              </ul>
              <div className={styles.projectNote}>
                <span>Portfolio-ready module</span>
                <p>Add the final case study URL when the project page is published.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.aiSection} aria-labelledby="ai-search-title">
        <div className={styles.aiHeading}>
          <span className={styles.kicker}>Generative engine optimization</span>
          <h2 id="ai-search-title">Be the answer AI search gives.</h2>
          <p>
            Beyond the SERP, we structure your entities, sources and content
            so answer engines pull your brand directly into their responses.
          </p>
        </div>

        <div className={styles.aiGrid}>
          {aiEngines.map((engine) => (
            <article key={engine.name} className={styles.aiCard}>
              <img src={engine.icon} alt="" width={64} height={64} loading="lazy" />
              <h3>{engine.name}</h3>
              <p>{engine.copy}</p>
            </article>
          ))}
        </div>

        <div className={styles.statsBand} aria-label="What GEO-ready content covers">
          {impactStats.map(([index, label, detail]) => (
            <div key={label}>
              <span>{index}</span>
              <b>{label}</b>
              <small>{detail}</small>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaOrbit} aria-hidden="true" />
        <div className={styles.ctaWaves} aria-hidden="true">
          <span /><span /><span /><span />
        </div>
        <span className={styles.kicker}>Ready to be found?</span>
        <h2>
          Turn search visibility into
          <span> business momentum.</span>
        </h2>
        <p>
          Get a free audit with your biggest ranking opportunities, local
          gaps and a clear action plan.
        </p>
        <Link href="/contact" className={styles.primaryButton}>
          Request my free audit
          <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
