# Installation

The utilities are their own registry item, separate from `core`, so they are not installed with it. Add
them when you want `scroll-fade` or `shimmer`; a component that uses them, such as `attachment`, brings
them along when you install it.

```bash tab="npm" copyButton
npx zard-cli add utilities
```

```bash tab="pnpm" copyButton
pnpm dlx zard-cli add utilities
```

```bash tab="yarn" copyButton
yarn dlx zard-cli add utilities
```

```bash tab="bun" copyButton
bunx zard-cli add utilities
```

The file lands next to your global stylesheet and the CLI adds the `@import` for it, after the ones
already there.

```css title="src/styles.css" copyButton
@import 'tailwindcss';
@import './app/shared/core/css/zard';
@import './utilities.css';
```
