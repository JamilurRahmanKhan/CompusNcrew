import Link from "next/link";
import { pathways, servicesByPathway } from "../content";
import { Reveal } from "./reveal";

/**
 * Three pathways, never eight services. Playbook §27: "Do not market six
 * unrelated services equally." The eight live one level down, each on its own
 * page, which is where the search intent and the paid traffic land.
 *
 * The numbered 01/02/03 treatment is Dept's, and Apple uses the same device on
 * its highlight rail.
 */
export function PathwayCards() {
  return (
    <div className="mt-16 grid gap-6 lg:grid-cols-3">
      {pathways.map((pathway, i) => (
        <Reveal key={pathway.id} delay={i * 90}>
          <Link
            href={`/solutions/${pathway.id}`}
            className="group flex h-full flex-col rounded-2xl border border-hairline bg-raised/60 p-8 transition-colors duration-300 hover:border-accent/40"
          >
            <span className="font-mono text-[0.75rem] text-accent">
              {pathway.index}
            </span>
            <h3 className="mt-4 font-display text-5xl leading-none text-bright">
              {pathway.name}
            </h3>
            <p className="mt-4 text-detail text-bright/80">{pathway.promise}</p>

            <ul className="mt-8 flex flex-wrap gap-2">
              {servicesByPathway(pathway.id).map((service) => (
                <li
                  key={service.slug}
                  className="rounded-full border border-hairline px-3 py-1.5 text-[0.8125rem] text-muted"
                >
                  {service.name}
                </li>
              ))}
            </ul>

            <span className="mt-8 inline-flex items-center gap-2 text-detail text-accent transition-transform duration-300 group-hover:translate-x-1">
              Explore {pathway.name}
              <span aria-hidden="true">→</span>
            </span>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
