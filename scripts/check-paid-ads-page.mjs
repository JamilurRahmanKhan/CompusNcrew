import { statSync } from "node:fs";
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
    return statSync(resolve(projectRoot, "public", "paid-ads", asset)).size === 0;
  } catch {
    return true;
  }
});

if (missing.length > 0) {
  console.error(`Missing or empty paid ads assets: ${missing.join(", ")}`);
  process.exitCode = 1;
} else {
  console.log("Paid ads page assets are present.");
}
