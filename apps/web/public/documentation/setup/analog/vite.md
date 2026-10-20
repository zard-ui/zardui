```typescript title="vite.config.ts" copyButton showLineNumbers
import { defineConfig } from 'vite';
import analog from '@analogjs/platform';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(() => ({
  build: {
    target: ['es2020'],
    cssTarget: ['chrome111', 'edge111', 'firefox128', 'safari16.4'],
  },
  plugins: [
    analog(),
    tailwindcss(),
  ],
}));
```
