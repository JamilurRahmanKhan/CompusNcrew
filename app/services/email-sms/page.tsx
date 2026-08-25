import type { Metadata } from "next";
<<<<<<< HEAD
import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Check, Mail, MessageSquareText } from "lucide-react";
import styles from "./email-sms.module.css";

export const metadata: Metadata = {
  title: "Email & SMS — Lifecycle Marketing",
  description:
    "Lifecycle email and SMS systems built around consent, segmentation, deliverability and measurable customer journeys.",
  alternates: { canonical: "/services/email-sms" },
};

const process = [
  {
    index: "01",
    title: "Audit the signal",
    copy: "We map your list health, consent records, buying behaviour and the moments where attention currently disappears.",
  },
  {
    index: "02",
    title: "Build the journeys",
    copy: "Welcome, browse, cart, post-purchase and win-back flows are written, designed and connected to real customer actions.",
  },
  {
    index: "03",
    title: "Launch with control",
    copy: "Authentication, suppression rules, QA and measured send volumes protect both customer trust and domain reputation.",
  },
  {
    index: "04",
    title: "Learn every send",
    copy: "Campaign and flow results feed the next decision: the segment, message, offer and timing all get sharper over time.",
  },
] as const;

const foundations = [
  {
    icon: Mail,
    title: "Automated flows",
    copy: "Always-on journeys respond while intent is still warm, without asking your team to remember every follow-up.",
  },
  {
    icon: MessageSquareText,
    title: "Useful campaigns",
    copy: "Editorial calendars give every send a job. No filler, no blasting and no message without a reason to open.",
  },
  {
    icon: ArrowUpRight,
    title: "Measured retention",
    copy: "Reporting is organised around customer action and revenue contribution—not vanity activity in the platform.",
  },
] as const;

const deliverables = [
  "Platform setup and deliverability configuration",
  "Core automated flows built and live",
  "Segmentation structure and list hygiene rules",
  "Campaign calendar with written and designed sends",
  "Monthly reporting on revenue per send and subscriber",
] as const;

export default function EmailSmsPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="email-hero-title">
        <Image
          src="/media/services/email-bg.jpg"
          alt="Lifecycle automation dashboard connecting email and customer actions"
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={styles.heroShade} />
        <div className={styles.heroGrid}>
          <p className={styles.eyebrow}>Lifecycle marketing / Email + SMS</p>
          <h1 id="email-hero-title">
            Owned attention.<br />
            <span>Compounding revenue.</span>
          </h1>
          <p className={styles.heroLead}>
            Turn the list you already own into timely, useful customer journeys—built to earn the next open, click and purchase.
          </p>
          <Link href="/contact" className={styles.primaryCta}>
            Start a lifecycle project <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
          <a href="#approach" className={styles.scrollCue} aria-label="Explore our lifecycle approach">
            <span>Explore</span>
            <ArrowDownRight size={24} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className={styles.statement} id="approach" aria-labelledby="statement-title">
        <p className={styles.sectionLabel}>What we believe</p>
        <div>
          <h2 id="statement-title">The inbox is not a billboard.</h2>
          <p>
            It is a relationship. We combine strategy, writing, design and technical delivery so every message arrives with context—and earns the right to send the next one.
          </p>
        </div>
      </section>

      <section className={styles.processSection} aria-labelledby="process-title">
        <div className={styles.materialPanel}>
          <Image
            src="/media/services/email-bg-2.jpg"
            alt="Email automation journey and message orchestration interface"
            fill
            sizes="(max-width: 800px) 100vw, 48vw"
          />
        </div>
        <div className={styles.processContent}>
          <p className={styles.sectionLabel}>How it works</p>
          <h2 id="process-title">A system before a send.</h2>
          <div className={styles.processList}>
            {process.map((step) => (
              <article key={step.index}>
                <span>{step.index}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </div>
              </article>
            ))}
=======
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Mail,
  MessageSquareText,
  Play,
  Rocket,
  X,
} from "lucide-react";
import { ConveyorJourney } from "../../components/email-marketing/conveyor-journey";
import { FaqAccordion } from "../../components/email-marketing/faq-accordion";
import { RevenueCalculator } from "../../components/email-marketing/revenue-calculator";
import styles from "./email-sms.module.css";
import {
  beforeAfter,
  emailServices,
  industries,
  platforms,
  process,
  realResults,
  revenueLeaks,
  timeline,
  tints,
  trustPoints,
} from "./email-marketing-data";

const tintClass = (styles: Record<string, string>, tint: string) => styles[`tint_${tint}`];
const cycleTint = (index: number) => tints[index % tints.length];

export const metadata: Metadata = {
  title: "Email Marketing — Stop Losing Customers You Already Paid to Acquire",
  description:
    "Automated email follow-up systems that turn new leads, missed opportunities and past customers into more appointments, estimates and repeat business.",
  alternates: { canonical: "/services/email-sms" },
};

export default function EmailMarketingPage() {
  return (
    <div className={styles.page}>
      {/* ================= HERO ================= */}
      <section className={styles.hero} aria-labelledby="email-hero-title">
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Email · CRM · Automation</p>
            <h1 id="email-hero-title">
              Stop losing customers<br />
              you already <span>paid to acquire.</span>
            </h1>
            <p className={styles.heroLead}>
              We build automated follow-up systems that turn new leads, missed opportunities and past customers into more appointments, estimates and repeat business—automatically.
            </p>
            <div className={styles.heroCtas}>
              <Link href="/contact" className={styles.primaryCta}>
                Get My Free Growth Audit <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
              <a href="#journey" className={styles.secondaryCta}>
                <span className={styles.playDot}><Play size={10} aria-hidden="true" fill="currentColor" /></span>
                See How It Works
              </a>
            </div>
            <ul className={styles.trustRow}>
              {trustPoints.map((point) => (
                <li key={point.title}>
                  <Check size={15} aria-hidden="true" />
                  <span>
                    <b>{point.title}</b>
                    {point.copy}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.heroStack}>
            <div className={styles.machineCard}>
              <video
                className={styles.machineVideo}
                src="/media/services/email-marketing-hero.mp4"
                autoPlay
                loop
                muted
                playsInline
                aria-label="Automated email machine processing a customer journey from lead to rebook"
              />
            </div>

            <div className={`${styles.floatBadge} ${styles.floatBadgeOne}`} aria-hidden="true">
              <MessageSquareText size={16} />
            </div>
            <div className={`${styles.floatBadge} ${styles.floatBadgeTwo}`} aria-hidden="true">
              <Check size={16} />
            </div>
            <div className={`${styles.floatBadge} ${styles.floatBadgeThree}`} aria-hidden="true">
              <Mail size={15} />
            </div>
            </div>
>>>>>>> emon
          </div>
        </div>
      </section>

<<<<<<< HEAD
      <section className={styles.foundationSection} aria-labelledby="foundation-title">
        <header>
          <p className={styles.sectionLabel}>The operating model</p>
          <h2 id="foundation-title">Three connected foundations.</h2>
          <p>Each part has a distinct job. Together they create a lifecycle system that can learn instead of merely send.</p>
        </header>
        <div className={styles.foundationGrid}>
          {foundations.map((item, index) => {
            const Icon = item.icon;
            return (
              <article key={item.title}>
                <div className={styles.cardTop}>
                  <span>0{index + 1}</span>
                  <Icon size={23} strokeWidth={1.5} aria-hidden="true" />
                </div>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
=======
      {/* ================= REVENUE LEAKS ================= */}
      <section className={styles.leaksSection} aria-labelledby="leaks-title">
        <header className={styles.sectionHead}>
          <p className={styles.sectionLabel}>The problem</p>
          <h2 id="leaks-title">Where is your revenue leaking?</h2>
          <p>You may be losing more business than you think.</p>
        </header>
        <div className={styles.leaksGrid}>
          {revenueLeaks.map((leak) => {
            const Icon = leak.icon;
            return (
              <article key={leak.index} className={styles.leakCard}>
                <div className={styles.leakTop}>
                  <span className={`${styles.leakIcon} ${tintClass(styles, leak.tint)}`}>
                    <Icon size={19} strokeWidth={1.7} aria-hidden="true" />
                  </span>
                  <span className={styles.leakIndex}>{leak.index}</span>
                </div>
                <h3>{leak.title}</h3>
                <p>{leak.copy}</p>
>>>>>>> emon
              </article>
            );
          })}
        </div>
      </section>

<<<<<<< HEAD
      <section className={styles.deliverySection} aria-labelledby="delivery-title">
        <div className={styles.deliveryIntro}>
          <p className={styles.sectionLabel}>What gets built</p>
          <h2 id="delivery-title">From database to dependable channel.</h2>
          <p>
            The work covers the strategic, creative and technical layers required to make lifecycle marketing useful to customers and accountable to the business.
          </p>
        </div>
        <ul className={styles.deliveryList}>
          {deliverables.map((item, index) => (
            <li key={item}>
              <span>0{index + 1}</span>
              <p>{item}</p>
              <Check size={19} aria-hidden="true" />
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.scopeSection} aria-labelledby="scope-title">
        <p className={styles.sectionLabel}>Boundaries protect the work</p>
        <div>
          <h2 id="scope-title">Consent and deliverability are not optional.</h2>
          <p>
            We do not use purchased or scraped lists, bypass opt-in requirements or hide unsubscribe controls. Platform subscriptions remain in your account, so the audience and the infrastructure stay yours.
          </p>
        </div>
      </section>

      <section className={styles.ctaSection} aria-labelledby="cta-title">
        <p className={styles.sectionLabel}>Build the channel you own</p>
        <h2 id="cta-title">Make every message earn its place.</h2>
        <Link href="/contact">
          Tell us about your list <ArrowUpRight size={19} aria-hidden="true" />
        </Link>
=======
      {/* ================= JOURNEY / SYSTEM ================= */}
      <section className={styles.journeySection} id="journey" aria-labelledby="journey-title">
        <header className={styles.sectionHead}>
          <p className={styles.sectionLabelLight}>Our system</p>
          <h2 id="journey-title" className={styles.journeyTitle}>One system. Every stage of the customer journey.</h2>
        </header>

        <ConveyorJourney />

        <div className={styles.journeyCaptionRow}>
          <p className={styles.journeyCaption}>
            We don&rsquo;t just send emails. <b>We build systems that grow your business.</b>
          </p>
          <p className={styles.journeyHint}>Drag or scroll to explore &middot; hover pauses the belt</p>
        </div>

        <div className={styles.servicesHead}>
          <p className={styles.sectionLabelLight}>What we build</p>
          <h3>Top 10 <span>email services</span> for your business growth.</h3>
        </div>
        <div className={styles.servicesGrid}>
          {emailServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <article key={service.index} className={styles.serviceCard}>
                <div className={`${styles.serviceIcon} ${tintClass(styles, cycleTint(index))}`}>
                  <Icon size={19} strokeWidth={1.7} aria-hidden="true" />
                </div>
                <span className={styles.serviceIndex}>{service.index}</span>
                <h4>{service.title}</h4>
                <p>{service.copy}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* ================= INDUSTRIES + HOW IT WORKS ================= */}
      <section className={styles.industrySection} aria-labelledby="industry-title">
        <header className={styles.sectionHead}>
          <p className={styles.sectionLabel}>Who we serve</p>
          <h2 id="industry-title">Built for your industry.</h2>
          <p>We create custom systems for businesses like yours.</p>
        </header>
        <div className={styles.industryGrid}>
          {industries.map((industry) => {
            const Icon = industry.icon;
            return (
              <div key={industry.label} className={styles.industryChip}>
                <Icon size={20} strokeWidth={1.6} aria-hidden="true" />
                <span>{industry.label}</span>
              </div>
            );
          })}
        </div>
        <div className={styles.industryCtaRow}>
          <Link href="/contact" className={styles.industryCta}>
            See How It Works For Your Industry <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className={styles.actionGrid}>
          <div className={styles.timelineCard}>
            <h3>See it in action: how it works</h3>
            <p className={styles.actionSub}>Example: a lead requests an HVAC estimate.</p>
            <ol className={styles.timelineList}>
              {timeline.map((step, index) => {
                const Icon = step.icon;
                return (
                  <li key={`${step.time}-${index}`}>
                    <span className={styles.timelineDot}>
                      <Icon size={13} aria-hidden="true" />
                    </span>
                    <span className={styles.timelineTime}>{step.time}</span>
                    <span className={styles.timelineCopy}>{step.copy}</span>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className={styles.compareCard}>
            <h3>Before vs after</h3>
            <div className={styles.compareGrid}>
              <div className={styles.compareCol}>
                <p className={styles.compareLabelBad}>Before</p>
                <ul>
                  {beforeAfter.before.map((item) => (
                    <li key={item}>
                      <X size={14} aria-hidden="true" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.compareBadge} aria-hidden="true">VS</div>
              <div className={styles.compareCol}>
                <p className={styles.compareLabelGood}>After</p>
                <ul>
                  {beforeAfter.after.map((item) => (
                    <li key={item}>
                      <Check size={14} aria-hidden="true" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PROCESS ================= */}
      <section className={styles.processSection} aria-labelledby="process-title">
        <header className={styles.sectionHead}>
          <p className={styles.sectionLabel}>How we work</p>
          <h2 id="process-title">Done for you. You run your business, we handle the rest.</h2>
        </header>
        <div className={styles.processRow}>
          {process.map((step, index) => {
            const Icon = step.icon;
            return (
              <div className={styles.processStepWrap} key={step.index}>
                <article className={styles.processCard}>
                  <div className={`${styles.processIcon} ${tintClass(styles, step.tint)}`}>
                    <Icon size={20} strokeWidth={1.6} aria-hidden="true" />
                  </div>
                  <h3>{step.index}. {step.title}</h3>
                  <p>{step.copy}</p>
                </article>
                {index < process.length - 1 && (
                  <span className={styles.processConnector} aria-hidden="true">
                    <ChevronRight size={18} />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= CALCULATOR + RESULTS ================= */}
      <section className={styles.panelSection} aria-labelledby="calc-title">
        <div className={styles.panelGrid}>
          <div className={styles.panel}>
            <h3 id="calc-title">How much revenue are you missing?</h3>
            <p className={styles.panelSub}>Calculate your potential opportunity.</p>
            <RevenueCalculator />
          </div>

          <div className={styles.panel}>
            <h3>Real results. Real businesses.</h3>
            <p className={styles.panelSub}>&nbsp;</p>
            <div className={styles.resultsWrap}>
              <span className={styles.resultsBadge} aria-hidden="true">VS</span>
              {realResults.map((result) => (
                <div key={result.title} className={styles.resultCard}>
                  <h4>{result.title}</h4>
                  {result.metrics.map((metric) => (
                    <div key={metric.label} className={styles.resultMetric}>
                      <div className={styles.resultNum}>{metric.num}</div>
                      <div className={styles.resultLab}>{metric.label}</div>
                    </div>
                  ))}
                  <div className={styles.resultRate}>{result.rate}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.panelGrid}>
          <div className={styles.panel}>
            <h3>Platforms we work with</h3>
            <p className={styles.panelSub}>&nbsp;</p>
            <div className={styles.platformGrid}>
              {platforms.map((platform) => (
                <span key={platform} className={styles.platformChip}>{platform}</span>
              ))}
            </div>
          </div>

          <div className={styles.panel}>
            <h3>Frequently asked questions</h3>
            <p className={styles.panelSub}>&nbsp;</p>
            <FaqAccordion />
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className={styles.ctaSection} aria-labelledby="cta-title">
        <div className={styles.ctaRocketWrap} aria-hidden="true">
          <Rocket size={40} strokeWidth={1.3} className={styles.ctaRocket} />
        </div>
        <div className={styles.ctaCopy}>
          <p className={styles.sectionLabel}>Ready when you are</p>
          <h2 id="cta-title">Ready to stop losing customers?</h2>
          <p>Let&rsquo;s build your system to convert more leads, re-engage past customers and grow your revenue—automatically.</p>
          <Link href="/contact" className={styles.finalCta}>
            Get My Free Growth Audit <ArrowUpRight size={19} aria-hidden="true" />
          </Link>
          <p className={styles.ctaNote}>No obligation. No complicated sales pitch.</p>
        </div>
>>>>>>> emon
      </section>
    </div>
  );
}
