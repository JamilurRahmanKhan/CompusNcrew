# CompassNCrew — agency site (v2)

Next.js 16 · React 19 · TypeScript · Tailwind v4. Fully static: 22 prerendered routes, no server runtime required.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run typecheck
```

---

## The design brief

A deliberate mix of two reference sites, sampled live rather than from memory.

**From metalab.com — the first impression.** Full-bleed ambient light with almost no chrome, floating pill chips, a local clock in the header, and one move that matters more than the rest: the display headline renders in **mid-grey and sits under the light**, never white on top of it. That single decision is most of the perceived quality, and it is the thing imitations get wrong.

**From apple.com/iphone-17-pro — the body.** A section anatomy that repeats down the page:

```
coloured eyebrow → very large headline → grey lead paragraph → media → feature grid
```

with big stat fragments bolded inline, a horizontal snap rail, and one light `#F5F5F7` section near the end purely for rhythm.

**From smartsites.com — content only, no design.** Their service taxonomy and the "one real landing page per service" model, which is where search intent and paid traffic actually land.

### Measured tokens

| | Reference | Here |
|---|---|---|
| Base surface | `#000000` (both sites) | `--color-ink` |
| Raised surface | `#1D1D1F` (Apple) | `--color-raised` |
| Light band | `#F5F5F7` (Apple) | `--color-band` |
| Body/lead text | `#86868B` (Apple) | `--color-muted` |
| Accent | `#FF791B` (Apple) | `#FFA033` `--color-accent` |
| Accent on light | — | `#8F5615` `--color-accent-ink` |
| Ambient | `#4B3FCF` (MetaLab hero) | `--color-ambient` |
| Display face | PP Eiko 300 (MetaLab) | Instrument Serif |
| Text face | Basis Grotesque / SF Pro | Inter |
| Headline | 56px / 60px, `-0.005em` | `.headline` |
| Lead | 19px / 27px | `.lead` |
| Detail | 17px / 25px | `.detail` |

PP Eiko and Basis Grotesque Pro are commercially licensed. Instrument Serif is the closest free match to Eiko's stroke contrast; both faces are self-hosted at build time via `next/font`, so there is no runtime request to Google and no layout shift.

**Neither reference site actually uses live WebGL.** Apple ships 16 scroll-driven `<video>` elements and MetaLab 3 — zero `<canvas>` between them. MetaLab's rotating hero object is a pre-rendered video loop, not real-time 3D. This site adds exactly one live scene anyway — a rotating faceted crystal in the hero, on request — reserved to that single place per the "one scene, not a demo reel" rule. See `app/components/hero-scene.tsx` and the WebGL section below.

---

## Editing it

Three files cover almost everything.

| File | What it controls |
|---|---|
| `app/brand.ts` | Name, monogram, descriptor, domain, email, timezone, socials, launch-preview switch. **The only file you edit to rename the agency.** |
| `app/content.ts` | Every word on the site — pathways, all eight services, homepage blocks. |
| `app/media.ts` | The ambient media slots. |

### Dropping in real video

Every ambient layer reads from `app/media.ts`. Each slot currently has an empty `src`, so `<AmbientMedia>` renders a generated 2D-canvas ambient field instead — slow drifting radial light, additive-blended, about 2KB, works on every device.

To switch a slot to real footage:

1. `public/media/hero.mp4` and a first-frame poster at `public/media/hero.jpg`
2. In `media.ts`, set `src: "/media/hero.mp4"`, `poster: "/media/hero.jpg"`

Nothing else changes anywhere in the codebase.

Encoding: 8–14s seamless loop, no cuts, no audio track, dark and slow — the headline sits on top of it and has to win.

```bash
ffmpeg -i in.mov -an -vcodec libx264 -crf 26 -pix_fmt yuv420p -vf scale=1920:-2 out.mp4
```

Target under 3MB per clip.

---

## The hero's WebGL scene

`app/components/hero-scene.tsx` renders one `THREE.IcosahedronGeometry(1.9, 0)` — 20 flat triangular facets, no environment map, lit by three point lights in the site's own accent (`#FFA033`) and ambient (`#4B3FCF`/`#8A7DFF`) hues instead of an HDR texture, so there is nothing to fetch beyond the library itself.

It is only ever mounted by `app/components/hero-backdrop.tsx`, which:

1. Runs a synchronous `prefers-reduced-motion` and throwaway-WebGL-context check on mount, before Three.js is requested at all — a reduced-motion visitor or a device that fails the probe never downloads the library.
2. Dynamically imports the scene (`next/dynamic`, `ssr: false`) only when both checks pass, so it never enters the initial bundle or the server render.
3. Falls back to the same generated 2D ambient canvas used everywhere else on the site — same colour, same vignette, same contrast guarantee — if the check fails, or if `HeroScene` itself fails after mount (driver bug, exhausted context) via an `onUnavailable` callback.

This is the one live scene on the whole site, deliberately. Every other ambient layer stays the generated canvas or a swapped-in video — see `3d-ui-design` skill guidance: reach for real-time WebGL only where a genuinely rotating object earns its cost, not as a default.

---

## Architecture

```
/                              Home — playbook §8 block order
/solutions/{build,grow,tell}   Three pathways
/services/{8 slugs}            One real landing page per service
/method                        Bearing · Chart · Crew · Log
/work                          Proof, labelled honestly
/about  /contact  /privacy  /terms
/sitemap.xml  /robots.txt
```

Three pathways on the homepage, never eight services — playbook §27, first line. The eight live one level down, each with its own hero, scope table and CTA, which is where the SEO and paid traffic land.

| Pathway | Services |
|---|---|
| **Build** | Software Development · AI Automation |
| **Grow** | Business Marketing · Product Ads · Social Media Marketing · Email & SMS |
| **Tell** | Graphic Design · Video Editing |

---

## Quality bar

Set before writing code, because on this site the page *is* the case study — a buyer judging whether we can build them a fast site will judge it by whether this one is fast.

**Performance targets**

- LCP under 2.5s on a mid-range Android over 4G
- Hero interactive under 3s on the same
- Test on a real mid-range device, not devtools throttling

**Accessibility — verified, not assumed**

- Every text/background pair on the page passes WCAG AA. Checked by compositing each translucent layer down to the page black rather than eyeballing it; the light-band accent was moved from `#FFA033` to `#8F5615` because the original measured 1.9:1.
- `prefers-reduced-motion` stops every transition and freezes every ambient layer. The page stays fully legible.
- Ambient layers are `aria-hidden` with an `.sr-only` text alternative — canvas and video are both opaque to assistive tech, so neither ever carries meaning alone.
- Skip link, visible focus rings, Escape closes the menu, body scroll locks while it is open, and overlay links are `tabIndex={-1}` when closed.
- The ambient canvas stops rendering entirely when scrolled out of view.

**Honesty (playbook §9)**

`brand.launchPreview` is `true`. While it is, no client identity, metric or testimonial is published, and demos are labelled as demos. For an offshore studio one exposed fake is terminal.

---

## Still to do

- Point `brand.domain` at the real domain once registered, and fill `brand.socials`.
- Replace the `mailto:` submit in `contact-form.tsx` with a POST to a real endpoint (Zod-validated, spam-protected) when one exists. The honeypot field is already in place.
- Add analytics and conversion events — `privacy/page.tsx` says none are set, so update it in the same commit.
- Real footage into `media.ts`.
- Legal pages are a plain-language starting point, not counsel-reviewed.
