```typescript title="vite.config.ts" copyButton showLineNumbers
import { defineConfig } from 'vite';
import analog from '@analogjs/platform';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(() => ({
  plugins: [
    analog(),
    tailwindcss(),
  ],
}));
```
