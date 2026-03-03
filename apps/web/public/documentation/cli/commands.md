## Commands

Initialize your project and install dependencies for ZardUI components.

**Usage:**

```bash
npx zard-cli init
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
  npx zard-cli add [component]
```

### add

Add components to your project with automatic dependency management.

**Usage:**

```bash tab="npm" copyButton
npx zard-cli add [components...]
```

```bash tab="pnpm" copyButton
pnpm dlx zard-cli add [components...]
```

```bash tab="yarn" copyButton
yarn zard-cli add [components...]
```

```bash tab="bun" copyButton
bunx zard-cli add [components...]
```

**Options:**

```
`-y, --yes` - Skip confirmation prompts
`-o, --overwrite` - Overwrite existing files
`-a, --all` - Add all available components
```

**Examples:**

```bash tab="npm" copyButton
npx zard-cli add button
```

```bash tab="pnpm" copyButton
pnpm dlx zard-cli add button
```

```bash tab="yarn" copyButton
yarn zard-cli add button
```

```bash tab="bun" copyButton
bunx zard-cli add button
```

Add multiple components:

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

Add all available components:

```bash tab="npm" copyButton
npx zard-cli add --all
```

```bash tab="pnpm" copyButton
pnpm dlx zard-cli add --all
```

```bash tab="yarn" copyButton
yarn zard-cli add --all
```

```bash tab="bun" copyButton
bunx zard-cli add --all
```

Interactive component selection:

```bash tab="npm" copyButton
npx zard-cli add
```

```bash tab="pnpm" copyButton
pnpm dlx zard-cli add
```

```bash tab="yarn" copyButton
yarn zard-cli add
```

```bash tab="bun" copyButton
bunx zard-cli add
```
