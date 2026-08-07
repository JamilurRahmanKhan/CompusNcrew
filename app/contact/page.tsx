import type { Metadata } from "next";
import { brand } from "../brand";
import {
  AmbientDescription,
  AmbientMedia,
} from "../components/ambient-media";
import { ContactForm } from "../components/contact-form";
import { Reveal } from "../components/reveal";
import { FeatureGrid, Section } from "../components/section";

export const metadata: Metadata = {
  title: "Start a project",
  description:
    "Thirty minutes to find out whether there's a fit. If there is, the next step is a paid diagnostic with a measured baseline and a plan.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <section className="relative isolate flex min-h-[62svh] flex-col justify-end overflow-hidden pb-16 pt-32">
        <AmbientMedia slot="contact" opacity={0.6} />
        <AmbientDescription slot="contact" />
        <div className="relative mx-auto w-full max-w-[80rem] px-6">
          <Reveal>
            <p className="eyebrow mb-6">Start here</p>
            <h1 className="display display-lg mb-8">
              A diagnostic, not a sales call
            </h1>
            <p className="lead max-w-[46ch]">
              The more precisely you can describe what the problem is costing
              you, the faster we can tell you whether we&apos;re the right people
              to fix it — or who is.
            </p>
          </Reveal>
        </div>
      </section>

      <Section
        eyebrow="What happens next"
        headline="Three steps, no surprises."
      >
        <FeatureGrid
          columns={3}
          items={[
            {
              title: "You send this form.",
              body: "We read it properly and reply within one business day, including when the answer is that we're not a fit.",
            },
            {
              title: "A thirty-minute fit call.",
              body: "We establish the problem, the urgency and the economics. We will not deliver a full strategy on this call — that's the diagnostic.",
            },
            {
              title: "A paid diagnostic, if it fits.",
              body: "A measured baseline, the top constraints and a thirty-day plan. It's yours to keep and implement, with us or without us.",
            },
          ]}
        />
      </Section>

      <Section
        eyebrow="The form"
        headline="Tell us where it hurts."
        lead="Ten questions. None of them ask for anything sensitive."
      >
        <ContactForm />

        <Reveal className="mt-14 border-t border-hairline pt-8">
          <p className="text-detail text-muted">
            Prefer email?{" "}
            <a
              href={`mailto:${brand.email}`}
              className="text-bright underline decoration-hairline underline-offset-4 transition-colors hover:text-accent"
            >
              {brand.email}
            </a>
          </p>
        </Reveal>
      </Section>

      <Section
        band
        eyebrow="Before you write"
        headline="We're not a fit for everyone."
        lead="Saying this up front saves us both a call."
      >
        <div className="mt-12 grid gap-x-12 gap-y-8 md:grid-cols-2">
          {[
            "You need the cheapest possible option. We are not it, and we will lose that comparison on purpose.",
            "You want guaranteed rankings, revenue or a fixed cost per acquisition. Nobody controls those, and anyone promising them is guessing.",
            "The work needs to start before an agreement is signed and a deposit is paid. That has never once ended well.",
            "You want us to hold your ad accounts, domain or analytics so you can't leave. We register those to you deliberately.",
          ].map((item, i) => (
            <Reveal key={item} delay={i * 70}>
              <p className="flex gap-4 text-detail text-[#6e6e73]">
                <span aria-hidden="true" className="select-none">
                  —
                </span>
                {item}
              </p>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
