import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";

const componentPath = "app/components/social-video-hero/social-video-hero.tsx";
const stylesheetPath = "app/components/social-video-hero/social-video-hero.module.css";
const pagePath = "app/services/social-media-marketing/page.tsx";
const navPath = "app/components/site-nav.tsx";
const videoPath = "public/media/social/social-edited.mp4";

assert.ok(existsSync(componentPath), "social video hero component should exist");
assert.ok(existsSync(stylesheetPath), "social video hero stylesheet should exist");
assert.ok(existsSync(videoPath), "social hero video should exist in public media");
assert.ok(statSync(videoPath).size > 1_000_000, "social hero video should not be an empty placeholder");
assert.ok(statSync(videoPath).size < 100_000_000, "social hero video should be optimized for normal web delivery");

const component = readFileSync(componentPath, "utf8");
assert.match(component, /<video/);
assert.match(component, /autoPlay/);
assert.match(component, /muted/);
assert.match(component, /loop/);
assert.match(component, /playsInline/);
assert.match(component, /preload="auto"/);
assert.match(component, /\.play\(\)/);
assert.doesNotMatch(component, /<h[1-6]|<p|<button|<a\s|<Link/);

const stylesheet = readFileSync(stylesheetPath, "utf8");
assert.match(stylesheet, /100svh/);
assert.match(stylesheet, /object-fit:\s*cover/);
assert.match(stylesheet, /object-position:\s*center/);

const page = readFileSync(pagePath, "utf8");
assert.ok(page.indexOf("<SocialVideoHero") < page.indexOf("<SocialUniverse"), "video hero should precede existing social content");

const nav = readFileSync(navPath, "utf8");
assert.match(nav, /socialHeroVisible/);
assert.match(nav, /aria-hidden=\{socialHeroVisible/);
assert.match(nav, /inert=\{socialHeroVisible/);

console.log("Social video hero contract passed.");
