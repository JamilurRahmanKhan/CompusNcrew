import {
  BadgeCheck,
  Bell,
  Building2,
  CalendarCheck,
  CalendarClock,
  CalendarX2,
  Cog,
  FileWarning,
  Gauge,
  Handshake,
  HeartPulse,
  Landmark,
  Layers,
  Mail,
  MailCheck,
  Megaphone,
  Repeat2,
  Scale,
  Search,
  Sparkles,
  Stethoscope,
  ThumbsUp,
  TrendingUp,
  UserPlus,
  Users,
  UserX,
  Wrench,
  Zap,
} from "lucide-react";

/** Matches the source design's per-card icon accents exactly (full.png /
 * resources/PAGE-3.html tint-blue / tint-green / tint-orange / tint-purple /
 * tint-teal classes). */
export const tints = ["blue", "green", "orange", "purple", "teal"] as const;
export type Tint = (typeof tints)[number];

export const trustPoints = [
  { title: "Done For You", copy: "Setup & manage" },
  { title: "No Long-Term Contract", copy: "Cancel anytime" },
  { title: "30-Day Launch", copy: "Get results faster" },
] as const;

export const heroStats = [
  { value: "247", label: "Leads", tint: "blue" },
  { value: "+38", label: "Bookings", tint: "green" },
  { value: "71", label: "Reactivated", tint: "purple" },
] as const;

export const heroFlow = [
  { label: "New lead", icon: UserPlus },
  { label: "Instant response", icon: Zap },
  { label: "Follow-up", icon: Mail },
  { label: "Booking", icon: CalendarCheck },
  { label: "Appointment", icon: CalendarClock },
  { label: "Review", icon: ThumbsUp },
  { label: "Rebook", icon: Repeat2 },
] as const;

export const revenueLeaks = [
  {
    index: "01",
    icon: UserX,
    tint: "blue",
    title: "New Leads Going Cold",
    copy: "People inquire but don't get a quick response. They move on.",
  },
  {
    index: "02",
    icon: FileWarning,
    tint: "green",
    title: "Estimates Going Unaccepted",
    copy: "You send the quote. They say “I'll think about it.” Then silence.",
  },
  {
    index: "03",
    icon: Users,
    tint: "orange",
    title: "Old Customers Disappear",
    copy: "You have thousands of past customers. You never contact them again.",
  },
  {
    index: "04",
    icon: CalendarX2,
    tint: "purple",
    title: "No-Shows & Missed Appointments",
    copy: "They book but forget. Your time and money are wasted.",
  },
  {
    index: "05",
    icon: Repeat2,
    tint: "red",
    title: "Customers Buy Once & Never Return",
    copy: "No system to follow up, upsell or bring them back for more.",
  },
] as const;

export const emailServices = [
  {
    index: "01",
    icon: MailCheck,
    title: "Lead Nurturing",
    copy: "Turn new inquiries into booked appointments.",
  },
  {
    index: "02",
    icon: Repeat2,
    title: "Missed Lead Recovery",
    copy: "Follow up with prospects who didn't respond.",
  },
  {
    index: "03",
    icon: CalendarCheck,
    title: "Appointment Automation",
    copy: "Confirm, remind & reduce no-shows automatically.",
  },
  {
    index: "04",
    icon: FileWarning,
    title: "Estimate Follow-Up",
    copy: "Recover unclosed quotes and turn “maybe” into “yes.”",
  },
  {
    index: "05",
    icon: Sparkles,
    title: "Cold Email Outreach",
    copy: "Generate new B2B opportunities & book more calls.",
  },
  {
    index: "06",
    icon: UserPlus,
    title: "Customer Reactivation",
    copy: "Bring inactive customers back with targeted campaigns.",
  },
  {
    index: "07",
    icon: ThumbsUp,
    title: "Review Generation",
    copy: "Automatically request reviews after a great experience.",
  },
  {
    index: "08",
    icon: Handshake,
    title: "Referral Campaigns",
    copy: "Turn happy customers into referral sources.",
  },
  {
    index: "09",
    icon: TrendingUp,
    title: "Upsell & Cross-Sell",
    copy: "Increase lifetime value with smart follow-up & offers.",
  },
  {
    index: "10",
    icon: Megaphone,
    title: "Email Campaign Management",
    copy: "Newsletters, promo, seasonal offers & monthly campaigns.",
  },
] as const;

export const industries = [
  { icon: Stethoscope, label: "Dentists" },
  { icon: Sparkles, label: "Med Spas" },
  { icon: BadgeCheck, label: "Chiropractors" },
  { icon: Wrench, label: "Home Services" },
  { icon: Scale, label: "Law Firms" },
  { icon: Building2, label: "Real Estate" },
  { icon: HeartPulse, label: "Private Clinics" },
  { icon: Landmark, label: "Accountants" },
  { icon: Megaphone, label: "Marketing Agencies" },
] as const;

export const timeline = [
  { time: "10:02 AM", icon: Mail, copy: "Lead submits form on your website." },
  { time: "10:02 AM", icon: MailCheck, copy: "Instant confirmation email sent." },
  { time: "10:15 AM", icon: Bell, copy: "Your team gets a lead notification." },
  { time: "Day 1", icon: Mail, copy: "Follow-up #1 — “Just checking in…”" },
  { time: "Day 3", icon: Mail, copy: "Follow-up #2 — “Have any questions?”" },
  { time: "Day 7", icon: Mail, copy: "Follow-up #3 — “Still considering?”" },
  { time: "Day 14", icon: Mail, copy: "Final follow-up — “We're here to help.”" },
  { time: "Outcome", icon: CalendarCheck, copy: "Conversation → Estimate → Booking" },
] as const;

export const beforeAfter = {
  before: [
    "Leads sit unanswered",
    "Estimates go cold",
    "Customers disappear",
    "No-shows pile up",
    "Manual follow-ups",
    "Inconsistent communication",
    "Lost customer data",
    "Team spends hours chasing people",
  ],
  after: [
    "Instant lead response",
    "Estimate follow-up system",
    "Customers reactivated",
    "Fewer no-shows",
    "Automated workflows",
    "Targeted campaigns",
    "Organized CRM",
    "System works 24/7 for you",
  ],
} as const;

export const process = [
  {
    index: "01",
    icon: Search,
    tint: "blue",
    title: "Audit",
    copy: "We analyze your leads, CRM, follow-up process and identify where revenue is leaking.",
  },
  {
    index: "02",
    icon: Layers,
    tint: "green",
    title: "Strategy",
    copy: "We create a custom automation plan and strategy for your business.",
  },
  {
    index: "03",
    icon: Cog,
    tint: "orange",
    title: "Build",
    copy: "We build your automations, email sequences, CRM integrations and campaigns.",
  },
  {
    index: "04",
    icon: Gauge,
    tint: "purple",
    title: "Optimize",
    copy: "We monitor performance, test, improve and scale your results month after month.",
  },
] as const;

export const realResults = [
  {
    title: "HVAC Company",
    metrics: [
      { num: "89", label: "Unclosed Estimates" },
      { num: "23", label: "New Conversations Generated" },
    ],
    rate: "+25.8% Recovery Rate",
  },
  {
    title: "Dental Practice",
    metrics: [
      { num: "312", label: "Inactive Patients" },
      { num: "47", label: "Patients Re-Engaged" },
    ],
    rate: "+15.1% Reactivation Rate",
  },
] as const;

export const platforms = [
  "HubSpot",
  "HighLevel",
  "ActiveCampaign",
  "Mailchimp",
  "Brevo",
  "Zapier",
  "Calendly",
  "Google Workspace",
] as const;

export const faqs = [
  {
    q: "Will you replace our CRM or email platform?",
    a: "No — we plug into the CRM and email tools you already use and automate on top of them, so nothing you rely on today gets replaced.",
  },
  {
    q: "Do you write the emails and set everything up?",
    a: "Yes. Our team writes the copy, builds the automations, and configures every step end-to-end — it's fully done-for-you.",
  },
  {
    q: "Do I need a large email list to get started?",
    a: "Not at all. The system is built to grow your list and convert new leads from day one, whether you're starting from zero or already have contacts.",
  },
  {
    q: "Do you handle SMS and multi-channel too?",
    a: "Yes — email, SMS, and other channels are coordinated together so follow-ups reach people wherever they respond best.",
  },
  {
    q: "How long does setup take?",
    a: "Most systems are fully built and live within 1–2 weeks, depending on how many workflows and channels you need.",
  },
] as const;
