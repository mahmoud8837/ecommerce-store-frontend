
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api/": "https://e-commerce-store-backend-eta.vercel.app",
      "/uploads/": "https://e-commerce-store-backend-eta.vercel.app",
    },
  },
});
