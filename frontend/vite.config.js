import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // écoute toutes les interfaces réseau
    port: 5173,      // port stable
    strictPort: true // évite le changement automatique de port
  },
});
