import { readFileSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const assets = [
  "background-paid-ads.png",
  "ad-engine.gif",
  "google-ads-1.jpg",
  "google-ads-2.jpg",
  "google-ads-3.jpg",
  "meta-ads-1.jpg",
  "meta-ads-2.jpg",
  "meta-ads-3.jpg",
  "google-ads-logo.png",
  "google-logo.png",
  "meta-logo.png",
  "facebook-like-icon.png",
  "facebook-love-icon.png",
  "arrow-icon.png",
  "ad-engine-alpha.webm",
  "ad-engine-poster.png",
];

const missing = assets.filter((asset) => {
  try {
    const stats = statSync(resolve(projectRoot, "public", "paid-ads", asset));
    return !stats.isFile() || stats.size === 0;
  } catch {
    return true;
  }
});

const analyticsCardPath = resolve(projectRoot, "app", "paid-ads", "platform-performance-card.tsx");
const liveAdPreviewsPath = resolve(projectRoot, "app", "paid-ads", "live-ad-previews.tsx");
const paidAdsPageSources = [
  resolve(projectRoot, "app", "paid-ads", "page.tsx"),
  resolve(projectRoot, "app", "paid-ads", "paid-ads-studio.tsx"),
];

function readSource(sourcePath) {
  try {
    return readFileSync(sourcePath, "utf8");
  } catch {
    return "";
  }
}

const analyticsCardSource = readSource(analyticsCardPath);
const liveAdPreviewsSource = readSource(liveAdPreviewsPath);
const paidAdsPageSource = paidAdsPageSources.map(readSource).join("\n");
const structuralFailures = [
  !/<svg\b/.test(analyticsCardSource) && "Platform analytics must render an inline SVG trend chart.",
  !/performance\.metrics\.map\s*\(/.test(analyticsCardSource) && "Platform analytics must map typed performance metrics.",
  !/googleAdPreviews\.map\s*\(/.test(liveAdPreviewsSource) && "Live previews must render the Google preview group.",
  !/metaAdPreviews\.map\s*\(/.test(liveAdPreviewsSource) && "Live previews must render the Meta preview group.",
  !/visibilitychange/.test(liveAdPreviewsSource) && "Live previews must respond to document visibility changes.",
  !/prefers-reduced-motion:\s*reduce/.test(liveAdPreviewsSource) && "Live previews must honor reduced-motion preferences.",
  !/<video\b/.test(liveAdPreviewsSource) && "The paid ads engine must render as video.",
  !/<source\b[^>]*ad-engine-alpha\.webm/.test(liveAdPreviewsSource) && "The paid ads engine must use ad-engine-alpha.webm.",
  /paid-ads-ui\.jpg/.test(paidAdsPageSource) && "Paid ads page source must not use paid-ads-ui.jpg.",
].filter(Boolean);

function hasTransparentCorner(asset) {
  const decoder = asset.endsWith(".webm") ? ["-c:v", "libvpx-vp9"] : [];
  const result = spawnSync(
    "ffmpeg",
    ["-v", "error", ...decoder, "-i", resolve(projectRoot, "public", "paid-ads", asset), "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "rgba", "-"],
    { maxBuffer: 4 * 1024 * 1024 },
  );

  return result.status === 0 && result.stdout[3] < 32;
}

if (missing.length > 0) {
  console.error(`Missing or empty paid ads assets: ${missing.join(", ")}`);
  process.exitCode = 1;
} else if (structuralFailures.length > 0) {
  console.error(`Paid ads page structural check failed: ${structuralFailures.join(" ")}`);
  process.exitCode = 1;
} else if (!hasTransparentCorner("ad-engine-alpha.webm") || !hasTransparentCorner("ad-engine-poster.png")) {
  console.error("Paid ads engine outputs must retain a transparent top-left corner.");
  process.exitCode = 1;
} else {
  console.log("Paid ads page assets are present.");
}
