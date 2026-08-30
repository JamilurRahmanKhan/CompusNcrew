import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CursorDot } from "./cursor-dot";
import { GalleryLink } from "./gallery-link";
import { ScrollVideoPanel } from "./scroll-video-panel";
import { ServiceStack } from "./service-stack";
import { TrustedBy } from "./trusted-by";
import styles from "./graphic-design.module.css";

export const metadata: Metadata = {
  title: "Graphic Design — Bold visual identity",
  description:
    "A visual-forward, motion-led showcase of brand identity and campaign design work.",
  alternates: { canonical: "/graphic-design" },
};

const work = [
  {
    title: "Coffee Campaign",
    caption: "Turning a coffee brand's packaging into something people want to photograph.",
    img: "/media/design-portfolio/coffee-campaign.png",
  },
  {
    title: "Gaming Product",
    caption: "Bold key art built to stop the scroll on every platform.",
    img: "/media/design-portfolio/gaming-product.png",
  },
  {
    title: "Lemonade Campaign",
    caption: "A summer campaign built around color, contrast, and craving.",
    img: "/media/design-portfolio/lemonade-campaign.png",
  },
  {
    title: "Shampoo Product",
    caption: "Clean, tactile packaging design for a product that had to feel premium.",
    img: "/media/design-portfolio/shampoo-product.png",
  },
];

export default function GraphicDesignPage() {
  return (
    <main className={styles.page}>
      <CursorDot />

      {/* Hero */}
      <section className={`${styles.heroLight} px-6 pt-32 pb-20 text-center md:px-16`}>
        <p className={`${styles.fadeUp} mb-6 text-sm uppercase tracking-[0.3em] text-black/45`}>
          Graphic Design Studio
        </p>
        <h1
          className={`${styles.fadeUp} mx-auto max-w-4xl text-[10vw] leading-[1.02] font-bold tracking-tight text-black md:text-[4.75rem]`}
          style={{ animationDelay: "0.1s" }}
        >
          Identity and creative built to move people.
        </h1>
        <p
          className={`${styles.fadeUp} mx-auto mt-6 max-w-xl text-lg text-black/55`}
          style={{ animationDelay: "0.2s" }}
        >
          Brand systems, campaign creative, and packaging for companies ready
          to look and feel unmistakably their own.
        </p>
        <Link
          href="/#work"
          className={`${styles.fadeUp} mt-8 inline-flex items-center gap-3 rounded-full bg-black px-7 py-3 text-sm font-medium text-white transition hover:bg-black/80`}
          style={{ animationDelay: "0.3s" }}
        >
          See the work
          <span aria-hidden="true">→</span>
        </Link>

        <ScrollVideoPanel />
      </section>

      <ServiceStack />

      {/* Work grid */}
      <section
        id="work"
        className="relative z-10 -mt-12 [transform:translateZ(0)] rounded-t-[3.5rem] bg-[#0a0a0a] px-6 pt-40 pb-24 shadow-[0_0_0_1px_#0a0a0a] sm:px-12 md:-mt-16 md:rounded-t-[5rem] md:px-24 md:pt-48 lg:px-32"
      >
        <h2 className="mx-auto mb-14 max-w-5xl text-7xl font-medium tracking-tight text-white md:text-8xl">
          Selected work
        </h2>
        <div className="mx-auto grid max-w-5xl gap-x-20 gap-y-10 sm:grid-cols-2">
          {work.map((item, i) => (
            <article
              key={item.title}
              className={i % 2 === 1 ? "sm:mt-12" : undefined}
            >
              <div className={`relative aspect-[4/5] w-full ${styles.card}`}>
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className={`object-cover ${styles.cardImg}`}
                />
              </div>
              <p className="mt-4 max-w-xs text-2xl text-white">{item.caption}</p>
            </article>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <GalleryLink
            href="/graphic-design/portfolio"
            className="inline-flex items-center gap-3 rounded-full border border-white/20 px-14 py-7 text-2xl font-medium transition hover:border-white hover:bg-white hover:text-black"
          >
            Visit Our Art Gallery
          </GalleryLink>
        </div>
      </section>

      <TrustedBy />

      {/* Statement */}
      <section className="px-6 py-32 md:px-16">
        <p className="mx-auto max-w-4xl text-center text-3xl leading-tight font-medium tracking-tight text-white/90 md:text-5xl">
          Every project starts the same way — strip it down to what actually
          matters, then push the craft until it feels inevitable.
        </p>
      </section>

      {/* CTA */}
      <section className="px-6 py-32 text-center md:px-16">
        <h2 className="mx-auto max-w-3xl text-4xl font-medium tracking-tight md:text-6xl">
          Have a project in mind?
        </h2>
        <Link
          href="/#contact"
          className="mt-10 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-semibold text-black transition hover:bg-white/85"
        >
          Start a conversation
          <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}
