import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckList, FeatureGrid, Section } from "../components/section";
import { Reveal } from "../components/reveal";
import { getPathway, getService, services } from "../content";
import { RocketJourney } from "./rocket-journey";

export const metadata: Metadata = {
  title: "Paid Ads — Google Ads & Meta Ads",
  description:
    "Paid campaigns on Google and Meta, tracked back to a booked call or an order — two channels, one accountable trajectory.",
  alternates: { canonical: "/paid-ads" },
};

export default function PaidAdsPage() {
  const service = getService("product-ads");
  if (!service) notFound();

  const pathway = getPathway(service.pathway)!;
  const siblings = services.filter(
    (s) => s.pathway === service.pathway && s.slug !== service.slug,
  );

  return (
    <>
      <RocketJourney service={service} />

      <Section
        eyebrow="How we do it"
        headline={`${service.name}, done properly.`}
        lead="The four decisions that separate work that holds up from work that looks fine on delivery day."
      >
        <FeatureGrid items={service.features} />
      </Section>

      <Section
        band
        eyebrow="Scope"
        headline="What you get, and what you don't."
        lead="Written down before we start, so scope stops being a conversation halfway through the project."
      >
        <div className="mt-14 grid gap-12 md:grid-cols-2">
          <Reveal>
            <CheckList title="Included" items={service.deliverables} />
          </Reveal>
          <Reveal delay={90}>
            <CheckList title="Not included" items={service.notIncluded} tone="excluded" />
          </Reveal>
        </div>
      </Section>

      {siblings.length > 0 && (
        <Section
          eyebrow={`More in ${pathway.name}`}
          headline="Often bought alongside."
          lead="Not a bundle. These are the adjacent constraints that tend to surface once this one is removed."
        >
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {siblings.map((sibling, i) => (
              <Reveal key={sibling.slug} delay={i * 80}>
                <Link
                  href={`/services/${sibling.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-hairline p-7 transition-colors duration-300 hover:border-accent/40"
                >
                  <h3 className="text-[1.375rem] font-semibold text-bright">{sibling.name}</h3>
                  <p className="mt-3 text-detail text-muted">{sibling.teaser}</p>
                  <span
                    aria-hidden="true"
                    className="mt-6 text-accent transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      <Section
        ambient="contact"
        eyebrow="Start here"
        headline="Tell us what this is costing you."
        lead="If you can put a number on the problem, we can tell you within thirty minutes whether this is the right service for it."
      >
        <Reveal className="mt-12 flex flex-wrap gap-3">
          <Link href="/contact" className="pill">
            Book a fit call
          </Link>
          <Link href={`/solutions/${pathway.id}`} className="pill">
            Back to {pathway.name}
          </Link>
        </Reveal>
      </Section>
    </>
  );
}
