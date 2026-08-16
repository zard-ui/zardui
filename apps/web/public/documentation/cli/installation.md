```bash tab="npm" copyButton
npx zard-cli@latest init
```

```bash tab="pnpm" copyButton
pnpm dlx zard-cli@latest init
```

```bash tab="yarn" copyButton
yarn zard-cli@latest init
```

```bash tab="bun" copyButton
bunx zard-cli@latest init
```

```bash title="Terminal"
◇ zard/ui · initialize
  Setting up zard/ui in your project…

◆  What are you setting up?
   ❯  Angular           Application — providers in app.config.ts, tokens in the global CSS.
      Angular Library   Publishable library — components ship with it, no app providers.
      Nx                Application inside an Nx workspace — paths go to tsconfig.base.json.
      Nx Library        Library inside an Nx workspace — lives in libs/, no app providers.
      Analog.js         Vite-powered Angular app — Tailwind is a Vite plugin, not PostCSS.
   Decides where the components live and what init has to configure.

   ↑/↓ choose    enter confirm    esc back
```

```bash title="Terminal"
   ✔  project type  …  Nx
   ✔  app           …  web

◆  Where is your app.config.ts file?
   › apps/web/src/app/app.config.ts
   zard/ui registers its global providers in this file.

   enter confirm    ⌫ edit    esc back
```

```bash title="Terminal"
✔  Writing configuration…

   ✔  components.json                 —  component & utils aliases
   ✔  dependencies                    —  CDK, CVA, tailwind-merge, ng-icons (Lucide)
   ✔  apps/web/src/app/app.config.ts  —  zard/ui providers
   ✔  apps/web/.postcssrc.json        —  Tailwind PostCSS plugin
   ✔  apps/web/src/styles.css         —  theme tokens (neutral)
   ✔  tsconfig.base.json              —  import path aliases
   ✔  core & utils                    —  shared helpers used by every component

   ████████████████████████████████████████  100%

   ╭───────────────────────────────────────────────╮
   │ ✔  zard/ui has been initialized successfully!  │
   ╰───────────────────────────────────────────────╯
```

```bash tab="npm" copyButton
npx zard-cli add button card dialog
```

```bash tab="pnpm" copyButton
pnpm dlx zard-cli add button card dialog
```

```bash tab="yarn" copyButton
yarn zard-cli add button card dialog
```

```bash tab="bun" copyButton
bunx zard-cli add button card dialog
```

```angular-ts title="app.component.ts" copyButton showLineNumbers
import { Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';

@Component({
  selector: 'app-root',
  imports: [ZardButtonComponent],
  template: `
    <z-button>Click me</z-button>
  `,
})
export class AppComponent {}
```
