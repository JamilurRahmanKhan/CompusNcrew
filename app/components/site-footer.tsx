import Link from "next/link";
import { brand } from "../brand";
import { pathways, servicesByPathway } from "../content";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline bg-ink">
      <div className="mx-auto max-w-[80rem] px-6 py-20">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,1fr))]">
          <div>
            <p className="font-display text-3xl text-bright">{brand.name}</p>
            <p className="mt-1 text-[0.8125rem] tracking-wide text-muted">
              {brand.descriptor}
            </p>
            <p className="mt-6 max-w-[32ch] text-detail text-muted">
              {brand.positioning}
            </p>
            <a
              href={`mailto:${brand.email}`}
              className="mt-6 inline-block text-detail text-bright underline decoration-hairline underline-offset-4 transition-colors hover:text-accent"
            >
              {brand.email}
            </a>
          </div>

          {pathways.map((pathway) => (
            <div key={pathway.id}>
              <Link
                href={`/solutions/${pathway.id}`}
                className="text-[0.8125rem] uppercase tracking-[0.14em] text-accent"
              >
                {pathway.name}
              </Link>
              <ul className="mt-5 space-y-2.5">
                {servicesByPathway(pathway.id).map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={`/services/${service.slug}`}
                      className="text-[0.9375rem] text-muted transition-colors hover:text-bright"
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-hairline pt-8 text-[0.8125rem] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {brand.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-6">
            <Link href="/method" className="transition-colors hover:text-bright">
              Method
            </Link>
            <Link href="/work" className="transition-colors hover:text-bright">
              Work
            </Link>
            <Link href="/about" className="transition-colors hover:text-bright">
              About
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-bright">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-bright">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
