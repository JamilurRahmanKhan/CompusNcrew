import { stages, workflowNodes } from "./data.js";
import { createWorld } from "./world.js";

const $ = (selector) => document.querySelector(selector);
const elements = {
  body: document.body, list: $("#stage-list"), kind: $("#node-kind"), icon: $("#node-icon"), name: $("#node-name"),
  description: $("#node-description"), input: $("#node-input"), action: $("#node-action"), output: $("#node-output"),
  state: $("#node-state"), system: $("#system-label"), engineState: $("#engine-state"), engineDetail: $("#engine-detail"),
  start: $("#start-button"), startLabel: $("#start-label"), journeyIndex: $("#journey-index"), journeyTitle: $("#journey-title"),
  journeyPayload: $("#journey-payload"), result: $("#result-panel"), services: $("#services-page"),
};

let activeNode = 0;
let activeStage = 0;
let world;
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

const stageButtons = stages.map((stage, index) => {
  const item = document.createElement("li");
  const button = document.createElement("button");
  button.type = "button";
  button.innerHTML = `<b>${String(index + 1).padStart(2, "0")}</b><small>${stage.short}</small>`;
  button.setAttribute("aria-label", `${stage.short}: ${stage.label}`);
  button.addEventListener("click", () => world.selectStage(index, true));
  item.append(button); elements.list.append(item); return button;
});

function initials(name) {
  return name.split(/\s|\//).filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase();
}

function showNode(index, status = "Ready") {
  activeNode = index;
  const node = workflowNodes[index];
  activeStage = node.stage;
  elements.kind.textContent = `Step ${String(index + 1).padStart(2, "0")} · ${node.kind}`;
  elements.icon.textContent = initials(node.name);
  elements.icon.style.setProperty("--node-color", `#${node.color.toString(16).padStart(6, "0")}`);
  elements.name.textContent = node.name;
  elements.description.textContent = node.description;
  elements.input.textContent = node.input;
  elements.action.textContent = node.action;
  elements.output.textContent = node.output;
  elements.state.textContent = status;
  stageButtons.forEach((button, stageIndex) => {
    button.classList.toggle("active", stageIndex === node.stage);
    button.setAttribute("aria-current", stageIndex === node.stage ? "step" : "false");
  });
  stageButtons[node.stage].scrollIntoView({ block: "nearest", inline: "center", behavior: reducedMotion ? "auto" : "smooth" });
}

function updateJourney(stageIndex) {
  const stage = stages[stageIndex];
  elements.journeyIndex.textContent = `${String(stageIndex + 1).padStart(2, "0")} / 07`;
  elements.journeyTitle.textContent = stage.label;
  elements.journeyPayload.textContent = stage.payload;
}

world = createWorld($("#world"), {
  onSelect(index) {
    const isResult = workflowNodes[index].id === "campaign-output" && Boolean(world?.completed);
    elements.body.classList.toggle("show-result", isResult);
    elements.result.setAttribute("aria-hidden", String(!isResult));
    showNode(index, world?.completed ? "Complete" : "Inspecting");
  },
  onStage(stageIndex, nodeIndex) {
    activeStage = stageIndex;
    elements.body.classList.remove("show-result");
    elements.result.setAttribute("aria-hidden", "true");
    showNode(nodeIndex, "Running");
    updateJourney(stageIndex);
    stageButtons.forEach((button, index) => {
      button.classList.toggle("done", index < stageIndex);
      button.classList.toggle("active", index === stageIndex);
    });
    elements.system.textContent = `${stages[stageIndex].short} in progress`;
    elements.engineState.textContent = stages[stageIndex].label.toUpperCase();
    elements.engineDetail.textContent = stages[stageIndex].payload;
  },
  onRunning(running) {
    elements.body.classList.toggle("running", running);
    elements.startLabel.textContent = running ? "Pause workflow" : (world.completed ? "Replay workflow" : "Resume workflow");
  },
  onComplete() {
    const resultIndex = workflowNodes.findIndex((node) => node.id === "campaign-output");
    showNode(resultIndex, "Complete");
    stageButtons.forEach((button) => button.classList.add("done"));
    elements.body.classList.add("show-result");
    elements.result.setAttribute("aria-hidden", "false");
    elements.system.textContent = "Campaign delivered";
    elements.engineState.textContent = "CAMPAIGN PACKAGE DELIVERED";
    elements.engineDetail.textContent = "4 posts · 12 assets · optimization loop active";
    elements.startLabel.textContent = "Replay workflow";
    elements.journeyIndex.textContent = "OUTPUT";
    elements.journeyTitle.textContent = "Campaign delivered to four channels";
    elements.journeyPayload.textContent = "12 assets created · human approved · results connected";
    window.setTimeout(() => {
      elements.body.classList.add("services-visible");
      elements.services.setAttribute("aria-hidden", "false");
      elements.services.focus({ preventScroll: true });
    }, reducedMotion ? 120 : 650);
  },
  onReset() {
    stageButtons.forEach((button) => button.classList.remove("done", "active"));
    elements.body.classList.remove("show-result");
    elements.result.setAttribute("aria-hidden", "true");
    elements.system.textContent = "Ready to run";
    elements.engineState.textContent = "WORKFLOW READY";
    elements.engineDetail.textContent = "14 connected steps waiting for a campaign";
    elements.startLabel.textContent = "Run social workflow";
    elements.journeyIndex.textContent = "READY";
    elements.journeyTitle.textContent = "Campaign workflow ready";
    elements.journeyPayload.textContent = "Run the workflow to follow every payload";
  },
});

window.setTimeout(() => world.start(), reducedMotion ? 100 : 1000);

function returnToWorkflow() {
  if (!elements.body.classList.contains("services-visible")) return;
  elements.body.classList.remove("services-visible");
  elements.services.setAttribute("aria-hidden", "true");
  elements.services.scrollTop = 0;
  world.reset();
  window.setTimeout(() => world.start(), reducedMotion ? 60 : 520);
}

const replayDialog = $("#replay-dialog");
function requestWorkflowReplay() {
  if (!elements.body.classList.contains("services-visible") || replayDialog.open) return;
  replayDialog.showModal();
}
$("#replay-request").addEventListener("click", requestWorkflowReplay);
$("#replay-stay").addEventListener("click", () => replayDialog.close());
$("#replay-confirm").addEventListener("click", () => { replayDialog.close(); returnToWorkflow(); });
replayDialog.addEventListener("click", (event) => { if (event.target === replayDialog) replayDialog.close(); });

let serviceTouchStart = null;
let serviceTouchDelta = 0;
elements.services.addEventListener("wheel", (event) => {
  if (elements.services.scrollTop <= 1 && event.deltaY < -32) requestWorkflowReplay();
}, { passive: true });
elements.services.addEventListener("touchstart", (event) => {
  serviceTouchStart = elements.services.scrollTop <= 1 ? event.touches[0].clientY : null;
  serviceTouchDelta = 0;
}, { passive: true });
elements.services.addEventListener("touchmove", (event) => {
  if (serviceTouchStart === null) return;
  serviceTouchDelta = event.touches[0].clientY - serviceTouchStart;
}, { passive: true });
elements.services.addEventListener("touchend", () => {
  if (serviceTouchDelta > 72) requestWorkflowReplay();
  serviceTouchStart = null;
  serviceTouchDelta = 0;
}, { passive: true });

showNode(0);
document.documentElement.dataset.workflowState = "ready";
