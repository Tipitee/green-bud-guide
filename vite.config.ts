import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    target: 'esnext',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: false,
      mangle: false,
      format: { comments: false },
    },
    cssMinify: false,
    rollupOptions: {
      external: ['maplibre-gl'],
      output: {
        globals: { 'maplibre-gl': 'maplibregl' },
      },
    },
  },
}));