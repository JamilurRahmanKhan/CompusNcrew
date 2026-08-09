import type { MetadataRoute } from "next";
import { brand } from "./brand";
import { pathways, services } from "./content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (path: string) => `${brand.domain}${path}`;

  return [
    { url: url("/"), lastModified: now, priority: 1 },
    { url: url("/method"), lastModified: now, priority: 0.8 },
    { url: url("/work"), lastModified: now, priority: 0.7 },
    { url: url("/software-portfolio"), lastModified: now, priority: 0.8 },
    { url: url("/about"), lastModified: now, priority: 0.6 },
    { url: url("/contact"), lastModified: now, priority: 0.9 },
    ...pathways.map((p) => ({
      url: url(`/solutions/${p.id}`),
      lastModified: now,
      priority: 0.8,
    })),
    ...services.map((s) => ({
      url: url(`/services/${s.slug}`),
      lastModified: now,
      priority: 0.9,
    })),
    { url: url("/privacy"), lastModified: now, priority: 0.2 },
    { url: url("/terms"), lastModified: now, priority: 0.2 },
  ];
}
