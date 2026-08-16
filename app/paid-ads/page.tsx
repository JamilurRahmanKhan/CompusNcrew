import type { Metadata } from "next";
import { PaidAdsStudio } from "./paid-ads-studio";

export const metadata: Metadata = {
  title: "Paid Ads Management & Campaign Creative",
  description:
    "Paid advertising management and campaign creative services for Meta and Google, with focused testing, tracking and ongoing optimization.",
  alternates: { canonical: "/paid-ads" },
};

export default function PaidAdsPage() {
  return <PaidAdsStudio />;
}
