```json title="components.json" showLineNumbers copyButton
{
  "$schema": "https://zardui.com/schema.json",
  "style": "css",
  "icons": "lucide",
  "rtl": false,
  "projectType": "angular",
  "appConfigFile": "src/app/app.config.ts",
  "packageManager": "npm",
  "tailwind": {
    "css": "src/styles.css",
    "baseColor": "neutral"
  },
  "baseUrl": "src/app",
  "aliases": {
    "components": "@/shared/components",
    "utils": "@/shared/utils",
    "core": "@/shared/core",
    "services": "@/shared/services"
  }
}
```

```json title="tsconfig.json" copyButton showLineNumbers
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/app/*"]
    }
  }
}
```

```angular-ts title="example.component.ts" copyButton
import { ZardButtonComponent } from '@/shared/components/button';
import { mergeClasses } from '@/shared/utils/merge-classes';
```

```json title="components.json" copyButton
{
  "registryUrl": "https://registry.acme.dev/r"
}
```
