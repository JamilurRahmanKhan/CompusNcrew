import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AmbientDescription,
  AmbientMedia,
} from "../../components/ambient-media";
import { Reveal } from "../../components/reveal";
import { Section } from "../../components/section";
import { getPathway, pathways, servicesByPathway } from "../../content";

type Props = { params: Promise<{ pathway: string }> };

export function generateStaticParams() {
  return pathways.map((p) => ({ pathway: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pathway: id } = await params;
  const pathway = getPathway(id);
  if (!pathway) return {};
  return {
    title: `${pathway.name} — ${pathway.promise}`,
    description: pathway.lead,
    alternates: { canonical: `/solutions/${pathway.id}` },
  };
}

export default async function PathwayPage({ params }: Props) {
  const { pathway: id } = await params;
  const pathway = getPathway(id);
  if (!pathway) notFound();

  const items = servicesByPathway(pathway.id);
  const others = pathways.filter((p) => p.id !== pathway.id);

  return (
    <>
      <section className="relative isolate flex min-h-[78svh] flex-col justify-end overflow-hidden pb-16 pt-32">
        <AmbientMedia slot={pathway.media} opacity={0.7} />
        <AmbientDescription slot={pathway.media} />

        <div className="relative mx-auto w-full max-w-[80rem] px-6">
          <Reveal>
            <p className="eyebrow mb-6">
              <span className="font-mono text-[0.75rem]">{pathway.index}</span>
              <span className="mx-3 opacity-40">/</span>
              Pathway
            </p>
            <h1 className="display display-lg mb-8">{pathway.headline}</h1>
            <p className="lead max-w-[46ch]">{pathway.lead}</p>
          </Reveal>
        </div>
      </section>

      {/* The recognisable, costly problems this pathway removes. */}
      <Section
        eyebrow="Sound familiar"
        headline={pathway.promise}
        lead="If more than one of these is true, this is the pathway that pays for itself first."
      >
        <div className="mt-14 grid gap-0 md:grid-cols-3">
          {pathway.problems.map((problem, i) => (
            <Reveal key={problem} delay={i * 80}>
              <div className="flex h-full gap-5 border-t border-hairline py-8 md:border-r md:pr-8 md:last:border-r-0">
                <span className="font-mono text-[0.75rem] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[1.0625rem] leading-relaxed text-bright/85">
                  {problem}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* The services inside this pathway. */}
      <Section
        eyebrow="Inside this pathway"
        headline={`${items.length} ways we do it.`}
        lead="Each is a full engagement in its own right. Most clients start with one."
      >
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {items.map((service, i) => (
            <Reveal key={service.slug} delay={i * 80}>
              <Link
                href={`/services/${service.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-hairline bg-raised/60 p-8 transition-colors duration-300 hover:border-accent/40"
              >
                <h3 className="font-display text-4xl leading-none text-bright">
                  {service.name}
                </h3>
                <p className="mt-4 text-detail text-muted">{service.teaser}</p>
                <ul className="mt-7 flex flex-wrap gap-2">
                  {service.subServices.map((sub) => (
                    <li
                      key={sub}
                      className="rounded-full border border-hairline px-3 py-1.5 text-[0.8125rem] text-muted"
                    >
                      {sub}
                    </li>
                  ))}
                </ul>
                <span className="mt-8 inline-flex items-center gap-2 text-detail text-accent transition-transform duration-300 group-hover:translate-x-1">
                  {service.name}
                  <span aria-hidden="true">→</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        band
        eyebrow="Other pathways"
        headline="Not the constraint you're facing?"
        lead="Pick the one that matches the problem costing you the most right now. We would rather send you to the right pathway than sell you this one."
      >
        <Reveal className="mt-12 flex flex-wrap gap-3">
          {others.map((other) => (
            <Link
              key={other.id}
              href={`/solutions/${other.id}`}
              className="inline-flex items-center gap-3 rounded-full border border-[rgba(0,0,0,0.14)] px-5 py-2.5 text-detail text-[#1d1d1f] transition-colors hover:border-[rgba(0,0,0,0.4)]"
            >
              <span className="font-mono text-[0.75rem] text-accent-ink">
                {other.index}
              </span>
              {other.name}
              <span className="text-[#6e6e73]">— {other.promise}</span>
            </Link>
          ))}
        </Reveal>
      </Section>

      <Section
        ambient="contact"
        eyebrow="Start here"
        headline="A diagnostic, not a sales call."
        lead="Thirty minutes to establish whether this pathway is actually your constraint. If it isn't, we'll say so."
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
