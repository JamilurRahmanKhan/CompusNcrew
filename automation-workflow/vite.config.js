import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  root: resolve(import.meta.dirname),
  base: "/ai-automation-app/",
  build: {
    outDir: resolve(import.meta.dirname, "../public/ai-automation-app"),
    emptyOutDir: true,
  },
});
