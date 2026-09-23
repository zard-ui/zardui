```bash tab="npm" copyButton
npx zard-cli@latest init --type nx --project web
```

```bash tab="pnpm" copyButton
pnpm dlx zard-cli@latest init --type nx --project web
```

```bash tab="yarn" copyButton
yarn zard-cli@latest init --type nx --project web
```

```bash tab="bun" copyButton
bunx zard-cli@latest init --type nx --project web
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
```

```json title="tsconfig.base.json" showLineNumbers copyButton
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./apps/web/src/app/*"]
    }
  }
}
```

```json title="apps/web/.postcssrc.json" copyButton
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```
