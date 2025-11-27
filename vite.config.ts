import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "node16",
    outDir: "dist",
    rollupOptions: {
      external: ["bcrypt", "jsonwebtoken", "express", "dotenv"]
    }
  }
});