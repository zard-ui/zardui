```typescript title="vite.config.ts" copyButton showLineNumbers
/// <reference types="vitest" />

import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import analog from '@analogjs/platform';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  build: {
    target: ['es2020'],
    cssTarget: ['chrome111', 'edge111', 'firefox128', 'safari16.4'],
  },
  resolve: {
    mainFields: ['module'],
    alias: { '@': fileURLToPath(new URL('./src/app', import.meta.url)) },
  },
  plugins: [
    analog(),
    tailwindcss(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['**/*.spec.ts'],
    reporters: ['default'],
  },
}));
```
