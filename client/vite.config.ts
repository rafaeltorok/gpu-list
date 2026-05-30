import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const serverUrl = process.env.VITE_SERVER_URL || "http://localhost:3001";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: serverUrl,
        changeOrigin: true,
      },
    },
  },
});
