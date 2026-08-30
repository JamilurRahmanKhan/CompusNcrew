import { existsSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const assetsDirectory = resolve(projectRoot, "public", "paid-ads");
const source = resolve(assetsDirectory, "ad-engine.gif");
const video = resolve(assetsDirectory, "ad-engine-alpha.webm");
const poster = resolve(assetsDirectory, "ad-engine-poster.png");
const videoFilter = "[0:v]format=rgba,scale=720:-2:flags=lanczos,crop=680:1280:x='13+23*t/2.57':y=0,pad=720:1280:20:0:color=0x00000000,split[forward][reverseInput];[reverseInput]reverse[reverse];[forward][reverse]concat=n=2:v=1:a=0,format=yuva420p[video]";
const posterFilter = "format=rgba,scale=720:-2:flags=lanczos,crop=680:1280:13:0,pad=720:1280:20:0:color=0x00000000";

function runFfmpeg(args) {
  const result = spawnSync("ffmpeg", args, { encoding: "utf8" });

  if (result.error?.code === "ENOENT") {
    throw new Error("FFmpeg is required to process paid ads media. Install ffmpeg and ensure it is available on PATH.");
  }

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`FFmpeg failed: ${result.stderr.trim()}`);
  }
}

function dimensions(path) {
  const result = spawnSync(
    "ffprobe",
    ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", path],
    { encoding: "utf8" },
  );

  if (result.error?.code === "ENOENT") {
    throw new Error("FFprobe is required to verify paid ads media. Install ffmpeg and ensure ffprobe is available on PATH.");
  }

  const [width, height] = (result.stdout ?? "").trim().split(",").map(Number);

  if (result.error || result.status !== 0 || !width || !height) {
    throw new Error(`Could not verify dimensions for ${path}.`);
  }

  return { width, height };
}

if (!existsSync(source) || statSync(source).size === 0) {
  throw new Error(`Paid ads source GIF is missing or empty: ${source}`);
}

runFfmpeg(["-version"]);
runFfmpeg([
  "-y",
  "-i", source,
  "-filter_complex", videoFilter,
  "-map", "[video]",
  "-c:v", "libvpx-vp9",
  "-pix_fmt", "yuva420p",
  "-auto-alt-ref", "0",
  "-crf", "34",
  "-b:v", "0",
  video,
]);
runFfmpeg(["-y", "-i", source, "-vf", posterFilter, "-frames:v", "1", "-pix_fmt", "rgba", poster]);

const videoDimensions = dimensions(video);
const posterDimensions = dimensions(poster);

if (statSync(video).size >= statSync(source).size) {
  throw new Error("Paid ads WebM must be smaller than the source GIF.");
}

console.log(
  `Generated paid ads media: ${videoDimensions.width}x${videoDimensions.height} WebM and ${posterDimensions.width}x${posterDimensions.height} poster.`,
);
