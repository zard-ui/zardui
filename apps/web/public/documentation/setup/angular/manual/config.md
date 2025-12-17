```json title="components.json" showLineNumbers copyButton
{
  "$schema": "https://zardui.com/schema.json",
  "style": "css",
  "appConfigFile": "src/app/app.config.ts",
  "packageManager": "npm", // npm, pnpm, yarn or bun
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
