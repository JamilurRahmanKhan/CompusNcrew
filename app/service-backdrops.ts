/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SERVICE TAKEOVER BACKDROPS — the only file you edit when real photography
 * arrives for the hover takeover (see <ServiceTakeover>).
 *
 * Each service can have one still image: hovering its chip swaps the hero to
 * that image, full-bleed, under a minimal glass card carrying the copy. Until
 * a slug has a `src`, it falls back to a generated dark gradient in the
 * service's own tone — restrained, not decorative, so the page never looks
 * unfinished while photography is pending.
 *
 * To drop in a real image:
 *   1. Put the file at   public/media/services/<slug>.jpg
 *      e.g. public/media/services/software-development.jpg
 *   2. Set               src: "/media/services/<slug>.jpg"
 *   3. Write a real `alt` — the image is the only thing on screen for
 *      sighted users in that state, and screen-reader users get nothing
 *      without this.
 *
 * Sourcing notes:
 *   - Portrait-safe framing: the glass card sits center-left, so keep the
 *     subject clear of that zone (right two-thirds, or a centered subject
 *     with room to breathe).
 *   - Dark, high-contrast, premium — closer to a product-photography moodboard
 *     than a stock photo. 2400x1600 or larger, under 400KB as compressed JPEG.
 *   - One image per service is enough. This is a hover state, not a gallery.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type ServiceBackdrop = {
  /** Empty string → generated gradient fallback renders instead. */
  src: string;
  /** Required once `src` is set — the image carries all the meaning here. */
  alt: string;
  /** Fallback gradient tone, also used as a wash under real photography. */
  tone: "gold" | "steel" | "amber" | "ember" | "indigo";
  /** "cover" (default) fills the frame; "contain" for mockup shots with their own dark margin, so nothing gets cropped off-screen. */
  fit?: "cover" | "contain";
};

export const serviceBackdrops: Record<string, ServiceBackdrop> = {
  "software-development": {
    src: "/media/services/software-bg.jpeg",
    alt: "Smooth gold silk ribbons curving across a black background.",
    tone: "gold",
  },
  "ai-automation": {
    src: "/media/services/ai-automation-bg-graded.jpg",
    alt: "A tablet showing an AI workflow-automation builder, held in dim, moody light.",
    tone: "steel",
  },
  "business-marketing": {
    src: "/media/services/seo-bg.jpg",
    alt: "A tiled collage of a violet SEO analytics dashboard, showing keyword tagging and ranking insights.",
    tone: "indigo",
  },
  "product-ads": {
    src: "/media/services/paid-ads-bg.jpg",
    alt: "A tiled collage of dark, high-contrast performance-supplement ad creative in black and green.",
    tone: "ember",
  },
  "social-media-marketing": {
    src: "/media/services/social-bg.jpg",
    alt: "A tiled collage of social media app screens on a warm orange background.",
    tone: "indigo",
  },
  "email-sms": {
    src: "/media/services/email-bg.jpg",
    alt: "A dark tablet screen showing an automated email workflow builder with green accent nodes.",
    tone: "steel",
  },
  "graphic-design": {
    src: "/media/services/design-bg.jpg",
    alt: "A hand using a stylus to color a 3D character model on a tablet, on a warm orange background.",
    tone: "amber",
  },
  "video-editing": {
    src: "/media/services/video-editing-bg.jpg",
    alt: "A dark video editing timeline interface with a drift car clip and sound controls.",
    tone: "steel",
  },
};
