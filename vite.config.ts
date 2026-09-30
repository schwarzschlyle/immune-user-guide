import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// A relative base plus hash routing lets the built site run from any path, such as a GitHub Pages project site.
export default defineConfig({
  base: "./",
  plugins: [react()],
});
