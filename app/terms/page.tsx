import type { Metadata } from "next";
import { brand } from "../brand";
import { LegalPage } from "../components/legal-page";

export const metadata: Metadata = {
  title: "Terms",
  description: `Terms covering use of the ${brand.name} website.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms"
      intro={`These terms cover your use of this website. They do not govern client engagements — those are covered by a signed services agreement and statement of work.`}
      sections={[
        {
          heading: "Nothing here is an offer",
          body: [
            "Descriptions of services, inclusions and exclusions on this site are indicative. Scope, price, timeline and responsibilities are set in a signed statement of work, and that document takes precedence over anything written here.",
          ],
        },
        {
          heading: "No guaranteed results",
          body: [
            "We make no representation that any particular ranking, revenue, lead volume, conversion rate or cost per acquisition will be achieved. Outcomes depend on factors outside our control, including your market, your offer, your sales process and third-party platforms.",
          ],
        },
        {
          heading: "Content ownership",
          body: [
            `The text, design, code and other material on this site belong to ${brand.name} unless stated otherwise. You may reference and link to it. You may not republish it as your own.`,
            "The two websites referenced in the design of this site remain the property of their respective owners; nothing here implies affiliation with or endorsement by them.",
          ],
        },
        {
          heading: "Accuracy",
          body: [
            "We keep this site current but do not warrant that every statement is complete or free of error. If you spot something wrong, tell us and we will correct it.",
          ],
        },
        {
          heading: "External links",
          body: [
            "Where we link to third-party sites we do not control their content and are not responsible for it.",
          ],
        },
        {
          heading: "Contact",
          body: [
            `Questions about these terms go to ${brand.email}.`,
          ],
        },
      ]}
    />
  );
}
