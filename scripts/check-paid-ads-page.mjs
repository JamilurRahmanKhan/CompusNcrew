import { statSync } from "node:fs";
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
} else if (!hasTransparentCorner("ad-engine-alpha.webm") || !hasTransparentCorner("ad-engine-poster.png")) {
  console.error("Paid ads engine outputs must retain a transparent top-left corner.");
  process.exitCode = 1;
} else {
  console.log("Paid ads page assets are present.");
}
