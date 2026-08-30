import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "../brand";
import { Reveal } from "../components/reveal";
import { Section } from "../components/section";

export const metadata: Metadata = {
  title: "Work",
  description:
    "What exists so far, labelled honestly. No borrowed logos, no invented case studies.",
  alternates: { canonical: "/work" },
};

/**
 * Playbook §9: "Never imply a demo is a client outcome."
 *
 * While brand.launchPreview is true this page publishes no client identity, no
 * metric and no testimonial. That is a genuine differentiator against every
 * new agency that pads this page with logos it has no permission to use — and
 * for an offshore studio, one exposed fake is terminal.
 */
export default function WorkPage() {
  return (
    <>
      <section className="relative flex min-h-[58svh] flex-col justify-end pb-16 pt-32">
        <div className="mx-auto w-full max-w-[80rem] px-6">
          <Reveal>
            <p className="eyebrow mb-6">Work</p>
            <h1 className="display display-lg mb-8">
              Nothing here is borrowed
            </h1>
            <p className="lead max-w-[48ch]">
              {brand.name} is new. This page will fill with measured case studies
              as engagements close and clients approve publication. Until then it
              shows exactly what exists, labelled for what it is.
            </p>
          </Reveal>
        </div>
      </section>

      <Section
        eyebrow="Case study 01"
        headline="This website."
        lead="The only completed build we can show you in full, so it is the one we will be judged on. Every claim below is testable against the page you are reading."
      >
        <div className="mt-14 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {[
            {
              title: "Budget set before code.",
              body: "LCP under 2.5s and hero interactive under 3s on a mid-range Android over 4G. Agreed first, measured after — not the other way round.",
            },
            {
              title: "One WebGL scene, not a demo reel.",
              body: "Neither reference site actually uses canvas 3D — Apple ships sixteen scroll-driven videos, MetaLab three. We added exactly one live scene, in the hero only, lazy-loaded after the page is readable, with a generated 2D fallback for anything that can't run it.",
            },
            {
              title: "Reduced motion is a real path.",
              body: "Every animation on the site stops and every ambient layer freezes when the operating system asks. The page stays fully legible.",
            },
            {
              title: "Keyboard and screen reader tested.",
              body: "Skip link, visible focus, escape-to-close on the menu, and a text alternative for every ambient layer. Canvas is invisible to assistive tech, so it never carries meaning alone.",
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 70}>
              <h3 className="mb-3 text-[1.375rem] font-semibold text-bright">
                {item.title}
              </h3>
              <p className="text-detail text-muted">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        band
        eyebrow="In progress"
        headline="What lands here next."
        lead="In the order we expect to be able to publish it."
      >
        <div className="mt-12">
          {[
            {
              label: "Demo",
              title: "An interactive product configurator.",
              body: "Our own work on our own fictional product, labelled as a demonstration. Never presented as a client outcome.",
            },
            {
              label: "Demo",
              title: "A live automation, end to end.",
              body: "Intake through to reporting, with the measured before-and-after timings on a process we run ourselves.",
            },
            {
              label: "Anonymised",
              title: "White-label delivery, described with permission.",
              body: "Work delivered through another agency, described only as far as our agreement allows and never named without written approval.",
            },
            {
              label: "Case study",
              title: "The first client engagement.",
              body: "Baseline, intervention, measured result, method of measurement and limitations. Published only with written permission and verified numbers.",
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 70}>
              <div className="flex flex-col gap-3 border-t border-[rgba(0,0,0,0.12)] py-7 last:border-b sm:flex-row sm:items-baseline sm:gap-8">
                <span className="w-28 shrink-0 text-[0.75rem] uppercase tracking-[0.14em] text-accent-ink">
                  {item.label}
                </span>
                <div>
                  <h3 className="text-[1.375rem] font-semibold text-[#1d1d1f]">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-[56ch] text-detail text-[#6e6e73]">
                    {item.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        ambient="contact"
        eyebrow="Start here"
        headline="Be the first case study."
        lead="Early engagements get disproportionate attention, and the results get published — with your approval, your numbers and your name on them."
      >
        <Reveal className="mt-12">
          <Link href="/contact" className="pill">
            Book a fit call
          </Link>
        </Reveal>
      </Section>
    </>
  );
}
