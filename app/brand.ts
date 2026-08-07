/**
 * ─────────────────────────────────────────────────────────────────────────────
 * THE ONLY FILE YOU EDIT TO RENAME OR RE-POINT THE AGENCY.
 *
 * Change `name`, `monogram`, `domain` and `email` here and the whole site
 * follows — nav, footer, page titles, metadata, social card, contact links.
 * Nothing else in the codebase hard-codes the brand.
 *
 * Colours live in `globals.css` under @theme. Media slots live in `media.ts`.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const brand = {
  name: "CompassNCrew",
  /** Sits inside the nav mark. Two or three letters reads best. */
  monogram: "CNC",
  /** Sits under the wordmark in the nav and footer. */
  descriptor: "Digital Studio",

  domain: "https://compassncrew.com",
  email: "hello@compassncrew.com",

  /** One sentence, understood in ten seconds. Playbook §1. */
  positioning:
    "We build the software, automation, and creative that turn a good business into an obvious one.",

  /** Shown in the nav, MetaLab-style. IANA zone — drives the live clock. */
  timezone: "Asia/Dhaka",
  timezoneLabel: "DAC",

  /** Booking link for qualified enquiries. Empty falls back to the contact form. */
  bookingUrl: "",

  socials: {
    linkedin: "",
    instagram: "",
    youtube: "",
  },

  /**
   * Launch-stage honesty switch. While true, case studies render as clearly
   * labelled drafts and no client identity, metric, or testimonial is shown.
   * Playbook §9 — never imply a demo is a client outcome.
   */
  launchPreview: true,
} as const;

export type Brand = typeof brand;
