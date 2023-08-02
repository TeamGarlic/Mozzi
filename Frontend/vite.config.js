import { defineConfig } from "vite";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import mediapipe_import from './mediapipeVite.js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mediapipe_import(),],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
