import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'));
const APP_VERSION = pkg.version;
const FIREBASE_VERSION = pkg.dependencies?.firebase?.replace(/^[^0-9]+/, '') || '12.9.0';

// NOTE: We're NOT using vite-plugin-pwa because we need manual control
// The service worker is in public/sw.js and registered manually

/**
 * Remove dead-weight assets from the dist folder after the build copies public/.
 * pdf.worker.min.mjs is unused because PDFPreview is dead code.
 * (public/locales no longer exists; src/i18n/locales is loaded via Vite chunks.)
 */
function excludeDeadAssetsPlugin() {
  return {
    name: 'exclude-dead-assets',
    writeBundle() {
      const outDir = path.resolve(__dirname, 'dist');
      const localesDir = path.join(outDir, 'locales');
      const pdfWorker = path.join(outDir, 'pdf.worker.min.mjs');
      if (fs.existsSync(localesDir)) {
        fs.rmSync(localesDir, { recursive: true, force: true });
        console.log('[vite] excluded dead weight: dist/locales');
      }
      if (fs.existsSync(pdfWorker)) {
        fs.rmSync(pdfWorker, { force: true });
        console.log('[vite] excluded dead weight: dist/pdf.worker.min.mjs');
      }
    },
  };
}

/**
 * Inject a single source of truth for app and Firebase versions.
 * Replaces %APP_VERSION% / %FIREBASE_VERSION% in index.html and in copied public SW files.
 */
function injectVersionPlugin() {
  return {
    name: 'inject-version',
    transformIndexHtml(html: string, ctx?: { bundle?: Record<string, { fileName?: string; name?: string }> }) {
      let result = html
        .replace(/%APP_VERSION%/g, APP_VERSION)
        .replace(/%FIREBASE_VERSION%/g, FIREBASE_VERSION);

      // Preload the English translation chunk since it is always loaded as the fallback.
      const bundle = ctx?.bundle;
      if (bundle) {
        const enChunk = Object.values(bundle).find(
          (asset) => asset.fileName?.startsWith('assets/translations-en-') && asset.fileName?.endsWith('.js')
        );
        if (enChunk?.fileName) {
          // Use a relative path so the preload works both in dev (/) and when
          // deployed under a sub-path such as /app/.
          const preload = `<link rel="preload" as="script" href="./${enChunk.fileName}" crossorigin="anonymous" />\n  `;
          result = result.replace(/<title>/, preload + '<title>');
        }
      }

      return result;
    },
    writeBundle() {
      const outDir = path.resolve(__dirname, 'dist');
      const files = ['sw.js', 'firebase-messaging-sw.js'];
      for (const file of files) {
        const filePath = path.join(outDir, file);
        if (fs.existsSync(filePath)) {
          let content = fs.readFileSync(filePath, 'utf-8');
          content = content
            .replace(/%APP_VERSION%/g, APP_VERSION)
            .replace(/%FIREBASE_VERSION%/g, FIREBASE_VERSION);
          fs.writeFileSync(filePath, content);
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    excludeDeadAssetsPlugin(),
    injectVersionPlugin(),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(APP_VERSION),
  },
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
          // Translations — split by language so only the active language is downloaded
          if (id.includes('/src/i18n/locales/')) {
            const match = id.match(/\/src\/i18n\/locales\/([^/]+)\//);
            return match ? `translations-${match[1]}` : 'translations';
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
