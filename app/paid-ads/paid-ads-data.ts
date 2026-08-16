export type PaidAdsPlatform = "google" | "meta";

export interface AdPreview {
  id: string;
  platform: PaidAdsPlatform;
  image: string;
  alt: string;
  headline: string;
  body: string;
  metrics: readonly { label: string; value: string }[];
}

export interface PlatformPerformance {
  platform: PaidAdsPlatform;
  name: string;
  logo: string;
  metrics: readonly { label: string; value: string; change: string }[];
  trend: readonly number[];
}

export interface Capability {
  title: string;
  description: string;
}

export const paidAdsDemoDisclaimer = "Demonstration content only — not client results.";

export const googleAdPreviews: readonly AdPreview[] = [
  {
    id: "google-search-growth",
    platform: "google",
    image: "/paid-ads/google-ads-1.jpg",
    alt: "Demonstration Google Ads search campaign preview",
    headline: "Meet demand the moment it peaks",
    body: "A concise search-led offer designed to turn high-intent visits into qualified conversations.",
    metrics: [{ label: "Demo CTR", value: "5.8%" }, { label: "Demo CPL", value: "$22" }],
  },
  {
    id: "google-shopping-launch",
    platform: "google",
    image: "/paid-ads/google-ads-2.jpg",
    alt: "Demonstration Google Ads shopping campaign preview",
    headline: "Put your best product forward",
    body: "Clean product messaging, useful proof points, and an offer shoppers can act on quickly.",
    metrics: [{ label: "Demo ROAS", value: "4.1x" }, { label: "Demo CVR", value: "3.6%" }],
  },
  {
    id: "google-local-discovery",
    platform: "google",
    image: "/paid-ads/google-ads-3.jpg",
    alt: "Demonstration Google Ads local discovery campaign preview",
    headline: "Be the local answer",
    body: "A location-aware campaign structure built for calls, directions, and ready-to-book traffic.",
    metrics: [{ label: "Demo calls", value: "+38%" }, { label: "Demo CPA", value: "$18" }],
  },
];

export const metaAdPreviews: readonly AdPreview[] = [
  {
    id: "meta-social-proof",
    platform: "meta",
    image: "/paid-ads/meta-ads-1.jpg",
    alt: "Demonstration Meta Ads social proof campaign preview",
    headline: "Turn attention into trust",
    body: "A social-first creative angle that makes the value proposition easy to understand at a glance.",
    metrics: [{ label: "Demo reach", value: "84K" }, { label: "Demo CTR", value: "2.9%" }],
  },
  {
    id: "meta-retargeting",
    platform: "meta",
    image: "/paid-ads/meta-ads-2.jpg",
    alt: "Demonstration Meta Ads retargeting campaign preview",
    headline: "Give warm visitors a reason back",
    body: "A clear return-path for people who explored the offer but were not ready to convert yet.",
    metrics: [{ label: "Demo ROAS", value: "3.7x" }, { label: "Demo frequency", value: "2.1" }],
  },
  {
    id: "meta-lead-forms",
    platform: "meta",
    image: "/paid-ads/meta-ads-3.jpg",
    alt: "Demonstration Meta Ads lead form campaign preview",
    headline: "Make the next step feel simple",
    body: "A focused lead-generation story paired with a lower-friction conversion path.",
    metrics: [{ label: "Demo leads", value: "126" }, { label: "Demo CPL", value: "$16" }],
  },
];

export const platformPerformance: readonly PlatformPerformance[] = [
  {
    platform: "google",
    name: "Google Ads",
    logo: "/paid-ads/google-ads-logo.png",
    metrics: [
      { label: "Demo spend", value: "$8.4K", change: "+12%" },
      { label: "Demo leads", value: "382", change: "+18%" },
      { label: "Demo CPL", value: "$22", change: "-9%" },
    ],
    trend: [32, 41, 38, 54, 49, 67, 73],
  },
  {
    platform: "meta",
    name: "Meta Ads",
    logo: "/paid-ads/meta-logo.png",
    metrics: [
      { label: "Demo spend", value: "$6.1K", change: "+8%" },
      { label: "Demo leads", value: "294", change: "+14%" },
      { label: "Demo CPL", value: "$21", change: "-6%" },
    ],
    trend: [28, 36, 44, 39, 57, 62, 70],
  },
];

export const paidAdsCapabilities: readonly Capability[] = [
  { title: "Campaign architecture", description: "Channel structures designed around the actions that matter most." },
  { title: "Creative direction", description: "Concepts and messages shaped for the pace of each platform." },
  { title: "Conversion tracking", description: "Measurement that connects media activity with meaningful business signals." },
  { title: "Weekly optimization", description: "Practical iteration informed by performance patterns and audience response." },
];

export const paidAdsRenderContract = {
  previewDecks: [
    { platform: "google", previews: googleAdPreviews },
    { platform: "meta", previews: metaAdPreviews },
  ],
  performanceCards: platformPerformance,
  capabilities: paidAdsCapabilities,
} as const;
