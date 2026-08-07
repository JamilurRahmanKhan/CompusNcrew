/**
 * ─────────────────────────────────────────────────────────────────────────────
 * MEDIA SLOTS — the only file you edit when real footage arrives.
 *
 * Every ambient/section video on the site reads from this map. Today each slot
 * has an empty `src`, so the <AmbientVideo> component renders the generated
 * canvas ambient layer instead. Drop a file into /public/media/ and set `src`
 * and the component switches to real video with no other code change.
 *
 *   1. Put the file at   public/media/hero.mp4
 *   2. Put a poster at   public/media/hero.jpg   (first frame, ~120KB webp/jpg)
 *   3. Set               src: "/media/hero.mp4", poster: "/media/hero.jpg"
 *
 * Sourcing notes, so the swap is quick:
 *   - Keep clips 8–14s, seamlessly looping, no cuts. Both reference sites use
 *     one continuous move per section.
 *   - Encode H.264 MP4 at 1920x1080, CRF 26, no audio track. Target under 3MB.
 *     `ffmpeg -i in.mov -an -vcodec libx264 -crf 26 -pix_fmt yuv420p out.mp4`
 *   - Dark, low-contrast, slow. The headline sits on top of it and must win.
 *
 * `tone` drives the generated ambient layer's palette when `src` is empty, so
 * each section still looks distinct before real footage lands.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type MediaSlot = {
  /** Empty string → generated ambient canvas renders instead. */
  src: string;
  /** First-frame still. Also the reduced-motion and no-JS fallback. */
  poster: string;
  /** Palette for the generated ambient layer. */
  tone: "indigo" | "amber" | "steel" | "ember";
  /** Screen-reader description. Required — canvas and video are both opaque to AT. */
  alt: string;
};

export const media = {
  hero: {
    src: "",
    poster: "",
    tone: "indigo",
    /** Doubles as the alt text for the live WebGL crystal, not just the fallback. */
    alt: "A slowly rotating, flat-faceted indigo crystal, lit in indigo and amber against black.",
  },
  build: {
    src: "",
    poster: "",
    tone: "steel",
    alt: "Cool steel-blue light moving across a dark surface.",
  },
  grow: {
    src: "",
    poster: "",
    tone: "amber",
    alt: "Warm amber light expanding slowly against black.",
  },
  tell: {
    src: "",
    poster: "",
    tone: "ember",
    alt: "Deep ember light turning slowly in darkness.",
  },
  method: {
    src: "",
    poster: "",
    tone: "indigo",
    alt: "Indigo light resolving into a steady centre.",
  },
  contact: {
    src: "",
    poster: "",
    tone: "amber",
    alt: "Soft amber glow at the edge of a dark frame.",
  },
} as const satisfies Record<string, MediaSlot>;

export type MediaKey = keyof typeof media;
