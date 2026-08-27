# Installation

The utilities live in `css/utilities.css`, their own file inside the `core` registry item, apart from the
theme tokens and the custom variants. Refresh the item to pull them into an existing project.

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

`css/tailwind.css` imports the file on its first line, so nothing changes in the global stylesheet — the
classes are available as soon as it is imported after Tailwind.

```css title="src/styles.css" copyButton
@import 'tailwindcss';
@import './app/shared/core/css/tailwind';
```
