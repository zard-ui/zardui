## Commands

Initialize your project and install dependencies for ZardUI components.

**Usage:**

```bash
npx @ngzard/ui init
```

**Options:**

```
`-y, --yes` - Skip confirmation prompts
```

**Interactive Setup:**

When you run the init command, you'll be guided through the following prompts:

```bash
✔ Choose a theme for your components: › Neutral (Default)
✔ Where is your global CSS file? … src/styles.css
✔ Configure the import alias for components: … src/app/shared/components
✔ Configure the import alias for utils: … src/app/shared/utils
✔ Write configuration to components.json? … yes
```

After answering the prompts, the CLI will:

```bash
✔ Writing configuration...
✔ Installing dependencies...
✔ Setting up Tailwind CSS...
✔ Creating utils...
✔ Updating tsconfig.json...

ZardUI has been initialized successfully!

You can now add components using:
  npx @ngzard/ui add [component]
```

### add

Add components to your project with automatic dependency management.

**Usage:**

```bash tab="npm" copyButton
npx @ngzard/ui add [components...]
```

```bash tab="pnpm" copyButton
pnpm dlx @ngzard/ui add [components...]
```

```bash tab="yarn" copyButton
yarn @ngzard/ui add [components...]
```

```bash tab="bun" copyButton
bunx @ngzard/ui add [components...]
```

**Options:**

```
`-y, --yes` - Skip confirmation prompts
`-o, --overwrite` - Overwrite existing files
`-a, --all` - Add all available components
```

**Examples:**

```bash tab="npm" copyButton
npx @ngzard/ui add button
```

```bash tab="pnpm" copyButton
pnpm dlx @ngzard/ui add button
```

```bash tab="yarn" copyButton
yarn @ngzard/ui add button
```

```bash tab="bun" copyButton
bunx @ngzard/ui add button
```

Add multiple components:

```bash tab="npm" copyButton
npx @ngzard/ui add button card dialog
```

```bash tab="pnpm" copyButton
pnpm dlx @ngzard/ui add button card dialog
```

```bash tab="yarn" copyButton
yarn @ngzard/ui add button card dialog
```

```bash tab="bun" copyButton
bunx @ngzard/ui add button card dialog
```

Add all available components:

```bash tab="npm" copyButton
npx @ngzard/ui add --all
```

```bash tab="pnpm" copyButton
pnpm dlx @ngzard/ui add --all
```

```bash tab="yarn" copyButton
yarn @ngzard/ui add --all
```

```bash tab="bun" copyButton
bunx @ngzard/ui add --all
```

Interactive component selection:

```bash tab="npm" copyButton
npx @ngzard/ui add
```

```bash tab="pnpm" copyButton
pnpm dlx @ngzard/ui add
```

```bash tab="yarn" copyButton
yarn @ngzard/ui add
```

```bash tab="bun" copyButton
bunx @ngzard/ui add
```
