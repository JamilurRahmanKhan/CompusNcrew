import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AmbientDescription,
  AmbientMedia,
} from "../../components/ambient-media";
import { Reveal } from "../../components/reveal";
import { FeatureGrid, Section } from "../../components/section";
import { getPathway, getService, services } from "../../content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: `${service.name} — ${service.headline}`,
    description: service.lead,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

/**
 * Each of the eight services gets a real landing page — its own hero, its own
 * proof, its own CTA. This is the Tier-B pattern (SmartSites, WebFX): it is
 * where search intent lands and where paid traffic converts, and it is the
 * reason the homepage can stay disciplined.
 */
export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const pathway = getPathway(service.pathway)!;
  const siblings = services.filter(
    (s) => s.pathway === service.pathway && s.slug !== service.slug,
  );

  return (
    <>
      <section className="relative isolate flex min-h-[74svh] flex-col justify-end overflow-hidden pb-16 pt-32">
        <AmbientMedia slot={pathway.media} opacity={0.62} />
        <AmbientDescription slot={pathway.media} />

        <div className="relative mx-auto w-full max-w-[80rem] px-6">
          <Reveal>
            <p className="eyebrow mb-6">
              <Link
                href={`/solutions/${pathway.id}`}
                className="underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current"
              >
                {pathway.name}
              </Link>
              <span className="mx-3 opacity-40">/</span>
              {service.name}
            </p>
            <h1 className="display display-lg mb-8">{service.headline}</h1>
            <p className="lead max-w-[48ch]">{service.lead}</p>
          </Reveal>

          <Reveal as="ul" className="mt-10 flex flex-wrap gap-2" delay={140}>
            {service.subServices.map((sub) => (
              <li key={sub} className="pill">
                {sub}
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <Section
        eyebrow="How we do it"
        headline={`${service.name}, done properly.`}
        lead="The four decisions that separate work that holds up from work that looks fine on delivery day."
      >
        <FeatureGrid items={service.features} />
      </Section>

      {/* Inclusions and exclusions, stated together. Playbook §5: exclusions
          are part of the offer, not fine print. */}
      <Section
        band
        eyebrow="Scope"
        headline="What you get, and what you don't."
        lead="Written down before we start, so scope stops being a conversation halfway through the project."
      >
        <div className="mt-14 grid gap-12 md:grid-cols-2">
          <Reveal>
            <div className="[&_h3]:text-[#1d1d1f] [&_li]:border-[rgba(0,0,0,0.12)] [&_span]:text-[#1d1d1f]">
              <h3 className="mb-5 text-[1.375rem] font-semibold text-[#1d1d1f]">
                Included
              </h3>
              <ul>
                {service.deliverables.map((item) => (
                  <li
                    key={item}
                    className="flex gap-4 border-t border-[rgba(0,0,0,0.12)] py-4 text-detail text-[#1d1d1f] last:border-b"
                  >
                    <span aria-hidden="true" className="select-none text-accent-ink">
                      +
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <h3 className="mb-5 text-[1.375rem] font-semibold text-[#1d1d1f]">
              Not included
            </h3>
            <ul>
              {service.notIncluded.map((item) => (
                <li
                  key={item}
                  className="flex gap-4 border-t border-[rgba(0,0,0,0.12)] py-4 text-detail text-[#6e6e73] last:border-b"
                >
                  <span aria-hidden="true" className="select-none">
                    —
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
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
                  <h3 className="text-[1.375rem] font-semibold text-bright">
                    {sibling.name}
                  </h3>
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
