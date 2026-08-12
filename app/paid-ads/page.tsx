import type { Metadata } from "next";
import { PaidAdsStudio } from "./paid-ads-studio";

export const metadata: Metadata = {
  title: "Paid Ads — Google Ads & Meta Ads",
  description:
    "Google and Meta campaigns built around clear offers, conversion tracking and creative testing.",
  alternates: { canonical: "/paid-ads" },
};

export default function PaidAdsPage() {
  return <PaidAdsStudio />;
}
