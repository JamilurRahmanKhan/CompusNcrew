import type { Metadata } from "next";
import Link from "next/link";
import {
  AmbientDescription,
  AmbientMedia,
} from "../components/ambient-media";
import { Reveal } from "../components/reveal";
import { FeatureGrid, Section } from "../components/section";
import { home } from "../content";

export const metadata: Metadata = {
  title: "Method — Bearing, Chart, Crew, Log",
  description:
    "One engagement runs the same way every time. Named so you can hold us to it.",
  alternates: { canonical: "/method" },
};

export default function MethodPage() {
  return (
    <>
      <section className="relative isolate flex min-h-[70svh] flex-col justify-end overflow-hidden pb-16 pt-32">
        <AmbientMedia slot="method" opacity={0.68} />
        <AmbientDescription slot="method" />
        <div className="relative mx-auto w-full max-w-[80rem] px-6">
          <Reveal>
            <p className="eyebrow mb-6">The method</p>
            <h1 className="display display-lg mb-8">
              Bearing, Chart, Crew, Log
            </h1>
            <p className="lead max-w-[46ch]">{home.method.lead}</p>
          </Reveal>
        </div>
      </section>

      <Section>
        <div className="grid gap-16">
          {home.method.steps.map((step, i) => (
            <Reveal key={step.index} delay={i * 60}>
              <div className="grid gap-6 border-t border-hairline pt-10 md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] md:gap-16">
                <div>
                  <span className="font-mono text-[0.75rem] text-accent">
                    {step.index}
                  </span>
                  <h2 className="mt-3 font-display text-6xl leading-none text-bright">
                    {step.name}
                  </h2>
                </div>
                <p className="max-w-[52ch] text-[1.1875rem] leading-relaxed text-muted">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        band
        eyebrow="The rules underneath"
        headline="Twelve principles, four that matter most."
        lead="These are not aspirational. They are the ones that change what we do on an ordinary Tuesday."
      >
        <div className="mt-14 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {[
            {
              title: "Diagnose before prescribing.",
              body: "Anyone who quotes you a solution before measuring the problem is selling inventory, not judgement.",
            },
            {
              title: "You own your core accounts.",
              body: "Domain, hosting, ad accounts, analytics and business profiles are registered to you. We take delegated access and hand it back at the end.",
            },
            {
              title: "Never guarantee what we don't control.",
              body: "We control the work, the process and the reporting. We do not control Google's algorithm, your close rate, or the market.",
            },
            {
              title: "Communicate before you ask.",
              body: "Bad news arrives from us on the day it happens, with the problem, the impact, the options and a recommendation attached.",
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 70}>
              <h3 className="mb-3 text-[1.375rem] font-semibold text-[#1d1d1f]">
                {item.title}
              </h3>
              <p className="text-detail text-[#6e6e73]">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Reporting"
        headline="Business metrics. Never vanity metrics."
        lead="What arrives in your inbox weekly and monthly, and what deliberately never appears in it."
      >
        <FeatureGrid
          items={[
            {
              title: "Weekly: outcome, work, evidence, blockers.",
              body: "Four sections, same order, every week. Status without evidence is not a status report.",
            },
            {
              title: "Monthly: baseline versus now.",
              body: "Business metrics against the number we measured on day one, what we learned, and next month's priorities.",
            },
            {
              title: "Never: impressions and followers.",
              body: "They move independently of whether you made money. Reporting them as results is how agencies hide.",
            },
            {
              title: "Always: what didn't work.",
              body: "Failed tests are the most useful thing in the report, and the first thing most agencies quietly delete.",
            },
          ]}
        />

        <Reveal className="mt-14">
          <Link href="/contact" className="pill">
            Start with a diagnostic
          </Link>
        </Reveal>
      </Section>
    </>
  );
}
