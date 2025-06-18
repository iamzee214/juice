import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// Load environment variables based on the NODE_ENV
require("dotenv").config({ path: `${process.env.NODE_ENV}.env` });

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 8080,
  },
  preview: {
    allowedHosts: ["Juice3.io", "app.growwithjuice.io"],
  },
  plugins: [vue(), nodePolyfills()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  define: {
    // Use Vite's built-in define option to set global constants
    __API_URL__: JSON.stringify(process.env.API_URL),
  },
  // If necessary, you can also add additional Rollup options here for further configuration.
});
