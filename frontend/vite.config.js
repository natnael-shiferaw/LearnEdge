import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // 1) Load .env files into process.env
  const env = loadEnv(mode, process.cwd(), "");

  // 2) Pull out your VITE_BACKEND_URL
  const backendUrl = env.VITE_BACKEND_URL;
  if (!backendUrl) {
    throw new Error("⚠️  VITE_BACKEND_URL is not defined in your .env");
  }

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path,
        },
      },
    },
  };
});
