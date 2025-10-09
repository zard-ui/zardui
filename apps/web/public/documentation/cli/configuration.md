## Configuration

The CLI stores configuration in `components.json` in your project root. This file is created automatically when you run `npx @ngzard/ui init`.

### Default Configuration

```json title="components.json" copyButton
{
  "style": "css",
  "packageManager": "npm",
  "tailwind": {
    "css": "src/styles.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "src/app/shared/components",
    "utils": "src/app/shared/utils"
  }
}
```

### TypeScript Path Mappings

The CLI automatically configures TypeScript path mappings in your `tsconfig.json`:

```json title="tsconfig.json" copyButton
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@shared/*": ["src/app/shared/*"]
    }
  }
}
```

This allows you to import components and utilities using clean paths:

```typescript title="example.component.ts" copyButton
import { ButtonComponent } from '@shared/components/button';
import { mergeClasses } from '@shared/utils/merge-classes';
```
