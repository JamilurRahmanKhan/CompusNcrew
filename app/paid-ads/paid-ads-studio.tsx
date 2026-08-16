import { BarChart3, Gauge, Layers3, Rocket, Sparkles } from "lucide-react";
import Image from "next/image";

import { LiveAdPreviews, PaidAdsEngine } from "./live-ad-previews";
import { paidAdsCapabilities, platformPerformance } from "./paid-ads-data";
import { PlatformPerformanceCard } from "./platform-performance-card";
import styles from "./paid-ads-studio.module.css";

const capabilityIcons = [BarChart3, Layers3, Gauge, Rocket] as const;

const activePlatforms = [
  { name: "Meta Ads", logo: "/paid-ads/meta-logo.png" },
  { name: "Google Ads", logo: "/paid-ads/google-ads-logo.png" },
] as const;

export function PaidAdsStudio() {
  return (
    <div className={styles.page} id="paid-ads-cockpit">
      <div className={styles.ambientGlow} aria-hidden="true" />

      <div className={styles.cockpitShell}>
        <div className={styles.cockpitGrid}>
          <header className={styles.hero}>
            <p className={styles.eyebrow}>
              <Sparkles size={16} strokeWidth={2.1} aria-hidden="true" />
              All-in-One Ad Management
            </p>
            <h1 id="paid-ads-title">
              <span>Run Smarter Ads.</span>{" "}
              <span className={styles.headingAccent}>Get Better Results.</span>
            </h1>
            <p className={styles.heroBody}>
              Manage, test and optimize Meta and Google campaigns from one focused system.
            </p>
          </header>

          <section
            className={styles.analytics}
            id="paid-ads-analytics"
            aria-labelledby="paid-ads-analytics-title"
          >
            <div className={styles.sectionHeading}>
              <span className={styles.sectionMarker} aria-hidden="true" />
              <h2 id="paid-ads-analytics-title">Campaign performance</h2>
            </div>
            <div className={styles.performanceCards}>
              {platformPerformance.map((performance) => (
                <PlatformPerformanceCard key={performance.platform} performance={performance} />
              ))}
            </div>
          </section>

          <section
            className={styles.capabilities}
            id="paid-ads-capabilities"
            aria-labelledby="paid-ads-capabilities-title"
          >
            <div className={styles.sectionHeading}>
              <span className={styles.sectionMarker} aria-hidden="true" />
              <h2 id="paid-ads-capabilities-title">One focused system</h2>
            </div>
            <ul className={styles.capabilityList}>
              {paidAdsCapabilities.map((capability, index) => {
                const CapabilityIcon = capabilityIcons[index] ?? BarChart3;

                return (
                  <li key={capability.title}>
                    <span className={styles.capabilityIcon} aria-hidden="true">
                      <CapabilityIcon size={18} strokeWidth={2} />
                    </span>
                    <div>
                      <h3>{capability.title}</h3>
                      <p>{capability.description}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <section
            className={styles.previews}
            id="live-ad-previews"
            aria-labelledby="live-ad-previews-title"
          >
            <div className={styles.sectionHeading}>
              <span className={styles.liveMarker} aria-hidden="true" />
              <h2 id="live-ad-previews-title">Live Ad Previews</h2>
            </div>
            <LiveAdPreviews />
          </section>

          <section
            className={styles.engine}
            id="paid-ads-engine"
            aria-labelledby="paid-ads-engine-title"
          >
            <div className={styles.engineHeader}>
              <p>Connected campaign control</p>
              <h2 id="paid-ads-engine-title">Optimization, always on.</h2>
            </div>

            <div className={styles.engineMediaWrap}>
              <PaidAdsEngine />
            </div>

            <div className={styles.enginePanel}>
              <p className={styles.engineSummary}>Meta Ads / Google Ads active</p>
              <p className={styles.engineCopy}>
                Creative testing, campaign control and performance signals stay connected in one
                clear operating view.
              </p>
              <ul className={styles.activePlatformList} aria-label="Active advertising platforms">
                {activePlatforms.map((platform) => (
                  <li key={platform.name}>
                    <Image src={platform.logo} alt="" width={36} height={36} />
                    <span>{platform.name}</span>
                    <span className={styles.activeState}>
                      <span aria-hidden="true" /> Active
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        <section
          className={styles.disclosure}
          id="paid-ads-disclosure"
          aria-labelledby="paid-ads-disclosure-title"
        >
          <h2 className={styles.visuallyHidden} id="paid-ads-disclosure-title">
            Paid ads demonstration disclosure
          </h2>
          <p>
            Demonstration content and interface concepts — not client dashboards or reported
            outcomes.
          </p>
        </section>
      </div>
    </div>
  );
}
