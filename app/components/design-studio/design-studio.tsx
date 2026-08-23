import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { DesignContact } from "./design-contact";
import styles from "./design-studio.module.css";

const services = [
  {
    number: "01",
    title: "Brand identity",
    description:
      "Distinctive identity systems that make a business recognizable, consistent and ready to grow.",
    deliverables: "Strategy · Logo systems · Visual guidelines",
  },
  {
    number: "02",
    title: "Digital design",
    description:
      "Clear, memorable websites and product interfaces designed around real customer journeys.",
    deliverables: "Web design · Product UI · Prototypes",
  },
  {
    number: "03",
    title: "Campaign creative",
    description:
      "One strong visual idea translated into launch assets, paid media and social content.",
    deliverables: "Art direction · Advertising · Social systems",
  },
  {
    number: "04",
    title: "Packaging & editorial",
    description:
      "Physical and long-form design that balances visual distinction with practical information.",
    deliverables: "Packaging · Reports · Pitch decks",
  },
] as const;

const portfolio = [
  {
    title: "Coffee campaign",
    category: "Campaign design",
    image: "/media/design-portfolio/coffee-campaign.png",
    position: "center",
  },
  {
    title: "Gaming controller",
    category: "Product visual",
    image: "/media/design-portfolio/gaming-product.png",
    position: "center 42%",
  },
  {
    title: "Berry shampoo",
    category: "Product campaign",
    image: "/media/design-portfolio/shampoo-product.png",
    position: "center",
  },
  {
    title: "Raspberry lemonade",
    category: "Social campaign",
    image: "/media/design-portfolio/lemonade-campaign.png",
    position: "center",
  },
] as const;

const studioWorlds = ["Coffee", "Madawi", "Northstar", "Common Form", "Move"] as const;

export function DesignStudio() {
  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-label="Selected design work">
        <Image
          src="/media/services/design-gallery-poster-wall-v2.webp"
          alt="A sunlit design gallery with nine wooden easels showcasing campaign, product, social and editorial artwork"
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
      </section>

      <main className={styles.content}>
        <section className={styles.services} id="services" aria-labelledby="services-title">
          <header className={styles.sectionHeader}>
            <h2 id="services-title" className={styles.ghostTitle}>Services</h2>
            <p className={styles.eyebrow}>Services <span aria-hidden="true" /></p>
          </header>

          <div className={styles.accordion}>
            {services.map((service, index) => (
              <details className={styles.serviceItem} key={service.title} open={index === 0}>
                <summary>
                  <span className={styles.serviceNumber}>{service.number}</span>
                  <span className={styles.serviceTitle}>{service.title}</span>
                  <span className={styles.toggle} aria-hidden="true" />
                </summary>
                <div className={styles.serviceBody}>
                  <p>{service.description}</p>
                  <span>{service.deliverables}</span>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className={styles.portfolio} aria-labelledby="portfolio-title">
          <header className={styles.sectionHeader}>
            <h2 id="portfolio-title" className={styles.ghostTitle}>Latest portfolio</h2>
            <p className={styles.eyebrow}>Selected studio work <span aria-hidden="true" /></p>
          </header>

          <div className={styles.portfolioGrid}>
            {portfolio.map((project, index) => (
              <article className={styles.projectCard} key={project.title}>
                <Image
                  src={project.image}
                  alt={`${project.title} — ${project.category}`}
                  fill
                  sizes="(max-width: 760px) 100vw, 50vw"
                  className={styles.projectImage}
                  style={{ objectPosition: project.position }}
                />
                <div className={styles.projectLabel}>
                  <span>{project.category}</span>
                  <span className={styles.projectArrow} aria-hidden="true"><ArrowUpRight size={18} /></span>
                </div>
                <span className={styles.projectIndex} aria-hidden="true">0{index + 1}</span>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.worlds} aria-labelledby="worlds-title">
          <div className={styles.worldsHeading}>
            <h2 id="worlds-title">Selected studio brand worlds</h2>
            <p>Original concepts · Ready for real briefs</p>
          </div>
          <div className={styles.worldGrid}>
            {studioWorlds.map((name, index) => (
              <div className={styles.worldCard} key={name}>
                <span className={styles[`worldMark${index + 1}`]}>{name}</span>
              </div>
            ))}
          </div>
          <p className={styles.worldNote}>Approved client identities will replace these studio concepts as permissions are secured.</p>
        </section>

        <section className={styles.contact} id="contact" aria-labelledby="contact-title">
          <header className={styles.contactHeader}>
            <h2 id="contact-title" className={styles.ghostTitle}>Contact</h2>
            <p className={styles.eyebrow}>Start a design project <span aria-hidden="true" /></p>
          </header>
          <div className={styles.contactPanel}>
            <div className={styles.contactVisual}>
              <Image
                src="/media/design-portfolio/gaming-product.png"
                alt="Red and black gaming controller product artwork"
                fill
                sizes="(max-width: 760px) 100vw, 42vw"
                className={styles.contactImage}
              />
              <p>Make the next idea<br />impossible to ignore.</p>
            </div>
            <DesignContact />
          </div>
        </section>
      </main>
    </div>
  );
}
