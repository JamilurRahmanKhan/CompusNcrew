import type { Metadata } from "next";
import { DesignGallery } from "../../components/design-gallery/design-gallery";

export const metadata: Metadata = {
  title: "Graphic design — Brand systems and creative direction",
  description:
    "Brand identity, campaign creative, social systems, print and presentation design built as one coherent visual language.",
  alternates: { canonical: "/graphic-design/portfolio" },
};

export default function GraphicDesignPortfolioPage() {
  return <DesignGallery />;
}
