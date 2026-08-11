import type { Metadata } from "next";
import { SocialUniverse } from "../../components/social-universe/social-universe";

export const metadata: Metadata = {
  title: "Social Media Marketing",
  description:
    "Explore a cinematic 3D social media journey across Instagram, Facebook, TikTok, YouTube and LinkedIn.",
};

export default function SocialMediaMarketingPage() {
  return <SocialUniverse />;
}
