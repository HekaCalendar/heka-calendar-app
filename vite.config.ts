import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// NOTE: We're NOT using vite-plugin-pwa because we need manual control
// The service worker is in public/sw.js and registered manually

export default defineConfig({
  plugins: [
    react(),
    // No PWA plugin - we handle SW manually for better update control
  ],
  server: { 
    port: 3000, 
    strictPort: true, 
    host: '127.0.0.1',
    fs: {
      allow: ['..'] // Allow access to node_modules for WASM
    }
  },
  build: {
    outDir: 'dist2',
    sourcemap: true,
    rollupOptions: {
      output: {
        // Content hashing for cache busting
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
  assetsInclude: ['**/*.wasm'],
  optimizeDeps: {
    exclude: ['swisseph-wasm'] // Don't pre-bundle Swiss Ephemeris
  }
});
