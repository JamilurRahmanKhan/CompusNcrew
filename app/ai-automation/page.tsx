import type { Metadata } from "next";
import { AiAutomationShell } from "./ai-automation-shell";

export const metadata: Metadata = {
  title: "AI Automation Workflow",
  description: "Explore a real-time 3D demonstration of a connected social media automation workflow.",
};

export default function AiAutomationPage() { return <AiAutomationShell />; }
