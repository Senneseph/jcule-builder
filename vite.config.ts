import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  esbuild: {
    // Enable JSX/TSX support without React
    jsx: 'transform',
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  }
});
