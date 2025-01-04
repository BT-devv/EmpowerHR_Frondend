import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    assetsInclude: ["**/*.ttf"], // Bao gồm font file trong build
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Đảm bảo đúng alias nếu có
    },
  },
});
