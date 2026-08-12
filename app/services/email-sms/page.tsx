import type { Metadata } from "next";
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
          </div>
        </div>
      </section>

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
              </article>
            );
          })}
        </div>
      </section>

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
      </section>
    </div>
  );
}
