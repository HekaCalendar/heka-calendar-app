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
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        // Content hashing for cache busting
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        // Code splitting: separate vendor libs from app code
        manualChunks(id) {
          // NOTE: React + react-dom + scheduler are intentionally kept
          // in the main entry chunk. They must execute first before any
          // library calls React.createContext(). Splitting them out creates
          // circular chunk dependencies that crash the app at runtime.

          // Firebase — large, self-contained, does NOT import React
          if (id.includes('node_modules/firebase/') || id.includes('node_modules/@firebase/')) {
            return 'vendor-firebase';
          }
          // PDF generation — large, self-contained
          if (id.includes('node_modules/jspdf/') || id.includes('node_modules/html2canvas/')) {
            return 'vendor-pdf';
          }
          // Charts — imports React (from main chunk), safe because main is entry point
          if (id.includes('node_modules/recharts/')) {
            return 'vendor-charts';
          }
          // Date utilities — self-contained
          if (id.includes('node_modules/date-fns/')) {
            return 'vendor-dates';
          }
          // Swiss Ephemeris — self-contained WASM
          if (id.includes('node_modules/swisseph-wasm/')) {
            return 'vendor-astro';
          }
          // Capacitor plugins — self-contained native bridge code
          if (id.includes('node_modules/@capacitor/')) {
            return 'vendor-capacitor';
          }
          // Translations (30 languages × 14 namespaces = ~390 files)
          if (id.includes('/src/i18n/locales/')) {
            return 'translations';
          }
          // Do NOT create a catch-all "vendor-other" chunk.
          // It creates circular dependencies with every other chunk,
          // causing "Cannot read properties of undefined (reading 'createContext')"
          // at runtime. Remaining node_modules stay in their importing chunk.
        },
      },
    },
  },
  assetsInclude: ['**/*.wasm'],
  optimizeDeps: {
    exclude: ['swisseph-wasm'] // Don't pre-bundle Swiss Ephemeris
  }
});
