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
  { id: "linkedin", short: "in", name: "LinkedIn", color: "#63a8ff", line: "Build authority in your industry.", services: ["Executive voice", "Thought leadership", "Business networking", "Demand content"] },
  { id: "pinterest", short: "P", name: "Pinterest", color: "#e60023", line: "Turn inspiration into intent.", services: ["Idea boards", "Shoppable pins", "Visual search SEO", "Trend discovery"] },
  { id: "twitter", short: "X", name: "X / Twitter", color: "#8a8f98", line: "Join the conversation in real time.", services: ["Real-time engagement", "Community building", "Trend-jacking", "Brand voice"] },
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
