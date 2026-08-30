import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const baseUrl = "http://127.0.0.1:3151/services/graphic-design";
const evidenceDir = new URL("./", import.meta.url);
const edgePath = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const evidencePath = (name) => fileURLToPath(new URL(name, evidenceDir));

await mkdir(evidenceDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: edgePath,
  headless: true,
  args: ["--use-angle=swiftshader"],
});

const report = {
  generatedAt: new Date().toISOString(),
  help: {},
  textureLifecycle: {},
  runtimeFailure: {},
  skipLink: {},
};

function trackRuntime(page) {
  const pageErrors = [];
  const consoleMessages = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => {
    if (["warning", "error"].includes(message.type())) {
      consoleMessages.push({ type: message.type(), text: message.text() });
    }
  });
  return { pageErrors, consoleMessages };
}

function boxesOverlap(first, second) {
  if (!first || !second) return false;
  return first.left < second.right
    && first.right > second.left
    && first.top < second.bottom
    && first.bottom > second.top;
}

async function inspectHelp(page) {
  return page.evaluate(() => {
    const button = document.querySelector('button[aria-controls="gallery-controls-guide"]');
    const guide = document.getElementById("gallery-controls-guide");
    const keyboard = guide?.querySelector("div:first-child");
    const touch = guide?.querySelector("div:last-child");
    const joystick = document.querySelector('[aria-label="Move around the design gallery"]');
    const action = [...document.querySelectorAll("button")]
      .find((candidate) => /Explore gallery|View work/.test(candidate.textContent ?? ""));
    const rect = (element) => {
      if (!element) return null;
      const value = element.getBoundingClientRect();
      return {
        left: value.left,
        right: value.right,
        top: value.top,
        bottom: value.bottom,
        width: value.width,
        height: value.height,
      };
    };

    return {
      viewport: {
        width: innerWidth,
        height: innerHeight,
        dpr: devicePixelRatio,
        pointerCoarse: matchMedia("(pointer: coarse)").matches,
        pointerFine: matchMedia("(pointer: fine)").matches,
      },
      overflowX: document.documentElement.scrollWidth - innerWidth,
      button: button ? {
        label: button.getAttribute("aria-label"),
        controls: button.getAttribute("aria-controls"),
        expanded: button.getAttribute("aria-expanded"),
        rect: rect(button),
      } : null,
      guide: guide ? {
        hidden: guide.hidden,
        visible: Boolean(guide.getClientRects().length && guide.getBoundingClientRect().width),
        text: guide.innerText.replace(/\s+/g, " ").trim(),
        fontSize: getComputedStyle(guide).fontSize,
        lineHeight: getComputedStyle(guide).lineHeight,
        rect: rect(guide),
        keyboardDisplay: keyboard ? getComputedStyle(keyboard).display : null,
        touchDisplay: touch ? getComputedStyle(touch).display : null,
      } : null,
      joystickRect: rect(joystick),
      actionRect: rect(action),
    };
  });
}

async function verifyHelp(name, options, expectedMode) {
  const context = await browser.newContext(options);
  const page = await context.newPage();
  const runtime = trackRuntime(page);
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  const button = page.locator('button[aria-controls="gallery-controls-guide"]');
  await button.waitFor({ state: "visible" });
  const visible = await inspectHelp(page);

  assert.equal(visible.button?.controls, "gallery-controls-guide");
  assert.equal(visible.button?.expanded, "true");
  assert.equal(visible.guide?.visible, true);
  assert.equal(visible.overflowX, 0);
  assert.equal(boxesOverlap(visible.guide?.rect, visible.button?.rect), false);
  assert.equal(boxesOverlap(visible.guide?.rect, visible.joystickRect), false);
  assert.equal(boxesOverlap(visible.guide?.rect, visible.actionRect), false);
  if (expectedMode === "touch") {
    assert.equal(visible.viewport.pointerCoarse, true);
    assert.equal(visible.guide?.keyboardDisplay, "none");
    assert.notEqual(visible.guide?.touchDisplay, "none");
    assert.match(visible.guide?.text ?? "", /Drag the joystick to move/i);
    assert.match(visible.guide?.text ?? "", /Tap View work when a project is near/i);
  } else {
    assert.equal(visible.viewport.pointerFine, true);
    assert.notEqual(visible.guide?.keyboardDisplay, "none");
    assert.equal(visible.guide?.touchDisplay, "none");
    assert.match(visible.guide?.text ?? "", /WASD/);
  }

  await button.click();
  const collapsed = await page.evaluate(() => {
    const button = document.querySelector('button[aria-controls="gallery-controls-guide"]');
    const guide = document.getElementById("gallery-controls-guide");
    return {
      label: button?.getAttribute("aria-label"),
      expanded: button?.getAttribute("aria-expanded"),
      activeElementIsButton: document.activeElement === button,
      guideHidden: guide?.hidden,
      guideVisible: Boolean(guide?.getClientRects().length),
    };
  });
  assert.deepEqual(collapsed, {
    label: "Show gallery controls",
    expanded: "false",
    activeElementIsButton: true,
    guideHidden: true,
    guideVisible: false,
  });

  await button.click();
  await page.screenshot({
    path: evidencePath(`help-${name}.png`),
    fullPage: false,
  });
  report.help[name] = { visible, collapsed, runtime };
  assert.deepEqual(runtime.pageErrors, []);
  await context.close();
}

await verifyHelp(
  "390x844-touch",
  { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true },
  "touch",
);
await verifyHelp(
  "768x1024-touch",
  { viewport: { width: 768, height: 1024 }, hasTouch: true, isMobile: true },
  "touch",
);
await verifyHelp(
  "200-percent-equivalent-720x450",
  { viewport: { width: 720, height: 450 }, deviceScaleFactor: 2 },
  "keyboard",
);

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  let releaseTextures;
  const textureGate = new Promise((resolve) => {
    releaseTextures = resolve;
  });
  let textureRequests = 0;
  await context.route("**/media/design-portfolio/*.png", async (route) => {
    textureRequests += 1;
    await textureGate;
    await route.continue();
  });
  const page = await context.newPage();
  const runtime = trackRuntime(page);
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.querySelectorAll("canvas").length === 1);
  await page.waitForFunction(() => performance.getEntriesByName("/media/design-portfolio/coffee-campaign.png").length > 0 || document.querySelector('[role="status"]'));
  for (let attempt = 0; attempt < 40 && textureRequests < 4; attempt += 1) {
    await page.waitForTimeout(50);
  }
  assert.equal(textureRequests, 4);
  const pending = await page.evaluate(() => {
    const loading = document.querySelector('[role="status"]');
    return {
      loadingDataHidden: loading?.getAttribute("data-hidden"),
      loadingVisibility: loading ? getComputedStyle(loading).visibility : null,
      helpButtonCount: document.querySelectorAll('button[aria-controls="gallery-controls-guide"]').length,
      canvasCount: document.querySelectorAll("canvas").length,
    };
  });
  assert.deepEqual(pending, {
    loadingDataHidden: "false",
    loadingVisibility: "visible",
    helpButtonCount: 0,
    canvasCount: 1,
  });
  await page.screenshot({ path: evidencePath("textures-pending.png") });

  releaseTextures();
  await page.locator('button[aria-controls="gallery-controls-guide"]').waitFor({ state: "visible" });
  const ready = await page.evaluate(() => ({
    loadingDataHidden: document.querySelector('[role="status"]')?.getAttribute("data-hidden"),
    guideVisible: Boolean(document.getElementById("gallery-controls-guide")?.getClientRects().length),
    canvasCount: document.querySelectorAll("canvas").length,
  }));
  assert.deepEqual(ready, {
    loadingDataHidden: "true",
    guideVisible: true,
    canvasCount: 1,
  });
  await page.screenshot({ path: evidencePath("textures-ready.png") });
  assert.deepEqual(runtime.pageErrors, []);
  report.textureLifecycle.delayedSuccess = { textureRequests, pending, ready, runtime };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.route("**/media/design-portfolio/coffee-campaign.png", (route) => route.abort("failed"));
  const page = await context.newPage();
  const runtime = trackRuntime(page);
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.locator("#gallery-fallback").waitFor({ state: "visible" });
  const fallback = await page.evaluate(() => ({
    fallbackCount: document.querySelectorAll("#gallery-fallback").length,
    canvasCount: document.querySelectorAll("canvas").length,
    activeProjectCount: document.querySelectorAll("#gallery-fallback article").length,
  }));
  assert.deepEqual(fallback, { fallbackCount: 1, canvasCount: 0, activeProjectCount: 4 });
  await page.screenshot({ path: evidencePath("texture-error-fallback.png") });
  assert.deepEqual(runtime.pageErrors, []);
  report.textureLifecycle.rejectedTexture = { fallback, runtime };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const runtime = trackRuntime(page);
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.locator('button[aria-controls="gallery-controls-guide"]').waitFor({ state: "visible" });
  const extensionAvailable = await page.evaluate(() => {
    const canvas = document.querySelector("canvas");
    const context = canvas?.getContext("webgl2") ?? canvas?.getContext("webgl");
    const extension = context?.getExtension("WEBGL_lose_context");
    extension?.loseContext();
    return Boolean(extension);
  });
  assert.equal(extensionAvailable, true);
  await page.locator("#gallery-fallback").waitFor({ state: "visible" });
  const fallback = await page.evaluate(() => ({
    fallbackCount: document.querySelectorAll("#gallery-fallback").length,
    canvasCount: document.querySelectorAll("canvas").length,
    projectCount: document.querySelectorAll("#gallery-fallback article").length,
  }));
  assert.deepEqual(fallback, { fallbackCount: 1, canvasCount: 0, projectCount: 4 });
  await page.screenshot({ path: evidencePath("runtime-context-loss-fallback.png") });
  assert.deepEqual(runtime.pageErrors, []);
  report.runtimeFailure.contextLoss = { extensionAvailable, fallback, runtime };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const runtime = trackRuntime(page);
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.locator('button[aria-controls="gallery-controls-guide"]').waitFor({ state: "visible" });
  const trace = [];
  let focused = false;
  for (let index = 0; index < 100; index += 1) {
    await page.keyboard.press("Tab");
    const state = await page.evaluate(() => {
      const active = document.activeElement;
      const bounds = active instanceof HTMLElement ? active.getBoundingClientRect() : null;
      return {
        tag: active?.tagName ?? null,
        text: (active?.textContent ?? "").replace(/\s+/g, " ").trim(),
        href: active instanceof HTMLAnchorElement ? active.getAttribute("href") : null,
        focusVisible: active instanceof Element ? active.matches(":focus-visible") : false,
        rect: bounds ? {
          x: bounds.x,
          y: bounds.y,
          width: bounds.width,
          height: bounds.height,
        } : null,
      };
    });
    trace.push(state);
    if (state.text === "Skip the 3D gallery") {
      focused = true;
      break;
    }
  }
  assert.equal(focused, true);
  const focusState = trace.at(-1);
  assert.equal(focusState.focusVisible, true);
  assert.ok(focusState.rect?.width > 0 && focusState.rect?.height > 0);
  assert.ok(focusState.rect.x >= 0 && focusState.rect.y >= 0);
  await page.screenshot({ path: evidencePath("skip-3d-focused-native.png") });

  await page.keyboard.press("Enter");
  await page.locator("#gallery-fallback").waitFor({ state: "visible" });
  await page.waitForFunction(() => document.activeElement?.id === "gallery-fallback");
  const activation = await page.evaluate(() => ({
    activeElementId: document.activeElement?.id ?? null,
    activeElementTag: document.activeElement?.tagName ?? null,
    fallbackTabIndex: document.getElementById("gallery-fallback")?.getAttribute("tabindex"),
    canvasCount: document.querySelectorAll("canvas").length,
    projectCount: document.querySelectorAll("#gallery-fallback article").length,
  }));
  assert.deepEqual(activation, {
    activeElementId: "gallery-fallback",
    activeElementTag: "SECTION",
    fallbackTabIndex: "-1",
    canvasCount: 0,
    projectCount: 4,
  });
  await page.screenshot({ path: evidencePath("skip-3d-activated-native.png") });
  assert.deepEqual(runtime.pageErrors, []);
  report.skipLink = { trace, activation, runtime };
  await context.close();
}

await writeFile(
  new URL("browser-verification.json", evidenceDir),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();

console.log(JSON.stringify({
  help: Object.keys(report.help),
  textureLifecycle: Object.keys(report.textureLifecycle),
  runtimeFailure: Object.keys(report.runtimeFailure),
  skipLink: report.skipLink.activation,
}, null, 2));
