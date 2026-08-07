import { Reveal } from "./reveal";

/**
 * Shared shell for Privacy and Terms. Deliberately plain — these pages are read
 * by people looking for a specific fact, and the ambient treatment used
 * everywhere else would get in the way.
 */
export function LegalPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
}) {
  return (
    <>
      <section className="pb-8 pt-36">
        <div className="mx-auto w-full max-w-[52rem] px-6">
          <Reveal>
            <h1 className="display text-6xl md:text-7xl">{title}</h1>
            <p className="lead mt-8 max-w-none">{intro}</p>
          </Reveal>
        </div>
      </section>

      <section className="pb-32">
        <div className="mx-auto w-full max-w-[52rem] px-6">
          {sections.map((section, i) => (
            <Reveal key={section.heading} delay={i * 40}>
              <div className="border-t border-hairline py-10">
                <h2 className="mb-4 text-[1.375rem] font-semibold text-bright">
                  {section.heading}
                </h2>
                {section.body.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mb-4 text-detail leading-relaxed text-muted last:mb-0"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
          ))}

          <p className="mt-10 border-t border-hairline pt-8 text-[0.8125rem] leading-relaxed text-muted/70">
            This page is a plain-language starting point, not legal advice. Have
            it reviewed by a qualified adviser in your jurisdiction before you
            rely on it commercially.
          </p>
        </div>
      </section>
    </>
  );
}
