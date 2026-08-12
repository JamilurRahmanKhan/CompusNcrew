import {
  ArrowDown,
  ArrowRight,
  Check,
  FileText,
  Grid2X2,
  Layers3,
  Package,
  PenTool,
  Smartphone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import styles from "./design-studio.module.css";

const services = [
  {
    index: "01",
    title: "Brand identity",
    description: "Distinctive identities that make your business recognizable before the logo is even seen.",
    deliverables: "Strategy · Logo systems · Guidelines",
    icon: PenTool,
  },
  {
    index: "02",
    title: "Digital experiences",
    description: "Web and product interfaces shaped around clarity, conversion and memorable interaction.",
    deliverables: "Web design · UI systems · Prototypes",
    icon: Smartphone,
  },
  {
    index: "03",
    title: "Campaign creative",
    description: "A strong central idea translated into a visual campaign that can live everywhere.",
    deliverables: "Art direction · Launch assets · Ads",
    icon: Layers3,
  },
  {
    index: "04",
    title: "Social systems",
    description: "Flexible content systems that keep every post fresh without losing brand recognition.",
    deliverables: "Templates · Motion rules · Content kits",
    icon: Grid2X2,
  },
  {
    index: "05",
    title: "Packaging design",
    description: "Shelf-ready packaging that balances visual distinction with practical information.",
    deliverables: "Concepts · Dielines · Production files",
    icon: Package,
  },
  {
    index: "06",
    title: "Editorial & decks",
    description: "Complex stories turned into persuasive, well-paced documents people want to read.",
    deliverables: "Reports · Pitch decks · Editorial",
    icon: FileText,
  },
] as const;

const process = [
  ["Discover", "We find the business signal, audience and purpose the design must serve."],
  ["Direct", "We explore distinct creative territories and make the reasoning visible."],
  ["Design", "The chosen direction becomes a coherent system across every required format."],
  ["Deliver", "We test, document and hand over files your team can confidently keep using."],
] as const;

function ActionLink({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <Link href="/contact" className={light ? styles.actionLight : styles.actionDark}>
      <span>{children}</span>
      <ArrowRight size={17} aria-hidden="true" />
    </Link>
  );
}

export function DesignStudio() {
  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="design-title">
        <Image
          src="/media/services/design-gallery-hero.png"
          alt="A premium three-dimensional gallery exhibiting brand identity, packaging, editorial and digital interface design"
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={styles.heroShade} aria-hidden="true" />
        <div className={styles.heroGrid} aria-hidden="true" />

        <div className={styles.heroTopline}>
          <span>CompassNCrew / Design Studio</span>
          <span>Digital exhibition · 2026</span>
        </div>

        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Design for businesses with something to say</p>
          <h1 id="design-title">
            Built to be
            <em>remembered.</em>
          </h1>
          <p className={styles.heroLead}>
            Brand identities, campaigns and digital experiences curated into one clear visual language.
          </p>
          <div className={styles.heroActions}>
            <a href="#services" className={styles.heroPrimary}>
              Explore the studio <ArrowDown size={17} aria-hidden="true" />
            </a>
            <Link href="/contact" className={styles.heroSecondary}>Start a project</Link>
          </div>
        </div>

        <div className={styles.heroFoot}>
          <span>Brand</span><span>Digital</span><span>Campaign</span><span>Editorial</span>
        </div>
      </section>

      <div id="design-main">
        <section className={styles.manifesto} aria-labelledby="manifesto-title">
          <div className={styles.sectionLabel}>
            <span>01</span>
            <span>Our point of view</span>
          </div>
          <div className={styles.manifestoCopy}>
            <h2 id="manifesto-title">
              Design is not the <em>decoration.</em><br />It is the difference.
            </h2>
            <div className={styles.manifestoDetail}>
              <p>
                We create visual systems that help businesses look credible, communicate clearly and stay recognizable as they grow.
              </p>
              <p>
                Every choice earns its place—from the first strategic idea to the last production-ready file.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.services} id="services" aria-labelledby="services-title">
          <div className={styles.servicesIntro}>
            <div className={`${styles.sectionLabel} ${styles.sectionLabelDark}`}>
              <span>02</span>
              <span>What we design</span>
            </div>
            <h2 id="services-title">One studio.<br /><em>Every expression.</em></h2>
            <p>Choose a focused engagement or build one complete design system across your business.</p>
          </div>

          <div className={styles.serviceGrid}>
            {services.map(({ index, title, description, deliverables, icon: Icon }) => (
              <article className={styles.serviceCard} key={title}>
                <div className={styles.serviceCardTop}>
                  <span>{index}</span>
                  <Icon size={22} strokeWidth={1.45} aria-hidden="true" />
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className={styles.deliverables}>{deliverables}</span>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.work} id="selected-work" aria-labelledby="work-title">
          <div className={styles.workHeading}>
            <div className={styles.sectionLabel}>
              <span>03</span>
              <span>Selected directions</span>
            </div>
            <h2 id="work-title">A glimpse inside<br />the <em>collection.</em></h2>
            <p>Three studies in identity, campaign and information design.</p>
          </div>

          <div className={styles.workGrid}>
            <article className={`${styles.project} ${styles.projectIdentity}`}>
              <div className={styles.projectMeta}><span>Identity system</span><span>CN / 001</span></div>
              <div className={styles.identityArt} aria-hidden="true">
                <span className={styles.identityLetter}>C</span>
                <span className={styles.identityName}>Common<br />Form</span>
                <div className={styles.identityLines}><i /><i /><i /></div>
              </div>
              <div className={styles.projectCaption}>
                <h3>Recognition, built into every detail.</h3>
                <span>Brand architecture · Visual identity</span>
              </div>
            </article>

            <article className={`${styles.project} ${styles.projectCampaign}`}>
              <div className={styles.projectMeta}><span>Campaign direction</span><span>CN / 002</span></div>
              <div className={styles.campaignArt} aria-hidden="true">
                <span>MOVE</span>
                <i />
                <small>Make the first impression move.</small>
              </div>
              <div className={styles.projectCaption}>
                <h3>One idea, amplified across every touchpoint.</h3>
                <span>Art direction · Launch campaign</span>
              </div>
            </article>

            <article className={`${styles.project} ${styles.projectEditorial}`}>
              <div className={styles.projectMeta}><span>Editorial system</span><span>CN / 003</span></div>
              <div className={styles.editorialArt} aria-hidden="true">
                <small>Studio journal / Issue 04</small>
                <span>Ideas need<br /><em>structure.</em></span>
                <div><i /><i /><i /></div>
              </div>
              <div className={styles.projectCaption}>
                <h3>Information with rhythm, order and character.</h3>
                <span>Editorial · Information design</span>
              </div>
            </article>
          </div>
        </section>

        <section className={styles.quote} aria-label="Design principle">
          <span className={styles.quoteMark} aria-hidden="true">D</span>
          <blockquote>
            “Good design is understood <em>before</em> it is explained.”
          </blockquote>
          <p>Clarity makes it useful. Character makes it memorable. A system keeps it alive.</p>
        </section>

        <section className={styles.process} aria-labelledby="process-title">
          <div className={`${styles.sectionLabel} ${styles.sectionLabelDark}`}>
            <span>04</span>
            <span>How it takes shape</span>
          </div>
          <div className={styles.processHeading}>
            <h2 id="process-title">A clear path from<br /><em>thinking to form.</em></h2>
            <p>Enough structure to stay focused. Enough room for the unexpected idea.</p>
          </div>
          <ol className={styles.processGrid}>
            {process.map(([title, description], index) => (
              <li key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.handover} aria-labelledby="handover-title">
          <div className={styles.handoverVisual} aria-hidden="true">
            <span className={styles.sheetOne}>Aa</span>
            <span className={styles.sheetTwo}>#E86F35</span>
            <span className={styles.sheetThree}>01—04</span>
            <div className={styles.handoverDisc}>C</div>
          </div>
          <div className={styles.handoverCopy}>
            <div className={styles.sectionLabel}>
              <span>05</span>
              <span>Made to keep working</span>
            </div>
            <h2 id="handover-title">A beautiful system your team can actually use.</h2>
            <ul>
              <li><Check size={16} aria-hidden="true" /> Organized, editable source files</li>
              <li><Check size={16} aria-hidden="true" /> Clear consistency and usage guidance</li>
              <li><Check size={16} aria-hidden="true" /> Assets prepared for print and screen</li>
              <li><Check size={16} aria-hidden="true" /> Fonts and licensing documented</li>
            </ul>
            <ActionLink>Talk through your brief</ActionLink>
          </div>
        </section>

        <section className={styles.cta}>
          <div>
            <span>Have an idea that needs a visual language?</span>
            <h2>Let’s make it<br /><em>impossible to ignore.</em></h2>
          </div>
          <ActionLink light>Start a design project</ActionLink>
        </section>
      </div>
    </div>
  );
}
