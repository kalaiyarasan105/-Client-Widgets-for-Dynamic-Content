import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@datumart/react-widgets": path.resolve(
        __dirname,
        "../../packages/react-widgets/src/index.ts"
      ),
    },
  },
  server: {
    port: 5174,
    // Serve mock data from the root mock/ folder
    fs: {
      allow: ["../.."],
    },
  },
  // Make /mock/widgets.json available as a static asset
  publicDir: "../../mock",
});
