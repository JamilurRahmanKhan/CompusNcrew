import type { Metadata } from "next";
import { SeoShowcase } from "../../components/seo-showcase/seo-showcase";

export const metadata: Metadata = {
  title: "SEO services — Rank for searches that lead to business",
  description:
    "Technical SEO, search strategy, content and local visibility designed around qualified demand — not vanity rankings.",
  alternates: { canonical: "/services/business-marketing" },
};

export default function SeoServicesPage() {
  return <SeoShowcase />;
}
