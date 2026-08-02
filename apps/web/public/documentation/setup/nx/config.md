```json title="components.json" showLineNumbers copyButton
{
  "$schema": "https://zardui.com/schema.json",
  "style": "css",
  "projectType": "nx",
  "appConfigFile": "apps/my-app/src/app/app.config.ts",
  "packageManager": "npm",
  "tailwind": {
    "css": "apps/my-app/src/styles.css",
    "baseColor": "neutral"
  },
  "baseUrl": "apps/my-app/src/app",
  "aliases": {
    "components": "@/shared/components",
    "utils": "@/shared/utils",
    "core": "@/shared/core",
    "services": "@/shared/services"
  }
}
```
