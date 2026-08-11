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
import { useEffect, useState } from "react";
import styles from "./seo-showcase.module.css";

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

const localProof = [
  "Google Business Profile optimisation",
  "Local search and location-page strategy",
  "Review, citation and conversion foundations",
];

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
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="seo-title">
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <div className={styles.heroMeta}>
              <span>Search intelligence</span>
              <span>SEO / 01</span>
            </div>

            <h1 id="seo-title" className={styles.heroTitle}>
              Search visibility,
              <span> engineered to compound.</span>
            </h1>

            <p className={styles.heroLead}>
              We connect technical SEO, search strategy and useful content into
              one accountable system—built to turn intent into qualified demand.
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

      <section className={styles.localSection}>
        <div className={styles.localVisual} aria-hidden="true">
          <div className={styles.localFrame}>
            <div className={styles.localFrameBar}>
              <span>Local visibility model</span>
              <span>Area / active</span>
            </div>
            <div className={styles.mapTile}>
              <span className={`${styles.mapRoad} ${styles.roadOne}`} />
              <span className={`${styles.mapRoad} ${styles.roadTwo}`} />
              <span className={`${styles.mapRoad} ${styles.roadThree}`} />
              <span className={`${styles.mapBlock} ${styles.blockOne}`} />
              <span className={`${styles.mapBlock} ${styles.blockTwo}`} />
              <span className={`${styles.mapBlock} ${styles.blockThree}`} />
              <div className={styles.pinCore}>
                <MapPin size={58} strokeWidth={1.7} />
              </div>
              <span className={`${styles.mapLabel} ${styles.mapLabelOne}`}>Profile</span>
              <span className={`${styles.mapLabel} ${styles.mapLabelTwo}`}>Direction</span>
            </div>
            <div className={styles.localFrameFooter}>
              <span>Search → profile → action</span>
              <strong>Connected</strong>
            </div>
          </div>
        </div>

        <div className={styles.localCopy}>
          <span className={styles.kicker}>Local search, made useful</span>
          <h2>Be visible when nearby customers are ready.</h2>
          <p>
            Local SEO should connect a real search to a real next step: a call,
            a direction request, a booking or a visit.
          </p>
          <ul>
            {localProof.map((item) => (
              <li key={item}>
                <Check size={16} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <Link href="/contact" className={styles.textLink}>
            Talk about local SEO
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div>
          <span className={styles.kicker}>Start with the evidence</span>
          <h2>Find the search opportunity your competitors missed.</h2>
        </div>
        <Link href="/contact" className={styles.primaryButton}>
          Request an SEO audit
          <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
