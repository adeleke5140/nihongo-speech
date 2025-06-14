/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";

// Custom plugin to copy icon files
const copyIconsPlugin = () => {
  return {
    name: "copy-icons",
    writeBundle() {
      // Copy icon files to dist
      const iconFiles = ["icon-16.png", "icon-48.png", "icon-128.png"];
      for (const file of iconFiles) {
        const src = join("public", file);
        const dest = join("dist", file);
        if (existsSync(src)) {
          copyFileSync(src, dest);
        }
      }
    },
  };
};

export default defineConfig(({ mode }) => ({
  plugins: [react(), copyIconsPlugin()],
  server: {
    open: "/popup.html",
  },
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["src/__tests__/setupTests.ts"],
    include: ["src/__tests__/**/*.test.{ts,tsx}"],
  },
  build: {
    outDir: "dist",
    minify: mode === "production" ? "esbuild" : false,
    sourcemap: mode !== "production",
    rollupOptions: {
      input: {
        popup_entry: "popup.html",
        background: "src/background/background.ts",
      },
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
    emptyOutDir: true,
  },
}));
