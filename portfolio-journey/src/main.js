import * as THREE from 'three';
import { buildWorld } from './world.js';
import { DISTRICTS, PROJECTS } from './data.js';

const experience = document.querySelector('#experience');
const canvas = document.querySelector('#world');
const fallback = document.querySelector('#webgl-fallback');
const startButton = document.querySelector('#start-drive');
const startAutoButton = document.querySelector('#start-auto');
const autoTourLaunch = document.querySelector('#auto-tour-launch');
const resetButton = document.querySelector('#reset-car');
const cameraButton = document.querySelector('#camera-toggle');
const helpButton = document.querySelector('#help-toggle');
const helpModal = document.querySelector('#help-modal');
const projectJump = document.querySelector('#project-jump');
const panel = document.querySelector('#project-panel');
const closePanelButton = document.querySelector('#close-project');
const nextProjectButton = document.querySelector('#next-project');
const destinationCallout = document.querySelector('#destination-callout');
const consultationModal = document.querySelector('#consultation-modal');
const consultationForm = document.querySelector('#consultation-form');
const speedValue = document.querySelector('#speed-value');
const roadStatus = document.querySelector('.road-status');
const roadStatusText = document.querySelector('#road-status');
const progressTrack = document.querySelector('#progress-track');
const progressLabel = document.querySelector('#progress-label');
const districtLabel = document.querySelector('#district-label');
const approachHint = document.querySelector('#approach-hint');
const approachNumber = document.querySelector('#approach-number');
const approachKicker = document.querySelector('#approach-kicker');
const approachMessage = document.querySelector('#approach-message');
const tourController = document.querySelector('#tour-controller');
const tourKicker = document.querySelector('#tour-kicker');
const tourStatus = document.querySelector('#tour-status');
const tourCountdown = document.querySelector('#tour-countdown');
const tourCountdownTrack = document.querySelector('#tour-countdown-track');
const tourCountdownLabel = document.querySelector('#tour-countdown-label');
const tourPauseButton = document.querySelector('#tour-pause');
const tourExitButton = document.querySelector('#tour-exit');
const minimap = document.querySelector('#minimap');
const minimapContext = minimap.getContext('2d');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const AUTO_STOP_DURATION = 3;
document.documentElement.classList.toggle('has-touch', navigator.maxTouchPoints > 0 || 'ontouchstart' in window);

const panelFields = {
  number: document.querySelector('#project-number'),
  category: document.querySelector('#project-category'),
  title: document.querySelector('#project-title'),
  mockupTitle: document.querySelector('#mockup-title'),
  description: document.querySelector('#project-description'),
  role: document.querySelector('#project-role'),
  outcome: document.querySelector('#project-outcome'),
  link: document.querySelector('#project-link'),
};

PROJECTS.forEach((project, index) => {
  const option = document.createElement('option');
  option.value = String(index);
  option.textContent = `${project.number} · ${project.title} — ${project.category}`;
  projectJump.append(option);
});

const projectGrid = document.querySelector('#project-grid');
PROJECTS.forEach((project, index) => {
  const article = document.createElement('article');
  article.innerHTML = `<span>${project.number} / ${project.category}</span><h3>${project.title}</h3><p>${project.description}</p><button type="button" data-jump="${index}">Drive to ${project.title}</button>`;
  projectGrid.append(article);
});

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
} catch (error) {
  fallback.hidden = false;
  experience.dataset.ready = 'true';
  throw error;
}

renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.07;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 700 ? 1.15 : 1.55));

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 260);
const world = buildWorld(scene);
const clock = new THREE.Clock();

const input = { forward: false, backward: false, left: false, right: false };
const vehicle = {
  speed: 0,
  heading: world.start.heading,
  started: false,
  onRoad: true,
  cameraMode: 0,
  dismissedProject: null,
  activeProject: null,
  nearestRoadIndex: 0,
  destinationPresented: false,
  atDestination: false,
  approachStation: null,
};

const autoTour = {
  active: false,
  paused: false,
  routeT: 0.014,
  nextIndex: 0,
  currentSpeed: 0,
  cruiseSpeed: 12,
  stopRemaining: 0,
  lastCountdown: null,
};
const roadLength = world.road.curve.getLength();

const scratch = {
  forward: new THREE.Vector3(),
  desiredCamera: new THREE.Vector3(),
  cameraLook: new THREE.Vector3(),
  overview: new THREE.Vector3(),
  overhead: new THREE.Vector3(0, 34, 9),
  autoPoint: new THREE.Vector3(),
  autoTangent: new THREE.Vector3(),
  autoNormal: new THREE.Vector3(),
};

const startForward = new THREE.Vector3(Math.sin(world.start.heading), 0, Math.cos(world.start.heading));
scratch.overview.copy(world.start.position).addScaledVector(startForward, -24).add(new THREE.Vector3(-18, 28, 10));
camera.position.copy(scratch.overview);
camera.lookAt(world.start.position);

function resize() {
  const width = experience.clientWidth;
  const height = experience.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, width < 700 ? 1.15 : 1.55));
}

function setStarted(started = true) {
  vehicle.started = started;
  experience.dataset.started = String(started);
  if (started) {
    startButton.blur();
    canvas.focus({ preventScroll: true });
    canvas.setAttribute('aria-label', 'Driving active. Use W A S D or the arrow keys. Stop beside a numbered platform to open its showcase.');
  }
}

function setInput(name, pressed) {
  if (pressed && autoTour.active) stopAutoTour(true);
  input[name] = pressed;
  const button = document.querySelector(`[data-control="${name}"]`);
  if (button) button.dataset.active = String(pressed);
}

const keyMap = { ArrowUp: 'forward', KeyW: 'forward', ArrowDown: 'backward', KeyS: 'backward', ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right' };
window.addEventListener('keydown', (event) => {
  const target = event.target;
  const editing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement;
  if (editing) return;
  if (event.code === 'KeyH' && !consultationModal.open) {
    event.preventDefault();
    openHelp();
    return;
  }
  if (event.code === 'KeyC' && vehicle.started && !helpModal.open && !consultationModal.open) {
    event.preventDefault();
    toggleCamera();
    return;
  }
  if (event.code === 'KeyR' && vehicle.started && !helpModal.open && !consultationModal.open) {
    event.preventDefault();
    resetCar();
    return;
  }
  if (event.code === 'Escape' && panel.getAttribute('aria-hidden') === 'false') {
    hideProject(true);
    return;
  }
  if (consultationModal.open || helpModal.open || !vehicle.started || !keyMap[event.code]) return;
  event.preventDefault();
  setInput(keyMap[event.code], true);
});
window.addEventListener('keyup', (event) => {
  if (!keyMap[event.code]) return;
  setInput(keyMap[event.code], false);
});
window.addEventListener('blur', () => Object.keys(input).forEach((key) => setInput(key, false)));

document.querySelectorAll('[data-control]').forEach((button) => {
  const control = button.dataset.control;
  const press = (event) => {
    event.preventDefault();
    setStarted();
    setInput(control, true);
    button.setPointerCapture?.(event.pointerId);
  };
  const release = (event) => { event.preventDefault(); setInput(control, false); };
  button.addEventListener('pointerdown', press);
  button.addEventListener('pointerup', release);
  button.addEventListener('pointercancel', release);
  button.addEventListener('lostpointercapture', release);
});

function nearestRoad(position) {
  let nearestSquared = Infinity;
  let nearestIndex = 0;
  world.road.samples.forEach((point, index) => {
    const dx = point.x - position.x;
    const dz = point.z - position.z;
    const squared = dx * dx + dz * dz;
    if (squared < nearestSquared) {
      nearestSquared = squared;
      nearestIndex = index;
    }
  });
  return { distance: Math.sqrt(nearestSquared), index: nearestIndex };
}

function resolveCollisions(position) {
  world.colliders.forEach((collider) => {
    const dx = position.x - collider.x;
    const dz = position.z - collider.z;
    const distance = Math.hypot(dx, dz);
    const minimum = collider.radius + 1.25;
    if (distance < minimum) {
      position.x = collider.x + (dx / Math.max(distance, 0.001)) * minimum;
      position.z = collider.z + (dz / Math.max(distance, 0.001)) * minimum;
      vehicle.speed *= -0.22;
    }
  });
}

function setCarOnAutoRoute(routeT, station = null) {
  const car = world.car.group;
  world.road.curve.getPointAt(routeT, scratch.autoPoint);
  world.road.curve.getTangentAt(routeT, scratch.autoTangent).normalize();
  scratch.autoNormal.set(-scratch.autoTangent.z, 0, scratch.autoTangent.x);

  let lateralOffset = 0;
  if (station) {
    const dockingWindow = 0.014;
    const proximity = THREE.MathUtils.clamp(1 - Math.abs(routeT - station.project.curveT) / dockingWindow, 0, 1);
    const easedDocking = proximity * proximity * (3 - 2 * proximity);
    lateralOffset = station.project.side * 1.62 * easedDocking;
  }
  car.position.copy(scratch.autoPoint).addScaledVector(scratch.autoNormal, lateralOffset).setY(0.12);
  vehicle.heading = Math.atan2(scratch.autoTangent.x, scratch.autoTangent.z);
  car.rotation.y = vehicle.heading;
  vehicle.nearestRoadIndex = Math.round(routeT * (world.road.samples.length - 1));
  vehicle.onRoad = true;
}

function updateTourUi() {
  if (!autoTour.active) return;
  tourController.setAttribute('aria-hidden', 'false');
  if (autoTour.paused) {
    tourKicker.textContent = 'Automatic journey paused';
    tourStatus.textContent = autoTour.stopRemaining > 0
      ? `Paused at ${PROJECTS[Math.max(0, autoTour.nextIndex)].title}`
      : `Paused before project ${String(autoTour.nextIndex + 1).padStart(2, '0')}`;
  } else if (autoTour.stopRemaining > 0) {
    const project = PROJECTS[autoTour.nextIndex];
    tourKicker.textContent = `Stop ${project.number} of ${PROJECTS.length}`;
    tourStatus.textContent = `${project.title} · Portfolio showcase`;
  } else {
    const nextProject = PROJECTS[autoTour.nextIndex];
    tourKicker.textContent = 'Automatic journey';
    tourStatus.textContent = nextProject
      ? `Driving to ${nextProject.number} · ${nextProject.title}`
      : 'Driving to the final consultation studio';
  }
  tourCountdown.setAttribute('aria-hidden', String(autoTour.stopRemaining <= 0));
  const ratio = THREE.MathUtils.clamp(autoTour.stopRemaining / AUTO_STOP_DURATION, 0, 1);
  tourCountdownTrack.style.transform = `scaleX(${ratio})`;
  const countdown = Math.max(0, Math.ceil(autoTour.stopRemaining));
  if (countdown !== autoTour.lastCountdown) {
    autoTour.lastCountdown = countdown;
    tourCountdownLabel.textContent = autoTour.stopRemaining > 0 ? `${countdown}s` : '—';
  }
}

function arriveAtAutoStop(index) {
  const station = world.stations[index];
  autoTour.routeT = station.project.curveT;
  autoTour.currentSpeed = 0;
  autoTour.stopRemaining = AUTO_STOP_DURATION;
  autoTour.lastCountdown = null;
  vehicle.speed = 0;
  setCarOnAutoRoute(autoTour.routeT, station);
  vehicle.dismissedProject = null;
  showProject(index, true);
  updateTourUi();
}

function finishAutoStop() {
  if (!autoTour.active) return;
  const finishedIndex = autoTour.nextIndex;
  autoTour.stopRemaining = 0;
  autoTour.lastCountdown = null;
  hideProject();
  vehicle.dismissedProject = finishedIndex;
  autoTour.nextIndex += 1;
  autoTour.routeT = Math.min(0.972, autoTour.routeT + 0.00045);
  projectJump.value = '';
  updateTourUi();
}

function completeAutoJourney() {
  autoTour.active = false;
  autoTour.paused = false;
  autoTour.currentSpeed = 0;
  vehicle.speed = 0;
  experience.dataset.autoTour = 'false';
  tourController.setAttribute('aria-hidden', 'true');
  autoTourLaunch.setAttribute('aria-pressed', 'false');
  autoTourLaunch.setAttribute('aria-label', 'Start the automatic portfolio journey');
  autoTourLaunch.title = 'Start auto journey';
  setCarOnAutoRoute(0.972);
}

function updateAutoJourney(delta) {
  if (!autoTour.active) return;
  if (autoTour.paused || helpModal.open || consultationModal.open) {
    autoTour.currentSpeed = THREE.MathUtils.damp(autoTour.currentSpeed, 0, 7, delta);
    vehicle.speed = autoTour.currentSpeed;
    updateTourUi();
    return;
  }

  if (autoTour.stopRemaining > 0) {
    autoTour.stopRemaining = Math.max(0, autoTour.stopRemaining - delta);
    autoTour.currentSpeed = 0;
    vehicle.speed = 0;
    if (autoTour.stopRemaining === 0) finishAutoStop();
    updateTourUi();
    return;
  }

  const targetStation = world.stations[autoTour.nextIndex] ?? null;
  const destinationT = targetStation?.project.curveT ?? 0.972;
  if (reducedMotion && targetStation) {
    arriveAtAutoStop(autoTour.nextIndex);
    return;
  }
  if (reducedMotion && !targetStation) {
    completeAutoJourney();
    return;
  }

  const remainingDistance = Math.max(0, (destinationT - autoTour.routeT) * roadLength);
  const brakingSpeed = THREE.MathUtils.clamp(remainingDistance * 0.72, 2.2, autoTour.cruiseSpeed);
  autoTour.currentSpeed = THREE.MathUtils.damp(autoTour.currentSpeed, brakingSpeed, 1.9, delta);
  const nextT = autoTour.routeT + (autoTour.currentSpeed / roadLength) * delta;

  if (nextT >= destinationT) {
    autoTour.routeT = destinationT;
    if (targetStation) arriveAtAutoStop(autoTour.nextIndex);
    else completeAutoJourney();
    return;
  }

  autoTour.routeT = nextT;
  vehicle.speed = autoTour.currentSpeed;
  setCarOnAutoRoute(autoTour.routeT, targetStation);
  const wheelRotation = autoTour.currentSpeed * delta * 1.8;
  world.car.wheels.forEach(({ pivot, wheel, front }) => {
    wheel.rotation.x += wheelRotation;
    if (front) pivot.rotation.y = THREE.MathUtils.damp(pivot.rotation.y, 0, 10, delta);
  });
  updateTourUi();
}

function startAutoJourney() {
  if (consultationModal.open) consultationModal.close();
  if (helpModal.open) helpModal.close();
  hideProject();
  Object.keys(input).forEach((key) => setInput(key, false));
  autoTour.active = true;
  autoTour.paused = false;
  autoTour.routeT = 0.014;
  autoTour.nextIndex = 0;
  autoTour.currentSpeed = 0;
  autoTour.stopRemaining = 0;
  autoTour.lastCountdown = null;
  vehicle.dismissedProject = null;
  vehicle.destinationPresented = false;
  vehicle.cameraMode = 0;
  cameraButton.setAttribute('aria-pressed', 'false');
  cameraButton.setAttribute('aria-label', 'Switch to overhead camera');
  setCarOnAutoRoute(autoTour.routeT, world.stations[0]);
  setStarted();
  experience.dataset.autoTour = 'true';
  tourController.setAttribute('aria-hidden', 'false');
  autoTourLaunch.setAttribute('aria-pressed', 'true');
  autoTourLaunch.setAttribute('aria-label', 'Restart the automatic portfolio journey');
  autoTourLaunch.title = 'Restart auto journey';
  tourPauseButton.setAttribute('aria-pressed', 'false');
  tourPauseButton.querySelector('strong').textContent = 'Pause';
  tourPauseButton.querySelector('span').textContent = 'Ⅱ';
  projectJump.value = '';
  updateTourUi();
}

function stopAutoTour(takeWheel = true) {
  if (!autoTour.active) return;
  autoTour.active = false;
  autoTour.paused = false;
  autoTour.currentSpeed = 0;
  autoTour.stopRemaining = 0;
  vehicle.speed = 0;
  experience.dataset.autoTour = 'false';
  tourController.setAttribute('aria-hidden', 'true');
  autoTourLaunch.setAttribute('aria-pressed', 'false');
  autoTourLaunch.setAttribute('aria-label', 'Start the automatic portfolio journey');
  autoTourLaunch.title = 'Start auto journey';
  hideProject(true);
  if (takeWheel) {
    vehicle.started = true;
    experience.dataset.started = 'true';
    canvas.focus({ preventScroll: true });
  }
}

function toggleAutoPause() {
  if (!autoTour.active) return;
  autoTour.paused = !autoTour.paused;
  vehicle.speed = 0;
  tourPauseButton.setAttribute('aria-pressed', String(autoTour.paused));
  tourPauseButton.querySelector('strong').textContent = autoTour.paused ? 'Resume' : 'Pause';
  tourPauseButton.querySelector('span').textContent = autoTour.paused ? '▶' : 'Ⅱ';
  updateTourUi();
}

function updateVehicle(delta) {
  if (!vehicle.started || autoTour.active || consultationModal.open || helpModal.open) return;
  const car = world.car.group;
  const road = nearestRoad(car.position);
  vehicle.nearestRoadIndex = road.index;
  vehicle.onRoad = road.distance < world.road.halfWidth + 1.4;
  const acceleration = vehicle.onRoad ? 16 : 6.5;
  const maxForward = vehicle.onRoad ? 20 : 7;
  const maxReverse = vehicle.onRoad ? -8 : -4;
  if (input.forward) vehicle.speed += acceleration * delta;
  if (input.backward) vehicle.speed -= acceleration * 0.82 * delta;
  if (!input.forward && !input.backward) vehicle.speed = THREE.MathUtils.damp(vehicle.speed, 0, vehicle.onRoad ? 4.3 : 8.5, delta);
  vehicle.speed = THREE.MathUtils.clamp(vehicle.speed, maxReverse, maxForward);
  const steering = Number(input.left) - Number(input.right);
  const speedRatio = THREE.MathUtils.clamp(Math.abs(vehicle.speed) / 5, 0.22, 1);
  if (Math.abs(vehicle.speed) > 0.08) vehicle.heading += steering * 1.5 * delta * speedRatio * Math.sign(vehicle.speed);
  scratch.forward.set(Math.sin(vehicle.heading), 0, Math.cos(vehicle.heading));
  car.position.addScaledVector(scratch.forward, vehicle.speed * delta);
  car.position.x = THREE.MathUtils.clamp(car.position.x, world.bounds.minX, world.bounds.maxX);
  car.position.z = THREE.MathUtils.clamp(car.position.z, world.bounds.minZ, world.bounds.maxZ);
  resolveCollisions(car.position);
  car.rotation.y = vehicle.heading;
  const wheelRotation = vehicle.speed * delta * 1.8;
  world.car.wheels.forEach(({ pivot, wheel, front }) => {
    wheel.rotation.x += wheelRotation;
    if (front) pivot.rotation.y = THREE.MathUtils.damp(pivot.rotation.y, steering * 0.42, 12, delta);
  });
}

function updateCamera(delta) {
  const car = world.car.group;
  if (!vehicle.started) {
    camera.position.lerp(scratch.overview, reducedMotion ? 1 : 1 - Math.exp(-1.8 * delta));
    camera.lookAt(world.start.position.x, 1, world.start.position.z);
    return;
  }
  scratch.forward.set(Math.sin(vehicle.heading), 0, Math.cos(vehicle.heading));
  if (vehicle.cameraMode === 0) {
    scratch.desiredCamera.copy(car.position).addScaledVector(scratch.forward, -12.5).setY(car.position.y + 8.2);
    scratch.cameraLook.copy(car.position).addScaledVector(scratch.forward, 7).setY(1.2);
  } else {
    scratch.desiredCamera.copy(car.position).add(scratch.overhead);
    scratch.cameraLook.copy(car.position);
  }
  camera.position.lerp(scratch.desiredCamera, reducedMotion ? 1 : 1 - Math.exp(-5 * delta));
  camera.lookAt(scratch.cameraLook);
}

function showProject(index, force = false) {
  if ((!force && vehicle.activeProject === index) || (!force && vehicle.dismissedProject === index)) return;
  const project = PROJECTS[index];
  vehicle.speed = THREE.MathUtils.damp(vehicle.speed, 0, 7, 0.18);
  vehicle.activeProject = index;
  panelFields.number.textContent = project.number;
  panelFields.category.textContent = project.category;
  panelFields.title.textContent = project.title;
  panelFields.mockupTitle.textContent = project.title;
  panelFields.description.textContent = project.description;
  panelFields.role.textContent = project.role;
  panelFields.outcome.textContent = project.outcome;
  panelFields.link.href = `mailto:hello@compassncrew.com?subject=${encodeURIComponent(`${project.title} case study`)}`;
  panel.style.setProperty('--project-color', `#${project.color.toString(16).padStart(6, '0')}`);
  panel.setAttribute('aria-hidden', 'false');
  projectJump.value = String(index);
}

function hideProject(dismiss = false) {
  if (dismiss && vehicle.activeProject !== null) vehicle.dismissedProject = vehicle.activeProject;
  vehicle.activeProject = null;
  panel.setAttribute('aria-hidden', 'true');
}

function updateProjectProximity(delta, elapsed) {
  const carPosition = world.car.group.position;
  let nearestIndex = null;
  let nearestDistance = Infinity;
  world.stations.forEach((station) => {
    const distance = carPosition.distanceTo(station.center);
    if (distance < nearestDistance) { nearestDistance = distance; nearestIndex = station.index; }
    const active = distance < station.triggerRadius ? 1 : 0;
    station.activation = reducedMotion ? active : THREE.MathUtils.damp(station.activation, active, 5.5, delta);
    station.screenMount.position.y = station.activation * 1.25;
    station.screenMount.rotation.x = -station.activation * 0.05;
    station.ring.material.emissiveIntensity = 0.2 + station.activation * 1.25 + (reducedMotion ? 0 : (Math.sin(elapsed * 2 + station.index) + 1) * 0.05);
    station.roadMarker.beaconLight.material.emissiveIntensity = reducedMotion ? 1.2 : 1.05 + (Math.sin(elapsed * 3.4 + station.index * 0.7) + 1) * 0.48;
  });
  if (vehicle.dismissedProject !== null) {
    const dismissed = world.stations[vehicle.dismissedProject];
    if (carPosition.distanceTo(dismissed.center) > dismissed.triggerRadius + 3) vehicle.dismissedProject = null;
  }
  if (autoTour.active) return;
  if (nearestIndex !== null && nearestDistance < world.stations[nearestIndex].triggerRadius) showProject(nearestIndex);
  else if (vehicle.activeProject !== null) hideProject();
}

function updateApproachHint() {
  if (!vehicle.started || autoTour.active || vehicle.activeProject !== null || vehicle.atDestination || consultationModal.open || helpModal.open) {
    approachHint.setAttribute('aria-hidden', 'true');
    vehicle.approachStation = null;
    return;
  }
  const carPosition = world.car.group.position;
  let candidate = null;
  let distance = Infinity;
  world.stations.forEach((station) => {
    const roadDistance = carPosition.distanceTo(station.roadPoint);
    if (roadDistance < distance) {
      candidate = station;
      distance = roadDistance;
    }
  });
  if (!candidate || distance > 26) {
    approachHint.setAttribute('aria-hidden', 'true');
    vehicle.approachStation = null;
    return;
  }
  if (vehicle.approachStation !== candidate.index) {
    vehicle.approachStation = candidate.index;
    approachNumber.textContent = candidate.project.number;
    approachKicker.textContent = `${candidate.project.title} · ${candidate.project.category}`;
    approachMessage.textContent = 'Slow down and stop inside the orange road bay to open the portfolio.';
  }
  approachHint.setAttribute('aria-hidden', 'false');
}

function openConsultation() {
  if (consultationModal.open) return;
  if (autoTour.active) stopAutoTour(false);
  vehicle.speed = 0;
  Object.keys(input).forEach((key) => setInput(key, false));
  consultationModal.showModal();
}

function openHelp() {
  if (helpModal.open) return;
  vehicle.speed = 0;
  Object.keys(input).forEach((key) => setInput(key, false));
  helpModal.showModal();
}

function toggleCamera() {
  vehicle.cameraMode = (vehicle.cameraMode + 1) % 2;
  const overhead = vehicle.cameraMode === 1;
  cameraButton.setAttribute('aria-pressed', String(overhead));
  cameraButton.setAttribute('aria-label', overhead ? 'Switch to chase camera' : 'Switch to overhead camera');
  cameraButton.title = overhead ? 'Switch to chase camera' : 'Switch to overhead camera';
}

function updateDestinationProximity() {
  if (autoTour.active) {
    vehicle.atDestination = false;
    destinationCallout.setAttribute('aria-hidden', 'true');
    return;
  }
  const distance = world.car.group.position.distanceTo(world.consultation.center);
  vehicle.atDestination = distance < world.consultation.triggerRadius;
  destinationCallout.setAttribute('aria-hidden', String(!vehicle.atDestination));
  world.consultation.ring.material.emissiveIntensity = vehicle.atDestination ? 1.7 : 0.45;
  if (vehicle.atDestination && !vehicle.destinationPresented) {
    vehicle.destinationPresented = true;
    vehicle.speed = 0;
    window.setTimeout(() => { if (vehicle.atDestination) openConsultation(); }, reducedMotion ? 0 : 700);
  }
  if (distance > world.consultation.triggerRadius + 8) vehicle.destinationPresented = false;
}

function jumpToProject(index) {
  if (autoTour.active) stopAutoTour(false);
  const station = world.stations[index];
  setStarted();
  vehicle.speed = 0;
  vehicle.dismissedProject = null;
  vehicle.heading = Math.atan2(station.tangent.x, station.tangent.z);
  world.car.group.position.copy(station.roadPoint).addScaledVector(station.tangent, -2).setY(0.12);
  world.car.group.rotation.y = vehicle.heading;
  window.setTimeout(() => showProject(index, true), reducedMotion ? 0 : 220);
}

function resetCar() {
  if (autoTour.active) stopAutoTour(false);
  vehicle.speed = 0;
  vehicle.heading = world.start.heading;
  vehicle.dismissedProject = null;
  vehicle.destinationPresented = false;
  world.car.group.position.copy(world.start.position).setY(0.12);
  world.car.group.rotation.y = vehicle.heading;
  hideProject();
  projectJump.value = '';
  setStarted();
}

function updateHud() {
  const progress = vehicle.nearestRoadIndex / (world.road.samples.length - 1);
  speedValue.textContent = String(Math.round(Math.abs(vehicle.speed) * 5.1));
  roadStatus.classList.toggle('is-offroad', !vehicle.onRoad);
  roadStatusText.textContent = vehicle.onRoad ? 'On road' : 'Off road';
  progressTrack.style.transform = `scaleX(${progress})`;
  progressLabel.textContent = progress > 0.95 ? 'Final destination' : `${Math.round(progress * 100)}% complete`;
  const districtIndex = Math.min(DISTRICTS.length - 1, Math.floor(progress * DISTRICTS.length));
  districtLabel.textContent = progress < 0.04 ? 'Departure' : `District ${DISTRICTS[districtIndex].number} · ${DISTRICTS[districtIndex].title}`;
}

function mapPoint(x, z) {
  const padding = 8;
  return {
    x: padding + ((x - world.bounds.minX) / (world.bounds.maxX - world.bounds.minX)) * (minimap.width - padding * 2),
    y: padding + ((z - world.bounds.minZ) / (world.bounds.maxZ - world.bounds.minZ)) * (minimap.height - padding * 2),
  };
}

function drawMinimap() {
  const width = minimap.width;
  const height = minimap.height;
  minimapContext.clearRect(0, 0, width, height);
  minimapContext.fillStyle = 'rgba(17,19,21,.9)';
  minimapContext.fillRect(0, 0, width, height);
  minimapContext.strokeStyle = '#716b61';
  minimapContext.lineWidth = 8;
  minimapContext.lineCap = 'round';
  minimapContext.lineJoin = 'round';
  minimapContext.beginPath();
  world.road.samples.forEach((point, index) => {
    const mapped = mapPoint(point.x, point.z);
    if (index === 0) minimapContext.moveTo(mapped.x, mapped.y); else minimapContext.lineTo(mapped.x, mapped.y);
  });
  minimapContext.stroke();
  world.stations.forEach((station) => {
    const mapped = mapPoint(station.center.x, station.center.z);
    minimapContext.fillStyle = station.index === vehicle.activeProject ? '#dc7431' : '#e8deca';
    minimapContext.beginPath();
    minimapContext.arc(mapped.x, mapped.y, station.index === vehicle.activeProject ? 5 : 3.2, 0, Math.PI * 2);
    minimapContext.fill();
  });
  const destination = mapPoint(world.consultation.center.x, world.consultation.center.z);
  minimapContext.strokeStyle = '#dc7431';
  minimapContext.lineWidth = 2;
  minimapContext.strokeRect(destination.x - 5, destination.y - 5, 10, 10);
  const car = mapPoint(world.car.group.position.x, world.car.group.position.z);
  minimapContext.save();
  minimapContext.translate(car.x, car.y);
  minimapContext.rotate(-vehicle.heading);
  minimapContext.fillStyle = '#dc7431';
  minimapContext.beginPath();
  minimapContext.moveTo(0, 7); minimapContext.lineTo(-5, -4); minimapContext.lineTo(5, -4); minimapContext.closePath();
  minimapContext.fill();
  minimapContext.restore();
}

function animate() {
  const delta = Math.min(clock.getDelta(), 0.05);
  const elapsed = clock.elapsedTime;
  updateAutoJourney(delta);
  updateVehicle(delta);
  updateCamera(delta);
  updateProjectProximity(delta, elapsed);
  updateDestinationProximity();
  updateApproachHint();
  updateHud();
  drawMinimap();
  renderer.render(scene, camera);
  animationFrame = requestAnimationFrame(animate);
}

let animationFrame = requestAnimationFrame(animate);
startButton.addEventListener('click', () => {
  if (autoTour.active) stopAutoTour(false);
  setStarted();
});
startAutoButton.addEventListener('click', startAutoJourney);
autoTourLaunch.addEventListener('click', startAutoJourney);
tourPauseButton.addEventListener('click', toggleAutoPause);
tourExitButton.addEventListener('click', () => stopAutoTour(true));
resetButton.addEventListener('click', resetCar);
cameraButton.addEventListener('click', toggleCamera);
helpButton.addEventListener('click', openHelp);
closePanelButton.addEventListener('click', () => {
  if (autoTour.active && autoTour.stopRemaining > 0) finishAutoStop();
  else hideProject(true);
});
nextProjectButton.addEventListener('click', () => {
  const next = Math.min(PROJECTS.length - 1, (vehicle.activeProject ?? 0) + 1);
  jumpToProject(next);
});
projectJump.addEventListener('change', () => { if (projectJump.value !== '') jumpToProject(Number(projectJump.value)); });
document.addEventListener('click', (event) => {
  const jumpButton = event.target.closest('[data-jump]');
  if (jumpButton) {
    jumpToProject(Number(jumpButton.dataset.jump));
    experience.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  }
});
document.querySelector('#open-consultation').addEventListener('click', openConsultation);
document.querySelector('#index-consultation').addEventListener('click', openConsultation);
document.querySelector('#close-consultation').addEventListener('click', () => consultationModal.close());
document.querySelector('#close-help').addEventListener('click', () => helpModal.close());
document.querySelector('#continue-journey').addEventListener('click', () => {
  helpModal.close();
  if (!vehicle.started) setStarted();
});
consultationModal.addEventListener('click', (event) => { if (event.target === consultationModal) consultationModal.close(); });
consultationForm.addEventListener('submit', () => {
  destinationCallout.querySelector('strong').textContent = 'Thank you. We’ll be in touch.';
  destinationCallout.querySelector('button').textContent = 'Request received';
});
window.addEventListener('resize', resize, { passive: true });
window.visualViewport?.addEventListener('resize', resize, { passive: true });
const resizeObserver = new ResizeObserver(resize);
resizeObserver.observe(experience);
window.addEventListener('beforeunload', () => {
  cancelAnimationFrame(animationFrame);
  resizeObserver.disconnect();
}, { once: true });
canvas.addEventListener('webglcontextlost', (event) => { event.preventDefault(); cancelAnimationFrame(animationFrame); fallback.hidden = false; });

resize();
renderer.compile(scene, camera);
experience.dataset.ready = 'true';

window.__COMPASSNCREW_JOURNEY_DEBUG__ = {
  get carPosition() { const { x, y, z } = world.car.group.position; return { x, y, z, speed: vehicle.speed, heading: vehicle.heading }; },
  get activeProject() { return vehicle.activeProject; },
  get projectCount() { return world.stations.length; },
  get started() { return vehicle.started; },
  get destinationOpen() { return consultationModal.open; },
  get autoTour() { return { ...autoTour }; },
  jumpToProject,
  resetCar,
  openConsultation,
  startAutoJourney,
  stopAutoTour,
};
