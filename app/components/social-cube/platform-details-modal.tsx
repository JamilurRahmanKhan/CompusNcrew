"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  X,
  Shield,
  ArrowRight,
  ChevronRight,
  Users,
  Users2,
  Play,
  PieChart,
  Target,
  Filter,
  MessageCircle,
  Megaphone,
  Mic,
  Lightbulb,
  Handshake,
  FileText,
  Briefcase,
  TrendingUp,
  LayoutGrid,
  ShoppingBag,
  Search,
  Compass,
  Zap,
  Flame,
  MessageSquare,
  Video,
  PenLine,
  Send,
  BarChart3,
  Layers,
  Clock,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { Platform } from "./social-cube-data";
import styles from "./platform-details-modal.module.css";

interface Stat {
  icon: LucideIcon;
  value: string;
  label: string;
}

interface WhatWeDoItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface PlatformDetail {
  badge: string;
  description: string;
  stats: readonly Stat[];
  whatWeDo: readonly WhatWeDoItem[];
  ctaSubtext: string;
}

const PLATFORM_DETAILS: Record<string, PlatformDetail> = {
  instagram: {
    badge: "Visual Storytelling Platform",
    description: "Inspire, engage, and grow with powerful visual content that connects and converts.",
    stats: [
      { icon: Users, value: "2.8B+", label: "Monthly Active Users" },
      { icon: Play, value: "500M+", label: "Daily Stories" },
      { icon: PieChart, value: "90%", label: "Follow Businesses" },
    ],
    whatWeDo: [
      { icon: LayoutGrid, title: "Content Strategy", description: "We craft scroll-stopping content that reflects your brand and speaks to your audience." },
      { icon: Video, title: "Reels Creation", description: "Short-form videos that boost reach, drive engagement, and build brand personality." },
      { icon: TrendingUp, title: "Brand Growth", description: "We grow your following with a strategy built around real audience behavior." },
      { icon: MessageCircle, title: "Community Management", description: "We engage with your audience, respond, and build real relationships that last." },
      { icon: Megaphone, title: "Paid Advertising", description: "ROI-focused ad campaigns that drive traffic, leads, and real business results." },
    ],
    ctaSubtext: "Let's build your brand's next big story.",
  },
  facebook: {
    badge: "Community & Commerce Platform",
    description: "Build loyal communities and turn engagement into customers on the world's largest social network.",
    stats: [
      { icon: Users, value: "2.9B+", label: "Monthly Active Users" },
      { icon: Users2, value: "10M+", label: "Active Groups" },
      { icon: Target, value: "62%", label: "Discover New Brands" },
    ],
    whatWeDo: [
      { icon: Target, title: "Campaign Planning", description: "Full-funnel campaigns aligned to real business goals, not just vanity metrics." },
      { icon: Users2, title: "Community Growth", description: "We build and grow groups that turn followers into an active, loyal community." },
      { icon: Filter, title: "Lead Generation", description: "Forms, funnels, and offers engineered to turn attention into qualified leads." },
      { icon: MessageCircle, title: "Audience Care", description: "Fast, on-brand responses that keep customers happy and coming back." },
      { icon: Megaphone, title: "Paid Advertising", description: "Precision-targeted ads that reach the right audience at the right moment." },
    ],
    ctaSubtext: "Let's turn your page into a community.",
  },
  linkedin: {
    badge: "Professional Authority Platform",
    description: "Establish real authority and generate demand with content built for decision-makers.",
    stats: [
      { icon: Briefcase, value: "1B+", label: "Professionals" },
      { icon: Users, value: "65M+", label: "Decision-Makers" },
      { icon: TrendingUp, value: "4x", label: "B2B Lead Quality" },
    ],
    whatWeDo: [
      { icon: Mic, title: "Executive Voice", description: "We ghostwrite thought leadership that builds your personal and company brand." },
      { icon: Lightbulb, title: "Thought Leadership", description: "Insight-driven content that positions you as the go-to voice in your industry." },
      { icon: Handshake, title: "Business Networking", description: "Strategic engagement that grows your network with the right people." },
      { icon: FileText, title: "Demand Content", description: "Content built to move prospects from aware to interested to booked." },
      { icon: Megaphone, title: "Paid Advertising", description: "Sponsored content and InMail campaigns built for B2B pipelines." },
    ],
    ctaSubtext: "Let's build your industry authority.",
  },
  pinterest: {
    badge: "Visual Discovery Platform",
    description: "Turn inspiration into intent — Pinterest users plan purchases months in advance.",
    stats: [
      { icon: Users, value: "500M+", label: "Monthly Users" },
      { icon: Search, value: "2B+", label: "Searches Monthly" },
      { icon: ShoppingBag, value: "89%", label: "Use Pinterest to Shop" },
    ],
    whatWeDo: [
      { icon: LayoutGrid, title: "Idea Boards", description: "Curated boards that place your brand inside your audience's planning process." },
      { icon: ShoppingBag, title: "Shoppable Pins", description: "Pins built to convert browsing into buying with direct shopping links." },
      { icon: Search, title: "Visual Search SEO", description: "Optimized pins that surface in search long after they're published." },
      { icon: Compass, title: "Trend Discovery", description: "We track emerging trends so your content leads, not follows." },
      { icon: Megaphone, title: "Paid Advertising", description: "Promoted pins that reach high-intent shoppers at the moment of inspiration." },
    ],
    ctaSubtext: "Let's turn inspiration into customers.",
  },
  twitter: {
    badge: "Real-Time Conversation Platform",
    description: "Join the conversation as it happens and build a brand voice people actually follow.",
    stats: [
      { icon: Users, value: "500M+", label: "Monthly Users" },
      { icon: MessageSquare, value: "500M+", label: "Daily Posts" },
      { icon: Zap, value: "2x", label: "Faster News Cycle" },
    ],
    whatWeDo: [
      { icon: Zap, title: "Real-Time Engagement", description: "We show up in the moments that matter, live and in real time." },
      { icon: Users2, title: "Community Building", description: "We grow a following that engages with your brand voice, not just your ads." },
      { icon: Flame, title: "Trend-Jacking", description: "Fast, on-brand takes on trending moments that earn organic reach." },
      { icon: MessageSquare, title: "Brand Voice", description: "A distinct, consistent voice that makes your brand recognizable in a crowded feed." },
      { icon: Megaphone, title: "Paid Advertising", description: "Targeted promotion that amplifies your best-performing organic content." },
    ],
    ctaSubtext: "Let's build a voice worth following.",
  },
};

const PLATFORM_ICONS: Record<string, string> = {
  instagram: "/media/social/instagram-icon.png",
  facebook: "/media/social/facebook-icon.png",
  linkedin: "/media/social/linkedin-icon.png",
  pinterest: "/media/social/pinterest-icon.png",
  twitter: "/media/social/x-twitter-icon.png",
};

const ECOSYSTEM_ACCENT = "#d9622b";

const ECOSYSTEM_DETAIL: PlatformDetail = {
  badge: "Complete Growth System",
  description: "One connected system across five platforms — built on a repeatable process, not five disconnected efforts.",
  stats: [
    { icon: Layers, value: "5", label: "Platforms Managed" },
    { icon: TrendingUp, value: "+250%", label: "Engagement Growth" },
    { icon: Clock, value: "24/7", label: "Optimization" },
  ],
  whatWeDo: [
    { icon: Search, title: "Find the story", description: "We discover what your audience cares about and where they spend their time." },
    { icon: PenLine, title: "Design the system", description: "We create a platform-native strategy tailored to your goals and audience behavior." },
    { icon: Send, title: "Create natively", description: "We produce thumb-stopping content that connects and drives engagement." },
    { icon: BarChart3, title: "Listen and learn", description: "We analyze, learn, and optimize to scale what works best." },
  ],
  ctaSubtext: "Let's create your digital success story.",
};

interface DetailContent {
  name: string;
  iconSrc: string | null;
  accent: string;
  badge: string;
  description: string;
  stats: readonly Stat[];
  sectionLabel: string;
  whatWeDo: readonly WhatWeDoItem[];
  ctaHeading: string;
  ctaSubtext: string;
}

function getDetailContent(platform: Platform | null): DetailContent | null {
  if (platform) {
    const detail = PLATFORM_DETAILS[platform.id];
    if (!detail) return null;
    return {
      name: platform.name,
      iconSrc: PLATFORM_ICONS[platform.id],
      accent: platform.color,
      badge: detail.badge,
      description: detail.description,
      stats: detail.stats,
      sectionLabel: "What We Do",
      whatWeDo: detail.whatWeDo,
      ctaHeading: `Ready to grow on ${platform.name}?`,
      ctaSubtext: detail.ctaSubtext,
    };
  }
  return {
    name: "Digital Success System",
    iconSrc: null,
    accent: ECOSYSTEM_ACCENT,
    badge: ECOSYSTEM_DETAIL.badge,
    description: ECOSYSTEM_DETAIL.description,
    stats: ECOSYSTEM_DETAIL.stats,
    sectionLabel: "How The Ecosystem Grows",
    whatWeDo: ECOSYSTEM_DETAIL.whatWeDo,
    ctaHeading: "Ready to grow your brand?",
    ctaSubtext: ECOSYSTEM_DETAIL.ctaSubtext,
  };
}

export function PlatformDetailsModal({
  platform,
  open,
  onClose,
}: {
  platform: Platform | null;
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const content = getDetailContent(platform);
  if (!content) return null;

  return (
    <div
      className={styles.backdrop}
      data-open={open || undefined}
      onClick={onClose}
      aria-hidden={!open}
    >
      <div
        className={styles.modal}
        style={{ "--platform-color": content.accent } as React.CSSProperties}
        role="dialog"
        aria-modal="true"
        aria-labelledby="platform-details-heading"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.dragHandle} aria-hidden="true" />
        <button className={styles.close} onClick={onClose} aria-label="Close details">
          <X size={18} />
        </button>

        <div className={styles.head}>
          {content.iconSrc ? (
            <img src={content.iconSrc} alt="" className={styles.headIcon} />
          ) : (
            <span className={`${styles.headIcon} ${styles.headIconFallback}`} aria-hidden="true">
              <Sparkles size={22} />
            </span>
          )}
          <div>
            <h2 id="platform-details-heading">{content.name}</h2>
            <span className={styles.badge}>{content.badge}</span>
          </div>
        </div>

        <p className={styles.description}>{content.description}</p>

        <div className={styles.stats}>
          {content.stats.map(({ icon: Icon, value, label }) => (
            <div key={label}>
              <Icon size={18} aria-hidden="true" />
              <b>{value}</b>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <div className={styles.whatWeDo}>
          <p className={styles.sectionLabel}>{content.sectionLabel}</p>
          <ul>
            {content.whatWeDo.map(({ icon: Icon, title, description }) => (
              <li key={title}>
                <span className={styles.itemIcon} aria-hidden="true">
                  <Icon size={16} />
                </span>
                <div>
                  <b>{title}</b>
                  <p>{description}</p>
                </div>
                <ChevronRight className={styles.itemChevron} size={18} aria-hidden="true" />
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.footerCta}>
          <div>
            <b>{content.ctaHeading}</b>
            <span>{content.ctaSubtext}</span>
          </div>
          <Link href="/contact">
            Start the story <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <p className={styles.footnote}>
          <Shield size={12} aria-hidden="true" /> Part of our Social Growth System
        </p>
      </div>
    </div>
  );
}
