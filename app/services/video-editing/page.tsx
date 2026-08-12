import type { Metadata } from "next";
import { VideoEditingStudio } from "./video-editing-studio";

export const metadata: Metadata = {
  title: "Video Editing — Retention-led Cuts",
  description:
    "Video editing for product stories, social cuts, ads and case studies—built around hooks, captions, platform formats and measurable retention.",
  alternates: { canonical: "/services/video-editing" },
};

export default function VideoEditingPage() {
  return <VideoEditingStudio />;
}
