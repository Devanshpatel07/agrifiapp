import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    define: {
      "process.env.ANCHOR_BROWSER": "true",
      global: "globalThis",
    },
    optimizeDeps: {
      esbuildOptions: {
        define: { global: "globalThis" },
      },
    },
  },
});
