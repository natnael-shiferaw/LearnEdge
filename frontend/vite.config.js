import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // forward all /api/* requests to your backend workspace
      '/api': {
        target: import.meta.env.VITE_BACKEND_URL,  
        changeOrigin: true,
        secure: false,
        // strip nothing—so /api/auth/register → /api/auth/register
        rewrite: (path) => path
      },
    },
  },

})
