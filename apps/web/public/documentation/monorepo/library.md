```bash tab="npm" copyButton
npx zard-cli@latest init --type nx-library --project ui
```

```bash tab="pnpm" copyButton
pnpm dlx zard-cli@latest init --type nx-library --project ui
```

```bash tab="yarn" copyButton
yarn zard-cli@latest init --type nx-library --project ui
```

```bash tab="bun" copyButton
bunx zard-cli@latest init --type nx-library --project ui
```

```json title="components.json" showLineNumbers copyButton
{
  "$schema": "https://zardui.com/schema.json",
  "style": "css",
  "icons": "lucide",
  "rtl": false,
  "projectType": "nx-library",
  "appConfigFile": "",
  "packageManager": "npm",
  "tailwind": {
    "css": "libs/ui/src/styles.css",
    "baseColor": "neutral"
  },
  "baseUrl": "libs/ui/src/lib",
  "aliases": {
    "components": "@/shared/components",
    "utils": "@/shared/utils",
    "core": "@/shared/core",
    "services": "@/shared/services"
  }
}
```

```json title="libs/ui/ng-package.json" copyButton
{
  "dest": "../../dist/libs/ui",
  "lib": {
    "entryFile": "src/index.ts"
  },
  "assets": [{ "glob": "styles.css", "input": "src", "output": "/" }]
}
```

```ts title="libs/ui/src/index.ts" copyButton
export * from './lib/shared/core';
export * from './lib/shared/components/button';
```

```angular-ts title="apps/web/src/app/app.config.ts" copyButton showLineNumbers
import { ApplicationConfig } from '@angular/core';

import { provideZard } from '@acme/ui';

export const appConfig: ApplicationConfig = {
  providers: [provideZard()],
};
```

```css title="apps/web/src/styles.css" copyButton
@import '@acme/ui/styles.css';
```
