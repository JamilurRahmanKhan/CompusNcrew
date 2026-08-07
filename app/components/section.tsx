import type { ReactNode } from "react";
import type { MediaKey } from "../media";
import { AmbientDescription, AmbientMedia } from "./ambient-media";
import { Reveal } from "./reveal";

/**
 * Apple's section anatomy, which repeats six times down the iPhone 17 Pro page:
 *
 *   coloured eyebrow → very large headline → grey lead paragraph → media →
 *   feature grid with bolded stat fragments
 *
 * Everything below is that shape, made reusable.
 */

export function Section({
  id,
  eyebrow,
  headline,
  lead,
  ambient,
  band = false,
  children,
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  headline?: string;
  lead?: string;
  ambient?: MediaKey;
  /** Light section. Apple uses one near the end purely for rhythm. */
  band?: boolean;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`relative isolate overflow-hidden py-28 md:py-40 ${
        band ? "band" : ""
      } ${className}`}
    >
      {ambient && (
        <>
          <AmbientMedia slot={ambient} opacity={0.4} />
          <AmbientDescription slot={ambient} />
        </>
      )}

      <div className="relative mx-auto max-w-[80rem] px-6">
        {(eyebrow || headline || lead) && (
          <Reveal className="max-w-[54rem]">
            {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
            {headline && <h2 className="headline mb-6">{headline}</h2>}
            {lead && <p className="lead">{lead}</p>}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}

/**
 * Apple's feature grid. Note the copy pattern: the title is a complete sentence
 * ending in a full stop, and the body carries the detail — never a noun label
 * with a fragment underneath.
 */
export function FeatureGrid({
  items,
  columns = 2,
}: {
  items: { title: string; body: string }[];
  columns?: 2 | 3;
}) {
  return (
    <div
      className={`mt-16 grid gap-x-12 gap-y-12 ${
        columns === 3 ? "md:grid-cols-3" : "md:grid-cols-2"
      }`}
    >
      {items.map((item, i) => (
        <Reveal key={item.title} delay={i * 70}>
          <h3 className="mb-3 text-[1.375rem] font-semibold leading-snug text-bright">
            {item.title}
          </h3>
          <p className="text-detail text-muted">{item.body}</p>
        </Reveal>
      ))}
    </div>
  );
}

/** Apple's inline stat treatment — the number is the loudest thing on screen. */
export function StatRow({
  stats,
}: {
  stats: { value: string; label: string }[];
}) {
  return (
    <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <Reveal key={stat.label} delay={i * 70}>
          <p className="font-display text-6xl leading-none text-accent">
            {stat.value}
          </p>
          <p className="mt-3 text-detail text-muted">{stat.label}</p>
        </Reveal>
      ))}
    </div>
  );
}

/** A bordered list. Used for deliverables and exclusions on service pages. */
export function CheckList({
  title,
  items,
  tone = "included",
}: {
  title: string;
  items: string[];
  tone?: "included" | "excluded";
}) {
  return (
    <div>
      <h3 className="mb-5 text-[1.375rem] font-semibold text-bright">{title}</h3>
      <ul className="space-y-0">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-4 border-t border-hairline py-4 text-detail last:border-b"
          >
            <span
              aria-hidden="true"
              className={
                tone === "included"
                  ? "select-none text-accent"
                  : "select-none text-muted"
              }
            >
              {tone === "included" ? "+" : "—"}
            </span>
            <span className={tone === "included" ? "text-bright/85" : "text-muted"}>
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
