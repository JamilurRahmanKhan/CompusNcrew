import type { Metadata } from "next";
import { SocialCubePage } from "../../components/social-cube/social-cube-page";

export const metadata: Metadata = {
  title: "Social Media Marketing",
  description:
    "A rotating platform showcase across Instagram, Facebook, LinkedIn, Pinterest and X.",
};

export default function SocialMediaMarketingPage() {
  return <SocialCubePage />;
}
