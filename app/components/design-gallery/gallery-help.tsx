"use client";

import { getGalleryHelpDisclosure } from "./gallery-ui-utils";

export interface GalleryHelpClassNames {
  guide: string;
  group: string;
  keyboard: string;
  touch: string;
  button: string;
}

export interface GalleryHelpProps {
  visible: boolean;
  classNames: GalleryHelpClassNames;
  onToggle: () => void;
}

export function GalleryHelp({ visible, classNames, onToggle }: GalleryHelpProps) {
  const disclosure = getGalleryHelpDisclosure(visible);

  return (
    <>
      <div
        className={classNames.guide}
        id={disclosure.guideId}
        role="note"
        aria-label="Gallery controls"
        hidden={disclosure.guideHidden}
      >
        <div className={`${classNames.group} ${classNames.keyboard}`}>
          <span><kbd>↑</kbd><kbd>↓</kbd><kbd>←</kbd><kbd>→</kbd> to move</span>
          <span><kbd>Enter</kbd> to view work</span>
        </div>
        <div className={`${classNames.group} ${classNames.touch}`}>
          <span>Drag the joystick to move</span>
          <span>Tap View work when a project is near</span>
        </div>
      </div>

      <button
        className={classNames.button}
        type="button"
        aria-label={disclosure.buttonLabel}
        aria-controls={disclosure.guideId}
        aria-expanded={disclosure.expanded}
        onClick={onToggle}
      >
        ?
      </button>
    </>
  );
}
