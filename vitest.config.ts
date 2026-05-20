import { defineConfig } from 'vitest/config';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    exclude: ['node_modules', 'e2e', 'dist', 'dist2', 'dist3'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['src/**/*.d.ts', 'src/main.tsx'],
      thresholds: {
        lines: 20,
        functions: 40,
        branches: 70,
      },
    },
  },
});
