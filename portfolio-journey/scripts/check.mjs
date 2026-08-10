import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const required = ['index.html', 'styles.css', 'src/main.js', 'src/world.js', 'src/data.js'];
for (const file of required) await access(resolve(root, file));

const html = await readFile(resolve(root, 'index.html'), 'utf8');
const css = await readFile(resolve(root, 'styles.css'), 'utf8');
const main = await readFile(resolve(root, 'src/main.js'), 'utf8');
const world = await readFile(resolve(root, 'src/world.js'), 'utf8');
const data = await readFile(resolve(root, 'src/data.js'), 'utf8');
const hostRoot = resolve(root, '..');
const softwareCard = await readFile(resolve(hostRoot, 'app/components/service-cards/software-development.tsx'), 'utf8');
const journeyShell = await readFile(resolve(hostRoot, 'app/software-portfolio/software-portfolio-shell.tsx'), 'utf8');

const checks = [
  ['semantic main fallback', html.includes('id="project-index"')],
  ['accessible skip link', html.includes('class="skip-link"')],
  ['keyboard controls', main.includes('ArrowUp') && main.includes('KeyW')],
  ['touch controls', html.includes('data-control="forward"')],
  ['touch long-press protection', css.includes('-webkit-touch-callout: none') && main.includes("'contextmenu', 'selectstart', 'dragstart'")],
  ['multi-touch pointer ownership', main.includes('activeTouchPointers') && main.includes('releaseTouchPointer')],
  ['touch cancellation recovery', main.includes("window.addEventListener('pointercancel'") && main.includes("document.addEventListener('visibilitychange'")],
  ['reduced motion', css.includes('prefers-reduced-motion') && main.includes('reducedMotion')],
  ['project proximity system', main.includes('updateProjectProximity')],
  ['twenty project system', data.includes('PROJECT_SEEDS') && data.match(/^\s*\[/gm)?.length >= 20],
  ['3D mockup showcase modal', html.includes('mockup-device') && html.includes('showcase-modal')],
  ['consultation destination form', html.includes('consultation-form') && main.includes('updateDestinationProximity')],
  ['viewport-safe consultation form', html.includes('consultation-actions') && css.includes('--journey-viewport-height') && main.includes('syncViewportHeight')],
  ['touch-scroll consultation form', css.includes('touch-action: pan-y') && css.includes('scrollbar-width: none') && css.includes('.consultation-actions { position: sticky')],
  ['journey progress system', html.includes('journey-progress') && main.includes('progressTrack')],
  ['road stop guidance', world.includes('createRoadStopMarker') && world.includes('STOP HERE') && main.includes('updateApproachHint')],
  ['driving help dialog', html.includes('id="help-modal"') && main.includes('KeyH')],
  ['responsive safe areas', css.includes('viewport-fit=cover') || (html.includes('viewport-fit=cover') && css.includes('safe-area-inset'))],
  ['mobile controls start-state gating', css.includes('.experience[data-started="true"] .touch-controls') && css.includes('.experience:not([data-started="true"]) .hud')],
  ['mobile onboarding remains reachable', css.includes('max-height: calc(100dvh - 146px)') && css.includes('overscroll-behavior: contain')],
  ['mobile project sheet uses full height', css.includes('max-height: calc(100dvh - 144px)') && css.includes('.showcase-modal[aria-hidden="false"]) .touch-controls')],
  ['small landscape layout', css.includes('max-height: 540px') && css.includes('orientation: landscape')],
  ['very large display layout', css.includes('min-width: 1800px')],
  ['resize observer', main.includes('ResizeObserver') && main.includes('visualViewport')],
  ['automatic journey choice', html.includes('id="start-auto"') && html.includes('I’ll drive myself')],
  ['automatic spline driving', main.includes('updateAutoJourney') && main.includes('setCarOnAutoRoute')],
  ['three-second portfolio stops', main.includes('AUTO_STOP_DURATION = 3') && main.includes('stopRemaining = AUTO_STOP_DURATION') && html.includes('three-second stops')],
  ['business-site portfolio route', softwareCard.includes('href="/software-portfolio"') && journeyShell.includes('/software-portfolio-app/index.html')],
  ['back and home recovery', journeyShell.includes('returnToPreviousPage') && journeyShell.includes('href="/"')],
  ['automatic tour controls', html.includes('id="tour-pause"') && html.includes('id="tour-exit"')],
  ['manual takeover', main.includes('stopAutoTour(true)') && main.includes('setInput')],
  ['reduced-motion auto journey', main.includes('reducedMotion && targetStation')],
  ['procedural road', world.includes('CatmullRomCurve3')],
  ['procedural car', world.includes('function createCar')],
  ['instanced environment', world.includes('InstancedMesh')],
  ['large world bounds', data.includes('minX: -135') && data.includes('maxZ: 145')],
  ['no scroll hijacking', !main.includes('wheel') || main.includes('wheels')],
];

let failed = false;
for (const [name, passed] of checks) {
  console.log(`${passed ? 'PASS' : 'FAIL'} ${name}`);
  if (!passed) failed = true;
}
if (failed) process.exit(1);
