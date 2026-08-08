import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import { brand } from "./brand";
import { SiteFooter } from "./components/site-footer";
import { SiteNav } from "./components/site-nav";
import "./globals.css";

/**
 * PP Eiko and Basis Grotesque Pro — the two faces MetaLab actually uses — are
 * commercially licensed. Instrument Serif is the closest free equivalent to
 * Eiko's high stroke contrast and thin weight; Inter covers what Basis and
 * SF Pro Text do on the reference sites.
 *
 * next/font downloads and self-hosts these at build time, so there is no
 * runtime request to Google and no layout shift.
 */
const display = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-serif",
});

const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(brand.domain),
  title: {
    default: `${brand.name} — ${brand.descriptor}`,
    template: `%s — ${brand.name}`,
  },
  description: brand.positioning,
  openGraph: {
    type: "website",
    siteName: brand.name,
    title: `${brand.name} — ${brand.descriptor}`,
    description: brand.positioning,
    url: brand.domain,
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} — ${brand.descriptor}`,
    description: brand.positioning,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteNav />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
