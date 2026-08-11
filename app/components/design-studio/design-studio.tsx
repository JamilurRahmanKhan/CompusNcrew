import {
  ArrowRight,
  ArrowUpRight,
  Check,
  FileText,
  Grid2X2,
  Layers3,
  Palette,
  PenTool,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import styles from "./design-studio.module.css";

const disciplines = [
  {
    title: "Identity systems",
    description: "Naming, marks, type, colour and guidelines that keep a brand recognizable as it grows.",
    detail: "Strategy · identity · guidelines",
    icon: PenTool,
  },
  {
    title: "Campaign direction",
    description: "A central visual idea translated into launch assets, ads and moments people remember.",
    detail: "Concept · art direction · campaigns",
    icon: Sparkles,
  },
  {
    title: "Social design systems",
    description: "Flexible templates and motion rules that give every post a consistent point of view.",
    detail: "Templates · content series · motion",
    icon: Grid2X2,
  },
  {
    title: "Editorial & print",
    description: "Reports, packaging and physical pieces with clarity, rhythm and tactile consideration.",
    detail: "Editorial · packaging · print",
    icon: FileText,
  },
  {
    title: "Pitch & proposal decks",
    description: "Complex stories shaped into persuasive visual narratives that are easy to present.",
    detail: "Story flow · data design · decks",
    icon: Layers3,
  },
] as const;

const process = [
  ["Find the signal", "We clarify the audience, context and job the design must do."],
  ["Frame the direction", "We explore distinct territories and explain the reasoning behind each."],
  ["Build the system", "The chosen direction becomes a repeatable visual language."],
  ["Prepare it to live", "We test, document and hand over files your team can keep using."],
] as const;

function ArrowLink({ children, href, light = false }: { children: React.ReactNode; href: string; light?: boolean }) {
  return (
    <Link href={href} className={light ? styles.lightAction : styles.darkAction}>
      <span>{children}</span><ArrowRight size={17} aria-hidden="true" />
    </Link>
  );
}

export function DesignStudio() {
  return (
    <main className={styles.page}>
      <a className={styles.skipLink} href="#design-main">Skip to design services</a>

      <section className={styles.hero} aria-labelledby="design-title">
        <div className={styles.heroGrain} aria-hidden="true" />
        <div className={styles.heroInner} id="design-main">
          <div className={styles.heroCopy}>
            <p className={styles.heroKicker}>CompassNCrew design studio</p>
            <h1 id="design-title">
              <span>Design people</span>
              <span><em>feel</em> before</span>
              <span>they read.</span>
            </h1>
            <p className={styles.heroLead}>
              Identity, campaigns and visual systems made to be recognized in a crowded world.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.primaryAction} href="#selected-work">
                See the work <ArrowRight size={17} aria-hidden="true" />
              </a>
              <Link className={styles.heroTextLink} href="/contact">Brief the studio</Link>
            </div>
          </div>

          <div className={styles.heroVisual} aria-label="A three-dimensional creative control deck with design tools">
            <Image
              src="/media/services/design-creative-console.png"
              alt="A premium three-dimensional creative control deck with a stylus, colour wheel and tactile keys"
              fill
              priority
              sizes="(max-width: 820px) 100vw, 58vw"
              className={styles.heroImage}
            />
            <div className={styles.softwareDock} aria-label="Creative software toolkit">
              <span>Ps</span><span>Ai</span><span>Id</span><span>Ae</span>
            </div>
            <div className={styles.visualNote} aria-hidden="true">
              <span>Creative instrument</span><strong>Form follows meaning.</strong>
            </div>
          </div>
        </div>
        <div className={styles.heroFooter}>
          <span>Strategy before styling</span>
          <span>Systems before one-offs</span>
          <span>Source files made usable</span>
        </div>
      </section>

      <section className={styles.disciplines} aria-labelledby="disciplines-title">
        <div className={styles.disciplineIntro}>
          <span className={styles.sectionMark}>What we shape</span>
          <h2 id="disciplines-title">One language.<br />Every place your brand appears.</h2>
          <p>Not a pile of assets. A coherent design system that stays distinctive and practical in everyday use.</p>
        </div>

        <div className={styles.disciplineList}>
          {disciplines.map(({ title, description, detail, icon: Icon }, index) => (
            <article className={styles.disciplineItem} key={title}>
              <span className={styles.itemIndex}>{String(index + 1).padStart(2, "0")}</span>
              <div className={styles.itemIcon}><Icon size={20} strokeWidth={1.7} aria-hidden="true" /></div>
              <div className={styles.itemCopy}><h3>{title}</h3><p>{description}</p></div>
              <span className={styles.itemDetail}>{detail}</span>
              <ArrowUpRight className={styles.itemArrow} size={19} aria-hidden="true" />
            </article>
          ))}
        </div>
      </section>

      <section className={styles.work} id="selected-work" aria-labelledby="work-title">
        <div className={styles.workHeader}>
          <div><span className={styles.sectionMark}>Selected studies</span><h2 id="work-title">A system you can see working.</h2></div>
          <p>Three visual territories showing how one idea can become a complete, usable design language.</p>
        </div>

        <div className={styles.workGrid}>
          <article className={`${styles.project} ${styles.projectPrimary}`}>
            <div className={styles.projectMeta}><span>Identity system</span><span>01 / Brand architecture</span></div>
            <div className={styles.identityCanvas} aria-hidden="true">
              <span className={styles.giantC}>C</span><span className={styles.verticalWord}>COMMON FORM</span>
              <div className={styles.identityBars}><i /><i /><i /></div>
            </div>
            <div className={styles.projectCaption}><h3>A flexible identity built to stay recognizable.</h3><ArrowUpRight size={19} /></div>
          </article>

          <article className={`${styles.project} ${styles.projectCampaign}`}>
            <div className={styles.projectMeta}><span>Campaign direction</span><span>02 / Launch system</span></div>
            <div className={styles.campaignCanvas} aria-hidden="true">
              <strong>MOVE</strong><span>Make the first impression move.</span><i />
            </div>
            <div className={styles.projectCaption}><h3>One idea, expressed across every touchpoint.</h3><ArrowUpRight size={19} /></div>
          </article>

          <article className={`${styles.project} ${styles.projectEditorial}`}>
            <div className={styles.projectMeta}><span>Editorial design</span><span>03 / Information system</span></div>
            <div className={styles.editorialCanvas} aria-hidden="true">
              <span>Studio notes / 04—19</span><strong>Ideas need<br /><em>structure.</em></strong><div><i /><i /><i /></div>
            </div>
            <div className={styles.projectCaption}><h3>Information made beautiful, useful and easy to navigate.</h3><ArrowUpRight size={19} /></div>
          </article>
        </div>
      </section>

      <section className={styles.principle} aria-label="Our design principle">
        <div className={styles.principleGlyph} aria-hidden="true">D</div>
        <blockquote>“Good design is understood <em>before</em> it is explained.”</blockquote>
        <p>Clarity leads. Character makes it memorable. A usable system keeps it alive.</p>
      </section>

      <section className={styles.process} aria-labelledby="process-title">
        <div className={styles.processTitle}>
          <span className={styles.sectionMark}>How the work takes shape</span>
          <h2 id="process-title">Clear thinking before polished files.</h2>
        </div>
        <ol className={styles.processRail}>
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
        <div className={styles.toolSculpture} aria-hidden="true">
          <div className={styles.toolBase}>
            <span className={styles.keyPs}>Ps</span><span className={styles.keyAi}>Ai</span>
            <span className={styles.keyId}>Id</span><span className={styles.keyAe}>Ae</span>
            <div className={styles.paletteDisc}><Palette size={28} /></div>
          </div>
        </div>
        <div className={styles.handoverCopy}>
          <span className={styles.sectionMark}>A handover built to last</span>
          <h2 id="handover-title">Beautiful only works when your team can keep using it.</h2>
          <ul>
            <li><Check size={16} /> Organized, editable source files</li>
            <li><Check size={16} /> Clear usage and consistency guidance</li>
            <li><Check size={16} /> Assets prepared for print and screen</li>
            <li><Check size={16} /> Licensed fonts and assets documented</li>
          </ul>
          <ArrowLink href="/contact">Talk through your design brief</ArrowLink>
        </div>
      </section>

      <section className={styles.cta}>
        <p>Have an idea that needs a visual language?</p>
        <h2>Let’s give it a form only your brand could own.</h2>
        <ArrowLink href="/contact" light>Start a design project</ArrowLink>
      </section>
    </main>
  );
}
