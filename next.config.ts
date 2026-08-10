import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // The local preview is intentionally opened through 127.0.0.1 by Codex
  // and mobile devices. Without this, Next dev serves the HTML but blocks
  // its client chunks, leaving every interactive control unhydrated.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
