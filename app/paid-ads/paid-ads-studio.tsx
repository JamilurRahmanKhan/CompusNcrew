import { ArrowDownLeft, ArrowRight, Check, MoveDownRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import styles from "./paid-ads-studio.module.css";

const strategySteps = [
  ["01", "Audience", "Find the people with the problem, buying power and reason to act now."],
  ["02", "Offer", "Turn the service into one clear promise that earns the next click."],
  ["03", "Creative", "Test hooks, angles and formats in a visible, repeatable system."],
  ["04", "Conversion", "Match the landing page to the exact promise made in the ad."],
  ["05", "Learning", "Keep a decision log so every round gets sharper than the last."],
] as const;

const services = [
  {
    index: "01",
    title: "Google Ads",
    copy: "Search and Shopping campaigns built to catch demand at the moment it appears.",
    items: ["Search intent mapping", "Campaign architecture", "Conversion tracking"],
  },
  {
    index: "02",
    title: "Meta Ads",
    copy: "Feed-native creative and structured testing across Facebook and Instagram.",
    items: ["Creative testing system", "Audience structure", "Retargeting journeys"],
  },
  {
    index: "03",
    title: "Landing & tracking",
    copy: "A focused landing experience and measurement layer that make the spend accountable.",
    items: ["Campaign landing pages", "Event configuration", "Qualified-lead reporting"],
  },
] as const;

const process = [
  ["01", "Discovery", "We map the offer, audience, buying path and current measurement before spend changes."],
  ["02", "Acquisition", "Campaigns launch in your accounts with a testing backlog and defined decision rules."],
  ["03", "Recapture", "Remarketing, follow-up and landing-page iterations recover demand that was not ready first time."],
] as const;

function DemoCard({
  platform,
  image,
  theme,
}: {
  platform: string;
  image: string;
  theme: "google" | "meta";
}) {
  return (
    <article className={`${styles.demoCard} ${styles[theme]}`}>
      <div className={styles.demoImage}>
        <Image
          src={image}
          alt={`${platform} campaign dashboard demonstration`}
          fill
          sizes="(max-width: 760px) 100vw, 50vw"
        />
      </div>
      <div className={styles.demoCopy}>
        <span>Platform demonstration</span>
        <h3>{platform}</h3>
        <p>Example campaign architecture showing how creative, targeting and measurement work together.</p>
      </div>
    </article>
  );
}

export function PaidAdsStudio() {
  return (
    <main className={styles.page}>
      <section className={`${styles.frame} ${styles.hero}`} aria-labelledby="paid-ads-title">
        <div className={styles.heroType}>
          <span className={styles.heroNote}>niche targeting</span>
          <h1 id="paid-ads-title">
            ads<sup>that</sup>win
          </h1>
          <p className={styles.heroScript}>Google · Meta · creative · landing pages · measurement</p>
        </div>

        <div className={styles.heroBottom}>
          <ArrowDownLeft size={72} strokeWidth={1.15} aria-hidden="true" />
          <p>
            Paid acquisition for businesses that need more than impressions. We connect the offer,
            creative, landing page and tracking so every decision has evidence behind it.
          </p>
        </div>
      </section>

      <section className={`${styles.frame} ${styles.strategy}`} id="strategy" aria-labelledby="strategy-title">
        <header className={styles.strategyHeader}>
          <div>
            <span className={styles.kicker}>01 / Strategy</span>
            <h2 id="strategy-title">my strategies</h2>
          </div>
          <p>Built around real buying behaviour: what makes someone notice, believe and take the next step.</p>
        </header>

        <div className={styles.strategyGrid}>
          <div className={styles.strategyList}>
            <ArrowDownLeft size={74} strokeWidth={1.2} aria-hidden="true" />
            {strategySteps.map(([index, title, copy]) => (
              <article key={title}>
                <span>{index}</span>
                <div><h3>{title}</h3><p>{copy}</p></div>
              </article>
            ))}
          </div>
          <div className={styles.strategyVisual}>
            <Image
              src="/media/services/paid-ads-bg.jpg"
              alt="A collage of dark green advertising and product campaign concepts"
              fill
              sizes="(max-width: 760px) 100vw, 45vw"
            />
            <p>Ads that earn attention,<br />then earn action.</p>
          </div>
        </div>
      </section>

      <section className={`${styles.frame} ${styles.creative}`} id="creative" aria-labelledby="creative-title">
        <header className={styles.creativeHeader}>
          <span className={styles.kicker}>02 / Creative systems</span>
          <h2 id="creative-title"><strong>ads</strong> creatives</h2>
          <div>
            <ArrowDownLeft size={70} strokeWidth={1.15} aria-hidden="true" />
            <p>Planned ads designed around a hypothesis—not decoration for its own sake.</p>
          </div>
        </header>

        <div className={styles.demoGrid}>
          <DemoCard platform="Google Ads" image="/media/services/paid-ads/google-ads-mockup.webp" theme="google" />
          <DemoCard platform="Meta Ads" image="/media/services/paid-ads/meta-ads-mockup.webp" theme="meta" />
        </div>
        <p className={styles.demoDisclosure}>Demonstration concepts — not client dashboards or reported outcomes.</p>
      </section>

      <section className={`${styles.frame} ${styles.serviceSection}`} id="services" aria-labelledby="services-title">
        <header className={styles.serviceHeader}>
          <span className={styles.kicker}>03 / Services</span>
          <h2 id="services-title">One paid system.<br /><em>Three connected parts.</em></h2>
        </header>
        <div className={styles.serviceGrid}>
          {services.map((service) => (
            <article key={service.title} className={styles.serviceCard}>
              <span className={styles.serviceIndex}>{service.index}</span>
              <h3>{service.title}</h3>
              <p>{service.copy}</p>
              <ul>
                {service.items.map((item) => <li key={item}><Check size={15} aria-hidden="true" />{item}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.frame} ${styles.minute}`} aria-labelledby="minute-title">
        <p className={styles.script}>still not enough to decide?</p>
        <h2 id="minute-title">give us a minute</h2>
        <p>Good paid media is not a magic setting. It is a disciplined loop between message, market and measurement.</p>
        <a href="#process" aria-label="Continue to our paid ads process"><MoveDownRight size={42} /></a>
      </section>

      <section className={`${styles.frame} ${styles.process}`} id="process" aria-labelledby="process-title">
        <header>
          <span className={styles.kicker}>04 / How it works</span>
          <h2 id="process-title">winning process</h2>
          <p>A campaign without a process is just spend with a dashboard attached.</p>
        </header>
        <div className={styles.processGrid}>
          {process.map(([index, title, copy]) => (
            <article key={title}>
              <span>{index}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.frame} ${styles.cta}`} id="contact" aria-labelledby="cta-title">
        <span className={styles.kicker}>Make the spend accountable</span>
        <h2 id="cta-title">ready to build<br />the next campaign?</h2>
        <p>Tell us what you sell, what the current acquisition problem costs, and where the measurement breaks.</p>
        <Link href="/contact">Start a paid ads project <ArrowRight size={20} aria-hidden="true" /></Link>
      </section>
    </main>
  );
}
