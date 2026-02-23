import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import VueDevTools from "vite-plugin-vue-devtools";
import { fileURLToPath } from "url";

export default defineConfig({
  plugins: [vue(), tailwindcss(), VueDevTools()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
