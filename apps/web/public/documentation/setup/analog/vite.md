```typescript title="vite.config.ts" copyButton showLineNumbers
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import analog from '@analogjs/platform';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(() => ({
  build: {
    target: ['es2020'],
    cssTarget: ['chrome111', 'edge111', 'firefox128', 'safari16.4'],
  },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src/app', import.meta.url)) },
  },
  plugins: [
    analog(),
    tailwindcss(),
  ],
}));
```
