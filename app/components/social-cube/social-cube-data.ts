export interface Platform {
  id: string;
  short: string;
  name: string;
  color: string;
  line: string;
  services: readonly string[];
}

export const PLATFORMS: readonly Platform[] = [
  { id: "instagram", short: "IG", name: "Instagram", color: "#f15bb5", line: "Build a brand people choose to follow.", services: ["Content strategy", "Reels creation", "Brand growth", "Community management"] },
  { id: "facebook", short: "f", name: "Facebook", color: "#4d8dff", line: "Build communities. Generate customers.", services: ["Campaign planning", "Community growth", "Lead generation", "Audience care"] },
  { id: "tiktok", short: "♪", name: "TikTok", color: "#25f4ee", line: "Turn creativity into reach.", services: ["Trend research", "Short-form concepts", "Creator direction", "Performance learning"] },
  { id: "youtube", short: "▶", name: "YouTube", color: "#ff4d55", line: "Create content people remember.", services: ["Channel strategy", "Video packaging", "Shorts system", "Audience growth"] },
  { id: "linkedin", short: "in", name: "LinkedIn", color: "#63a8ff", line: "Build authority in your industry.", services: ["Executive voice", "Thought leadership", "Business networking", "Demand content"] },
] as const;

export const METHOD_STEPS: readonly (readonly [string, string])[] = [
  ["01", "Find the story"],
  ["02", "Design the system"],
  ["03", "Create natively"],
  ["04", "Listen and learn"],
] as const;

export type CubeFaceContent =
  | ({ kind: "platform" } & Platform)
  | { kind: "cta"; id: "cta"; eyebrow: string; heading: string; ctaLabel: string; href: string };

export function getCubeFaces(): readonly CubeFaceContent[] {
  return [
    ...PLATFORMS.map((platform) => ({ kind: "platform" as const, ...platform })),
    {
      kind: "cta" as const,
      id: "cta",
      eyebrow: "Ready to grow your brand?",
      heading: "Let’s create your digital success story.",
      ctaLabel: "Start the story",
      href: "/contact",
    },
  ];
}
