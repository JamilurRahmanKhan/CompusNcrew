import type { Metadata } from "next";
import { SoftwarePortfolioShell } from "./software-portfolio-shell";

export const metadata: Metadata = {
  title: "Software portfolio",
  description:
    "Explore twenty CompassNCrew software projects through an interactive 3D road journey.",
};

export default function SoftwarePortfolioPage() {
  return <SoftwarePortfolioShell />;
}
