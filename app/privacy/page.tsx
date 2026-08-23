import type { Metadata } from "next";
import { brand } from "../brand";
import { LegalPage } from "../components/legal-page";

export const metadata: Metadata = {
  title: "Privacy",
  description: `How ${brand.name} collects, uses and stores the information you send us.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy"
      intro={`This explains what ${brand.name} collects when you use this site or send us an enquiry, why we collect it, and what we do not do with it.`}
      sections={[
        {
          heading: "What we collect",
          body: [
            "When you submit the enquiry form we receive the information you type into it: your name, work email, company, role, team size, the problem you describe, your timeline and budget range, and the systems you already use.",
            "We do not ask for, and you should not send us, financial account details, government identifiers, passwords, API keys, or any personal data about your own customers.",
          ],
        },
        {
          heading: "How the form works",
          body: [
            "The enquiry form composes an email in your own mail application and sends it to us directly. It does not post to a third-party form service, and the data does not pass through an intermediary before it reaches us.",
          ],
        },
        {
          heading: "Why we hold it",
          body: [
            "To reply to your enquiry, assess whether we are a fit, and keep a record of the conversation if it becomes a client relationship. We do not sell it, rent it, or share it with advertisers.",
          ],
        },
        {
          heading: "How long we keep it",
          body: [
            "Enquiries that do not become engagements are deleted within twelve months. Records relating to client engagements are kept for as long as our agreement and applicable tax and legal obligations require.",
          ],
        },
        {
          heading: "Analytics and cookies",
          body: [
            "This site sets no advertising or tracking cookies. If we add analytics later, this page will be updated before it goes live, and any non-essential measurement will be opt-in.",
          ],
        },
        {
          heading: "Your rights",
          body: [
            `You can ask us what we hold about you, ask for it to be corrected, or ask for it to be deleted. Write to ${brand.email} and we will action it within thirty days.`,
          ],
        },
        {
          heading: "Client data",
          body: [
            "Where we process data on behalf of a client, that processing is governed by the data-processing terms in our agreement with them, not by this page. We take least-privilege delegated access, maintain an access register, and revoke access at the end of an engagement.",
          ],
        },
      ]}
    />
  );
}
