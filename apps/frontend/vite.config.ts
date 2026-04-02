import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "icon-192.svg", "icon-512.svg"],
      manifest: {
        name: "Cliniq AI",
        short_name: "Cliniq AI",
        description:
          "AI-assisted triage and consultation workspace for symptom intake, urgency stratification, and clinical note generation.",
        theme_color: "#0e7490",
        background_color: "#f4fbfb",
        display: "standalone",
        start_url: "./",
        icons: [
          {
            src: "./icon-192.svg",
            sizes: "192x192",
            type: "image/svg+xml",
            purpose: "any"
          },
          {
            src: "./icon-512.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "any"
          }
        ]
      }
    })
  ]
});
