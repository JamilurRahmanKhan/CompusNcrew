import type { MediaKey } from "./media";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ALL SITE COPY.
 *
 * Structure follows the playbook: the homepage sells ONE outcome to ONE buyer
 * (§8), three pathways sit under it, and eight service pages sit under those —
 * each a real landing page with its own hero, proof and CTA. Nobody sees eight
 * equal cards on the homepage (§27, first line).
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type Feature = { title: string; body: string };
export type Stat = { value: string; label: string };

export type Service = {
  slug: string;
  pathway: PathwayId;
  /** Nav + card label. */
  name: string;
  /** One line, on the pathway card. */
  teaser: string;
  headline: string;
  lead: string;
  /** SmartSites' sub-service pattern — this is what carries the search intent. */
  subServices: string[];
  features: Feature[];
  /** What the client actually receives. Playbook §5: inclusions, stated plainly. */
  deliverables: string[];
  /** Honest scope boundaries. Playbook §5: exclusions are part of the offer. */
  notIncluded: string[];
};

export type PathwayId = "build" | "grow" | "tell";

export type Pathway = {
  id: PathwayId;
  index: string;
  name: string;
  promise: string;
  headline: string;
  lead: string;
  media: MediaKey;
  /** The costly problems this pathway removes. Playbook §8, block 3. */
  problems: string[];
};

/* ─── Pathways ────────────────────────────────────────────────────────────── */

export const pathways: Pathway[] = [
  {
    id: "build",
    index: "01",
    name: "Build",
    promise: "Systems that carry real load.",
    headline: "The work that shouldn't need a person.",
    lead: "Most operational drag isn't a staffing problem. It's a process that was never designed — it accumulated. We build the software and automation that takes it off your team permanently.",
    media: "build",
    problems: [
      "Quotes, onboarding and reporting are assembled by hand every single time.",
      "Three tools hold the same data and none of them agree.",
      "The person who understands the process is the bottleneck in it.",
    ],
  },
  {
    id: "grow",
    index: "02",
    name: "Grow",
    promise: "Demand that compounds instead of resetting.",
    headline: "Attention you keep, not attention you rent.",
    lead: "Paid traffic stops the day you stop paying. Search, email and owned audience keep working. We build the mix that gets you leads this quarter without leaving you dependent on spend next year.",
    media: "grow",
    problems: [
      "Leads arrive but nobody can say which channel produced them.",
      "Spend goes up, cost per booked call goes up with it.",
      "The list has thousands of contacts and nothing is ever sent to it.",
    ],
  },
  {
    id: "tell",
    index: "03",
    name: "Tell",
    promise: "Value that's easy to trust and remember.",
    headline: "Good work that looks like good work.",
    lead: "Buyers judge capability from surface long before they read a proposal. Design and video are not decoration here — they are how a competent business stops being mistaken for an average one.",
    media: "tell",
    problems: [
      "The product is better than the way it's presented.",
      "Every asset was made by a different hand and it shows.",
      "Founders are on camera monthly and none of it gets edited.",
    ],
  },
];

/* ─── Services ────────────────────────────────────────────────────────────── */

export const services: Service[] = [
  {
    slug: "software-development",
    pathway: "build",
    name: "Software Development",
    teaser: "Custom platforms, storefronts and internal tools.",
    headline: "Built once. Owned by you.",
    lead: "We build web platforms, storefronts and internal tools that hold up under real use — versioned, tested, documented, and handed over with the keys. No dependency on us to keep the lights on.",
    subServices: [
      "Custom Development",
      "WordPress",
      "Shopify",
      "Magento",
      "Site Maintenance",
    ],
    features: [
      {
        title: "Paid discovery first.",
        body: "We map the current process and write acceptance criteria before anyone opens an editor. It is the cheapest hour in the whole project and it is where scope stops being a guess.",
      },
      {
        title: "Prototype the risk.",
        body: "The unknown part gets built first, small, in isolation. If an integration is going to fail, it fails in week one on our time rather than in month three on yours.",
      },
      {
        title: "Staging and production, separated.",
        body: "Every change lands on staging, gets reviewed, then ships. Rollback is one command. Nobody edits a live site at midnight.",
      },
      {
        title: "You own the accounts.",
        body: "Repository, hosting, domain and analytics are registered to you from day one, with delegated access for us. Ending the engagement never means losing the asset.",
      },
    ],
    deliverables: [
      "Requirements document with written acceptance criteria",
      "Source code in a repository you own",
      "Staging and production environments",
      "Automated tests on critical paths",
      "Technical documentation and a recorded handover walkthrough",
      "Thirty-day post-launch warranty on defects",
    ],
    notIncluded: [
      "Content writing and data entry, unless scoped separately",
      "Third-party licences and hosting fees, billed to you directly",
      "Ongoing feature work after handover, unless retained",
    ],
  },
  {
    slug: "ai-automation",
    pathway: "build",
    name: "AI Automation",
    teaser: "Workflow automation, agents and integrations.",
    headline: "Automate the process. Not the judgement.",
    lead: "We automate the repetitive middle of your operation — intake, routing, follow-up, reporting — and we are explicit about where a human stays in the loop. Deterministic where it can be, AI only where it must be.",
    subServices: [
      "Workflow Automation",
      "Support & Intake Agents",
      "Internal Ops Tools",
      "System Integrations",
      "Reporting Pipelines",
    ],
    features: [
      {
        title: "Baseline before build.",
        body: "We time the current process and count the volume. Without that number there is no way to prove the automation was worth building, and no way to price it honestly.",
      },
      {
        title: "Deterministic wherever possible.",
        body: "A rule that always works beats a model that usually works. AI gets used for the genuinely ambiguous steps — classification, extraction, drafting — and nowhere else.",
      },
      {
        title: "Evaluated against real cases.",
        body: "Every automation ships with a test set covering normal, ambiguous, adversarial and failure inputs. You see the pass rate before it touches a customer.",
      },
      {
        title: "A manual fallback, always.",
        body: "Every automated path has a documented way to run it by hand. When an API goes down at the worst possible moment, the business keeps moving.",
      },
    ],
    deliverables: [
      "Current-state process map with measured baseline",
      "Working automation in your own accounts",
      "Evaluation set and pass-rate report",
      "Logging, cost monitoring and alerting",
      "Documented manual fallback for every path",
      "Team training session and written runbook",
    ],
    notIncluded: [
      "Automating professional, legal, clinical or financial judgement",
      "Model API costs, billed to your account directly",
      "Unsupervised action on irreversible operations",
    ],
  },
  {
    slug: "business-marketing",
    pathway: "grow",
    name: "Business Marketing",
    teaser: "SEO that earns traffic you don't rent.",
    headline: "Rank for the searches that end in a sale.",
    lead: "Traffic is not the goal. Qualified traffic is. We fix the technical foundation, target the terms your buyers actually use at the moment they're ready, and build the pages that convert them.",
    subServices: [
      "Local SEO",
      "National SEO",
      "Ecommerce SEO",
      "Technical SEO Audit",
      "Content & Blogging",
    ],
    features: [
      {
        title: "Technical audit first.",
        body: "Crawlability, index bloat, Core Web Vitals, schema. Content on a broken foundation is money burned, so the foundation gets fixed before a word is written.",
      },
      {
        title: "Intent over volume.",
        body: "A term with 200 searches a month and buying intent beats one with 20,000 and none. We build the map around what people type when they have their card out.",
      },
      {
        title: "One page per intent.",
        body: "Each service, location and use case gets a page written for it. Generic homepages do not rank and do not convert.",
      },
      {
        title: "Reported as revenue.",
        body: "Rankings are a leading indicator, not a result. Reporting ties organic sessions to enquiries, booked calls and closed work.",
      },
    ],
    deliverables: [
      "Technical audit with prioritised fix list",
      "Keyword and intent map tied to your services",
      "On-page optimisation across priority pages",
      "Schema markup and internal linking structure",
      "Monthly reporting on enquiries, not just rankings",
    ],
    notIncluded: [
      "Guaranteed rankings — nobody controls the algorithm",
      "Purchased links or private blog networks",
      "Content published without your subject-matter review",
    ],
  },
  {
    slug: "product-ads",
    pathway: "grow",
    name: "Product Ads",
    teaser: "Paid acquisition with tracking that holds up.",
    headline: "Spend that you can account for.",
    lead: "We build paid campaigns on Google and Meta where every pound is traceable to a booked call or an order. Tracking goes in before spend does — otherwise the reporting is fiction.",
    subServices: [
      "Google Ads",
      "Meta Ads",
      "Ecommerce PPC",
      "Remarketing",
      "Landing Pages",
    ],
    features: [
      {
        title: "Tracking before traffic.",
        body: "Conversion events, offline import and a defined qualified-lead standard get set up first. Without them you're optimising toward form fills that never become customers.",
      },
      {
        title: "You own the ad account.",
        body: "Campaigns are built inside your Google and Meta accounts with delegated access. Historical data, audiences and learning stay yours if we part ways.",
      },
      {
        title: "Creative tested in structure.",
        body: "Hooks, angles and formats run against each other on a schedule, not on a hunch. Winners scale, losers get retired, and the log stays visible to you.",
      },
      {
        title: "Landing page included.",
        body: "Sending paid traffic to a general page wastes most of it. Campaigns ship with a page built for the specific promise the ad made.",
      },
    ],
    deliverables: [
      "Conversion tracking and event configuration",
      "Campaign build in your own ad accounts",
      "Dedicated landing pages per campaign",
      "Creative testing backlog with results log",
      "Monthly report on cost per qualified lead and per sale",
    ],
    notIncluded: [
      "Ad spend — funded by you, directly to the platform",
      "Guaranteed cost per acquisition or return on ad spend",
      "Claims we cannot substantiate in ad copy",
    ],
  },
  {
    slug: "social-media-marketing",
    pathway: "grow",
    name: "Social Media Marketing",
    teaser: "Owned audience, on the platforms that matter.",
    headline: "Post with a point.",
    lead: "Content calendars full of filler do nothing. We build a small number of pillars tied to what your buyers actually ask, then produce and publish against them consistently enough to compound.",
    subServices: [
      "Facebook & Instagram",
      "LinkedIn",
      "TikTok & Short Video",
      "Influencer & Partnerships",
      "Community Management",
    ],
    features: [
      {
        title: "Four pillars, not forty ideas.",
        body: "Buyer problems, operational benchmarks, proof, and teardowns. Everything published maps to one of them, which is why the account starts sounding like an authority instead of a feed.",
      },
      {
        title: "Built for the platform.",
        body: "Aspect ratio, safe zones, caption burn-in, and hook length are decided per platform. The same file cross-posted everywhere performs everywhere badly.",
      },
      {
        title: "Measured against pipeline.",
        body: "Reach and followers are secondary. We track target-account engagement, qualified inbound and content-assisted opportunities.",
      },
      {
        title: "Honest about the timeline.",
        body: "Organic social is a compounding channel with a slow start. If you need leads this month, we will tell you to fund paid instead and revisit this in the quarter.",
      },
    ],
    deliverables: [
      "Content pillar strategy and monthly calendar",
      "Produced posts, captions and platform-native cuts",
      "Scheduling and publishing in your own accounts",
      "Community response guidelines",
      "Monthly report on engagement and assisted pipeline",
    ],
    notIncluded: [
      "Purchased followers, likes or engagement",
      "Responding to customer service issues on your behalf",
      "Guaranteed follower growth or virality",
    ],
  },
  {
    slug: "email-sms",
    pathway: "grow",
    name: "Email & SMS",
    teaser: "The list you already own, finally working.",
    headline: "The cheapest revenue you have is sitting in a database.",
    lead: "Most businesses have thousands of contacts who once raised a hand and never heard from them again. Automation, sequences and a reason to open — this is usually the fastest return of anything we do.",
    subServices: [
      "Marketing Automation",
      "Email Newsletters",
      "Klaviyo",
      "Mailchimp",
      "SMS Campaigns",
    ],
    features: [
      {
        title: "Flows before campaigns.",
        body: "Welcome, abandoned cart, post-purchase, re-engagement and win-back run automatically forever. They are built once and they earn every week after.",
      },
      {
        title: "Segmented, not blasted.",
        body: "Sending everything to everyone trains people to ignore you and gets your domain flagged. Lists get split by behaviour and value before anything goes out.",
      },
      {
        title: "Deliverability handled.",
        body: "SPF, DKIM and DMARC configured, domain warmed, list hygiene enforced. The best sequence in the world earns nothing from the spam folder.",
      },
      {
        title: "Consent taken seriously.",
        body: "Opt-in records, working unsubscribes and a suppression list, on both email and SMS. This is a legal requirement, not a preference.",
      },
    ],
    deliverables: [
      "Platform setup and deliverability configuration",
      "Core automated flows built and live",
      "Segmentation structure and list hygiene rules",
      "Campaign calendar with written and designed sends",
      "Monthly report on revenue per send and per subscriber",
    ],
    notIncluded: [
      "Purchased or scraped contact lists — we will not send to them",
      "Platform subscription fees, billed to your account",
      "Sending without a documented opt-in basis",
    ],
  },
  {
    slug: "graphic-design",
    pathway: "tell",
    name: "Graphic Design",
    teaser: "Identity and creative that stays consistent.",
    headline: "A system, not a folder of files.",
    lead: "One-off designs drift within a quarter. We build the identity and the reusable system underneath it, so the twentieth asset looks like it came from the same company as the first.",
    subServices: [
      "Brand Identity",
      "Ad Creative",
      "Social Templates",
      "Print & Collateral",
      "Pitch & Proposal Decks",
    ],
    features: [
      {
        title: "Rationale, in writing.",
        body: "Every direction comes with the reasoning — audience, context, the job the piece has to do. It turns review from a matter of taste into a matter of fit.",
      },
      {
        title: "Accessible by default.",
        body: "Contrast ratios checked, type sized for real reading, never colour alone to carry meaning. Design that excludes people is design that failed.",
      },
      {
        title: "Tested at real size.",
        body: "Proofed on a phone, in a feed, and at print scale before approval. Work that only looks right zoomed to full screen in a design tool is not finished.",
      },
      {
        title: "Source files, organised and yours.",
        body: "Layered, named, with licensed fonts and assets listed. Handover means you can actually use it without coming back to us.",
      },
    ],
    deliverables: [
      "Logo with variants and clear-space rules",
      "Colour palette and type scale with usage guide",
      "Reusable templates for social, deck and document",
      "Licensed font and asset list",
      "Organised source files in a format you can edit",
    ],
    notIncluded: [
      "Unlimited revision rounds — two are included, more are quoted",
      "Font and stock asset licences, purchased in your name",
      "Trademark search or registration",
    ],
  },
  {
    slug: "video-editing",
    pathway: "tell",
    name: "Video Editing",
    teaser: "Product video, social cuts and motion.",
    headline: "The first three seconds decide the rest.",
    lead: "Most business video fails at the hook, not the edit. We cut for retention — multiple openings tested against each other, captions burned in, sized properly for where it actually plays.",
    subServices: [
      "Product Video",
      "Social Cuts & Reels",
      "Motion Graphics",
      "Testimonial & Case Video",
      "Ad Creative Editing",
    ],
    features: [
      {
        title: "Multiple hooks per cut.",
        body: "The same body of footage ships with several openings so you can test which one holds attention rather than guessing once and living with it.",
      },
      {
        title: "Captions, always.",
        body: "The overwhelming majority of feed video is watched muted. Burned-in captions are not an accessibility afterthought — they are the difference between watched and scrolled.",
      },
      {
        title: "Cut per platform.",
        body: "Vertical, square and landscape versions with the safe zones respected, so the subject is never behind a username or a progress bar.",
      },
      {
        title: "Measured on retention.",
        body: "We report the drop-off curve and the commercial response, not the view count. Views tell you the thumbnail worked and nothing else.",
      },
    ],
    deliverables: [
      "Edited master plus platform-specific cuts",
      "Multiple hook variants for testing",
      "Burned-in captions and licensed music",
      "Motion graphics, lower thirds and end cards",
      "Organised project files on request",
    ],
    notIncluded: [
      "Filming and on-site production, unless scoped separately",
      "Music and stock licences, purchased in your name",
      "Unlimited revisions — two rounds are included",
    ],
  },
];

/* ─── Homepage ────────────────────────────────────────────────────────────── */

export const home = {
  /** Block 1 — outcome headline. */
  hero: {
    /** Rendered in mid-grey serif, sitting under the ambient light. */
    headline: ["We make good", "businesses obvious"],
    lead: brandLead(),
    /**
     * MetaLab's floating chips, repurposed as real links: capability, not
     * client logos — we have none yet. Each pairs a short label with the
     * service it stands for, so hovering can drive a live preview and the
     * chip itself is a genuine link, not a decorative tag.
     */
    chips: [
      { label: "Software", slug: "software-development" },
      { label: "Automation", slug: "ai-automation" },
      { label: "SEO", slug: "business-marketing" },
      { label: "Paid Ads", slug: "product-ads" },
      { label: "Social", slug: "social-media-marketing" },
      { label: "Email", slug: "email-sms" },
      { label: "Design", slug: "graphic-design" },
      { label: "Video", slug: "video-editing" },
    ],
  },

  /** Block 2 — target buyer. */
  audience: {
    eyebrow: "Who this is for",
    headline: "Businesses past the scrappy stage.",
    lead: "You have customers, revenue and a process that works. What you do not have is the capacity to build the systems that would let it work at three times the size.",
    points: [
      {
        title: "Between five and fifty people.",
        body: "Large enough that manual process is genuinely expensive. Small enough that one good system changes the whole quarter.",
      },
      {
        title: "One decision-maker we can reach.",
        body: "We work best where the person who owns the outcome is in the room. Committee-driven procurement is not where we are strongest.",
      },
      {
        title: "A problem with a number attached.",
        body: "Hours lost, leads unconverted, spend unaccounted for. If the constraint cannot be measured, the result cannot be either.",
      },
    ],
  },

  /** Block 3 — the costly problems. */
  problems: {
    eyebrow: "The constraint",
    headline: "It's rarely a lack of effort.",
    lead: "Every business we take on is already working hard. The drag is almost always structural — and structural problems do not respond to working harder.",
    items: [
      {
        stat: "Manual",
        title: "The process only exists in someone's head.",
        body: "It cannot be delegated, cannot be measured, and stops entirely when that person is unavailable.",
      },
      {
        stat: "Untracked",
        title: "Nobody can say which spend produced which sale.",
        body: "So budget gets set by feel, and the channel that actually works is the one that quietly gets cut.",
      },
      {
        stat: "Inconsistent",
        title: "The presentation undersells the product.",
        body: "Buyers make a competence judgement in seconds, and good work loses to well-presented work more often than anyone admits.",
      },
    ],
  },

  /** Block 4 — the named system. */
  method: {
    eyebrow: "The method",
    headline: "Bearing, Chart, Crew, Log.",
    lead: "One engagement runs the same way every time. It is named so you can hold us to it, and it exists so nothing important depends on anyone remembering to do it.",
    steps: [
      {
        index: "01",
        name: "Bearing",
        body: "A paid diagnostic. We map the current process, measure the baseline and identify the single most expensive constraint. You leave with the findings whether or not you continue with us.",
      },
      {
        index: "02",
        name: "Chart",
        body: "The plan. Scope, exclusions, timeline, dependencies and how success will be measured — written down before anything is built, so scope stops being a conversation.",
      },
      {
        index: "03",
        name: "Crew",
        body: "The build. Weekly updates with evidence, not status. Blockers surface the day they appear rather than the week before the deadline.",
      },
      {
        index: "04",
        name: "Log",
        body: "Handover and proof. Documentation, access transfer, the measured result against the baseline, and an honest account of what did and did not work.",
      },
    ],
  },

  /** Block 6 — business outcomes. */
  outcomes: {
    eyebrow: "What changes",
    headline: "Measured against where you started.",
    lead: "Every engagement opens with a baseline and closes against it. These are the categories we report in — never impressions, never followers.",
    stats: [
      { value: "Hours", label: "returned to the team each week" },
      { value: "Cost", label: "per qualified lead, tracked end to end" },
      { value: "Rate", label: "at which enquiries become booked work" },
      { value: "Margin", label: "on the work you already deliver" },
    ] as Stat[],
  },

  /** Block 10 — CTA. */
  cta: {
    eyebrow: "Start here",
    headline: "A diagnostic, not a sales call.",
    lead: "Thirty minutes to find out whether there's a fit. If there is, the next step is a paid diagnostic that gives you a measured baseline and a plan — yours to keep either way.",
  },
};

function brandLead() {
  return "Since 2026 we've helped operators design, build and ship the systems, campaigns and creative that make a competent business impossible to overlook.";
}

/* ─── Lookups ─────────────────────────────────────────────────────────────── */

export const servicesByPathway = (id: PathwayId) =>
  services.filter((s) => s.pathway === id);

export const getService = (slug: string) =>
  services.find((s) => s.slug === slug);

export const getPathway = (id: string) =>
  pathways.find((p) => p.id === id);
