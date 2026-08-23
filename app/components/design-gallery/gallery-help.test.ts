import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import * as galleryHelpModule from "./gallery-help";

const classNames = {
  guide: "guide",
  group: "group",
  keyboard: "keyboard",
  touch: "touch",
  button: "button",
};

test("GalleryHelp renders an accessible expanded disclosure with keyboard and touch instructions", () => {
  const GalleryHelp = (
    galleryHelpModule as unknown as { GalleryHelp?: typeof galleryHelpModule.GalleryHelp }
  ).GalleryHelp;
  assert.equal(typeof GalleryHelp, "function");
  if (!GalleryHelp) return;

  const markup = renderToStaticMarkup(createElement(GalleryHelp, {
    visible: true,
    classNames,
    onToggle() {},
  }));

  assert.match(markup, /aria-controls="gallery-controls-guide"/);
  assert.match(markup, /aria-expanded="true"/);
  assert.match(markup, /aria-label="Hide gallery controls"/);
  assert.match(markup, /id="gallery-controls-guide"/);
  assert.match(markup, /role="note"/);
  assert.doesNotMatch(markup, / hidden=""/);
  assert.match(markup, /WASD/);
  assert.match(markup, /Drag the joystick to move/);
  assert.match(markup, /Tap View work when a project is near/);
});

test("GalleryHelp keeps the guide mounted but hidden when collapsed", () => {
  const GalleryHelp = galleryHelpModule.GalleryHelp;
  const markup = renderToStaticMarkup(createElement(GalleryHelp, {
    visible: false,
    classNames,
    onToggle() {},
  }));

  assert.match(markup, /aria-expanded="false"/);
  assert.match(markup, /aria-label="Show gallery controls"/);
  assert.match(markup, /id="gallery-controls-guide"[^>]* hidden=""/);
});
