import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/logs": "http://localhost:8000",
      "/anomalies": "http://localhost:8000",
    },
  },
});
