/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SERVICE TAKEOVER PRODUCT SHOTS — the hand/device cutout that slides in from
 * the bottom-right corner of the hover takeover (see <ServiceTakeover>).
 *
 * Optional per service — a slug with no entry here simply shows the
 * background image with no product shot layered on top. This is for a
 * transparent-background PNG (a hand holding a phone, a device on its own,
 * etc.) that reads correctly floating over the backdrop image without its
 * own background clashing.
 *
 * To drop one in:
 *   1. Put the file at   public/media/services/<slug>-product.png
 *      e.g. public/media/services/software-development-product.png
 *   2. Set               src: "/media/services/<slug>-product.png"
 *   3. Write a real `alt` describing what's shown.
 *
 * Sourcing notes:
 *   - Transparent PNG, subject only — no background, no drop shadow baked
 *     in (the component adds its own so it grounds consistently against
 *     every backdrop).
 *   - Portrait-ish crop reads best: tall enough that "sliding up from the
 *     bottom-right corner" has room to travel.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type ServiceProduct = {
  src: string;
  alt: string;
};

export const serviceProducts: Partial<Record<string, ServiceProduct>> = {
  "business-marketing": {
    src: "/media/services/seo-product.png",
    alt: "Three phone screens showing an SEO app's keyword tagging, ranking and insights views.",
  },
};
