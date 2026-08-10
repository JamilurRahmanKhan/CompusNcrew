import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const [html, main, world, data] = await Promise.all([
  readFile(resolve(root, "index.html"), "utf8"), readFile(resolve(root, "src/main.js"), "utf8"),
  readFile(resolve(root, "src/world.js"), "utf8"), readFile(resolve(root, "src/data.js"), "utf8"),
]);
const checks = [
  [html.includes('id="start-button"'), "start control"], [html.includes('id="world"'), "3D canvas"],
  [main.includes("keydown"), "keyboard controls"], [world.includes("pointerdown"), "pointer controls"],
  [world.includes("touchmove"), "pinch controls"], [world.includes("stageEdges"), "multi-branch execution"],
  [world.includes("getViewDistance") && world.includes("ResizeObserver"), "aspect-ratio-aware responsive camera"],
  [world.includes("packetCount") && world.includes("AdditiveBlending"), "visible multi-packet light system"],
  [(data.match(/id: "/g) || []).length >= 20, "workflow stages and nodes"], [data.includes("Human Approval"), "human approval gate"],
  [data.includes("Instagram") && data.includes("LinkedIn") && data.includes("Facebook"), "social channel branches"],
  [data.includes("Campaign Results") && html.includes('id="result-panel"'), "campaign output experience"],
];
const failed = checks.filter(([ok]) => !ok);
if (failed.length) { console.error(`Automation checks failed: ${failed.map(([,name]) => name).join(", ")}`); process.exit(1); }
console.log("Automation workflow checks passed.");
