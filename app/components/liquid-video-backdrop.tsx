"use client";

/**
 * The liquid-metal video hero, full-bleed — no mask, no inset margin. Three
 * stacked gradients keep foreground type readable over a bright, moving
 * surface, same technique as every other ambient layer on the site:
 * decorative, `aria-hidden`, never load-bearing for meaning.
 */
export function LiquidVideoBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-zinc-950" aria-hidden="true">
      <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover">
        <source
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/liquid-metal-video_yX6NvjdW-6bLYorR3Ihmlwjivg3pjA978qrSKRU.mp4"
          type="video/mp4"
        />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/25 via-transparent to-zinc-950/55" />
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/45 via-zinc-950/10 to-transparent" />
      <div className="absolute inset-0 [background:radial-gradient(90%_60%_at_10%_75%,rgba(0,0,0,.6)_0%,transparent_70%)]" />
    </div>
  );
}
