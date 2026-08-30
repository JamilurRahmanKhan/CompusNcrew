import type { MetadataRoute } from "next";
import { brand } from "./brand";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${brand.domain}/sitemap.xml`,
  };
}
