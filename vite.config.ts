import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    // three.js must stay out of the entry graph: it is reached only through the
    // dynamic import in Hero.tsx, and most visitors (phones, weak GPUs, reduced
    // motion) never load it at all.
    //
    // Deliberately NOT using manualChunks here. Forcing three into a named chunk
    // makes Rollup treat it as a static import of the entry, and Vite then emits
    // a <link rel="modulepreload"> for it — every visitor downloads ~325 KB gzip
    // before first paint, silently undoing the lazy load. Vite's default
    // dynamic-import splitting already isolates it and preloads it only when the
    // scene is actually requested.
    chunkSizeWarningLimit: 1200,
  },
});
