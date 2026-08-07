import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "../brand";
import { Reveal } from "../components/reveal";
import { FeatureGrid, Section } from "../components/section";

export const metadata: Metadata = {
  title: "About",
  description: `Who ${brand.name} is, plainly. No implied offices, no invented headcount.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <section className="relative flex min-h-[58svh] flex-col justify-end pb-16 pt-32">
        <div className="mx-auto w-full max-w-[80rem] px-6">
          <Reveal>
            <p className="eyebrow mb-6">About</p>
            <h1 className="display display-lg mb-8">
              A small studio that says so
            </h1>
            <p className="lead max-w-[48ch]">
              Most agency about pages imply a headcount and a floor of an office
              building. Ours does not, because the moment a client discovers the
              gap between the page and the reality, everything else we said stops
              being believable.
            </p>
          </Reveal>
        </div>
      </section>

      <Section
        eyebrow="How we're set up"
        headline="Founder-led, contractor-supported."
        lead="You will know who is doing your work before it starts, and that person will be in your meetings."
      >
        <FeatureGrid
          items={[
            {
              title: "One founder, accountable throughout.",
              body: "Positioning, solution design, final quality review and your key communication stay with the founder. They are not handed to an account manager once the contract is signed.",
            },
            {
              title: "Specialists brought in by need.",
              body: "Where a project needs a specialist we do not have in-house, we bring one in under agreement, with limited access and IP assigned to you. We will tell you when that happens.",
            },
            {
              title: "Based in Dhaka, working with the West.",
              body: "We are an offshore studio and we say so plainly. It is why our pricing works and it is why our written communication has to be better than average.",
            },
            {
              title: "Deliberately small for now.",
              body: "We would rather run four engagements properly than twelve badly. Capacity is stated honestly when you ask, including when the answer is that we are full.",
            },
          ]}
        />
      </Section>

      <Section
        band
        eyebrow="What we won't do"
        headline="The list that keeps us honest."
        lead="Taken from the operating principles we wrote before taking a single client, and kept where clients can read them."
      >
        <div className="mt-12 grid gap-x-12 gap-y-8 md:grid-cols-2">
          {[
            "Fabricate clients, testimonials, reviews or case studies.",
            "Buy followers, reviews or engagement of any kind.",
            "Hold your accounts, domain or data to create dependency.",
            "Report impressions and followers as if they were results.",
            "Begin work before an agreement is signed and payment is made.",
            "Promise revenue, rankings or a cost per acquisition we cannot control.",
            "Imply an office, a team size or a client list we do not have.",
            "Automate professional, clinical or legal judgement.",
          ].map((item, i) => (
            <Reveal key={item} delay={i * 55}>
              <p className="flex gap-4 text-detail text-[#1d1d1f]">
                <span aria-hidden="true" className="select-none text-accent-ink">
                  ×
                </span>
                {item}
              </p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Get in touch"
        headline="Talk to the person who'll do the work."
        lead="No qualifying gauntlet, no junior gatekeeper. One form, one reply, one call."
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
