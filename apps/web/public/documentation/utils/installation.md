# Installation

The utilities live in the `core` registry item, alongside the rest of the library's global stylesheet.
Refresh it to pull them into an existing project.

```bash tab="npm" copyButton
npx zard-cli add core --overwrite
```

```bash tab="pnpm" copyButton
pnpm dlx zard-cli add core --overwrite
```

```bash tab="yarn" copyButton
yarn dlx zard-cli add core --overwrite
```

```bash tab="bun" copyButton
bunx zard-cli add core --overwrite
```

The classes are available as soon as that stylesheet is imported after Tailwind.

```css title="src/styles.css" copyButton
@import 'tailwindcss';
@import './app/shared/core/css/tailwind.css';
```
