import { stages, workflowNodes } from "./data.js";
import { createWorld } from "./world.js";

const $ = (selector) => document.querySelector(selector);
const elements = {
  body: document.body, list: $("#stage-list"), kind: $("#node-kind"), icon: $("#node-icon"), name: $("#node-name"),
  description: $("#node-description"), input: $("#node-input"), action: $("#node-action"), output: $("#node-output"),
  state: $("#node-state"), system: $("#system-label"), engineState: $("#engine-state"), engineDetail: $("#engine-detail"),
  start: $("#start-button"), startLabel: $("#start-label"), journeyIndex: $("#journey-index"), journeyTitle: $("#journey-title"),
  journeyPayload: $("#journey-payload"), result: $("#result-panel"),
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

elements.start.addEventListener("click", () => world.toggle());
$("#overview-button").addEventListener("click", () => world.overview());
$("#reset-button").addEventListener("click", () => world.reset());
const dialog = $("#help-dialog");
$("#help-button").addEventListener("click", () => dialog.showModal());
$("#close-help").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
window.addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && !dialog.open) { event.preventDefault(); world.toggle(); }
  if (event.key.toLowerCase() === "r") world.reset();
  if (event.key === "ArrowRight") world.select(Math.min(workflowNodes.length - 1, activeNode + 1), true);
  if (event.key === "ArrowLeft") world.select(Math.max(0, activeNode - 1), true);
  if (event.key === "ArrowDown") world.selectStage(Math.min(stages.length - 1, activeStage + 1), true);
  if (event.key === "ArrowUp") world.selectStage(Math.max(0, activeStage - 1), true);
});
showNode(0);
document.documentElement.dataset.workflowState = "ready";
