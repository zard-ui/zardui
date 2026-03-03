## Overview

The ZardUI CLI is your gateway to beautiful Angular components. With just one command, you can add professionally designed, fully accessible components to your project.

```bash tab="npm" copyButton
npx zard-cli init
```

```bash tab="pnpm" copyButton
pnpm dlx zard-cli init
```

```bash tab="yarn" copyButton
yarn zard-cli init
```

```bash tab="bun" copyButton
bunx zard-cli init
```

This command will guide you through an interactive setup:

```bash title="terminal"
Initializing ZardUI...


✔ Where is your app.config.ts file? … src/app/app.config.ts
✔ Where is your index.html file? … src/index.html
✔ Choose a theme for your components: › Neutral (Default)
✔ Where is your global CSS file? … src/styles.css
✔ Configure the import alias for components: … src/app/shared/components
✔ Configure the import alias for utils: … src/app/shared/utils
✔ Your CSS file already has content. This will overwrite everything with ZardUI theme configuration. Continue? … yes
✔ Write configuration to components.json? … yes
✔ Writing configuration...

ZardUI has been initialized successfully!

You can now add components using:
  npx zard-cli add [component]
```

**One-Command Setup**
Get started instantly with automated project configuration, dependency installation, and Tailwind CSS setup.

**Smart Integration**  
Automatically configures TypeScript paths, creates utility functions, and integrates seamlessly with your Angular project.

**Modern Toolchain**
Built for Tailwind CSS v4, Angular 19+, and modern development practices with full TypeScript support.
