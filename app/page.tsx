import Link from "next/link";
import { brand } from "./brand";
import { Hero } from "./components/hero";
import { PathwayCards } from "./components/pathway-cards";
import { Reveal } from "./components/reveal";
import { FeatureGrid, Section, StatRow } from "./components/section";
import { home } from "./content";

/**
 * Homepage block order is the playbook's §8 list, in sequence:
 *   1 outcome headline · 2 target buyer · 3 costly problems · 4 named solution
 *   5 pathways · 6 business outcomes · 7 proof · 8 process · 9 credibility
 *   10 CTA
 */
export default function HomePage() {
  return (
    <>
      <Hero />

      {/* 2 — who this is for */}
      <Section
        eyebrow={home.audience.eyebrow}
        headline={home.audience.headline}
        lead={home.audience.lead}
      >
        <FeatureGrid items={home.audience.points} columns={3} />
      </Section>

      {/* 3 — the costly problems, on Apple's horizontal highlight rail */}
      <section className="relative overflow-hidden py-28 md:py-40">
        <div className="mx-auto max-w-[80rem] px-6">
          <Reveal className="max-w-[54rem]">
            <p className="eyebrow mb-4">{home.problems.eyebrow}</p>
            <h2 className="headline mb-6">{home.problems.headline}</h2>
            <p className="lead">{home.problems.lead}</p>
          </Reveal>
        </div>

        <div className="rail mt-14">
          {home.problems.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 90}>
              <article className="flex h-full min-h-[22rem] flex-col justify-between rounded-2xl bg-raised p-8">
                <p className="font-display text-4xl leading-none text-accent">
                  {item.stat}
                </p>
                <div>
                  <h3 className="mb-3 text-[1.375rem] font-semibold leading-snug text-bright">
                    {item.title}
                  </h3>
                  <p className="text-detail text-muted">{item.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 4 + 5 — the named system, then the three pathways */}
      <Section
        id="pathways"
        ambient="method"
        eyebrow="What we do"
        headline="Three pathways. Eight disciplines. One engagement at a time."
        lead="We do not sell a menu. We find the single most expensive constraint in your business and take the pathway that removes it. The rest stays available for when it becomes the constraint."
      >
        <PathwayCards />
      </Section>

      {/* 6 — business outcomes */}
      <Section
        eyebrow={home.outcomes.eyebrow}
        headline={home.outcomes.headline}
        lead={home.outcomes.lead}
      >
        <StatRow stats={home.outcomes.stats} />
      </Section>

      {/* 8 — process */}
      <Section
        id="method"
        eyebrow={home.method.eyebrow}
        headline={home.method.headline}
        lead={home.method.lead}
        band
      >
        <div className="mt-16 grid gap-x-12 gap-y-14 md:grid-cols-2">
          {home.method.steps.map((step, i) => (
            <Reveal key={step.index} delay={i * 80}>
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-[0.75rem] text-accent-ink">
                  {step.index}
                </span>
                <h3 className="font-display text-4xl leading-none text-[#1d1d1f]">
                  {step.name}
                </h3>
              </div>
              <p className="mt-4 max-w-[46ch] text-detail text-[#6e6e73]">
                {step.body}
              </p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 7 + 9 — proof and credibility, handled honestly */}
      <Section
        eyebrow="Proof"
        headline="We don't have client logos yet. We're not going to borrow any."
        lead="CompassNCrew is new. Publishing invented case studies or logos we have no permission to use would be the fastest way to become the kind of agency we built this one to avoid."
      >
        <FeatureGrid
          items={[
            {
              title: "This site is case study one.",
              body: "We set a performance budget before writing any code and published it. Every claim on this page about how we work is a claim you can test against the page itself.",
            },
            {
              title: "Demos are labelled as demos.",
              body: "Where we show a build, an automation or an edit, it is marked clearly as our own work. We will never let a demonstration be mistaken for a client outcome.",
            },
            {
              title: "One founder, named contractors.",
              body: "We are not going to imply an office and forty staff. You will know exactly who is doing your work before it starts, and that person will be in your meetings.",
            },
            {
              title: "The first results get published.",
              body: "With written client permission, a verified baseline and a stated method of measurement — including the limitations. Anything less is marketing, not proof.",
            },
          ]}
        />

        <Reveal className="mt-14">
          <Link href="/work" className="pill">
            See what exists so far
          </Link>
        </Reveal>
      </Section>

      {/* 10 — CTA */}
      <Section
        ambient="contact"
        eyebrow={home.cta.eyebrow}
        headline={home.cta.headline}
        lead={home.cta.lead}
      >
        <Reveal className="mt-12 flex flex-wrap gap-3">
          <Link href="/contact" className="pill">
            Book a fit call
          </Link>
          <a href={`mailto:${brand.email}`} className="pill">
            {brand.email}
          </a>
        </Reveal>
      </Section>
    </>
  );
}
