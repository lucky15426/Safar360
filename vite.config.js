import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "/", // ← Add this explicitly
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 3000,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:1337",
        changeOrigin: true,
        secure: false,
      },
      "/graphql": {
        target: "http://localhost:1337",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["lucide-react", "framer-motion"],
        },
      },
    },
  },
});
