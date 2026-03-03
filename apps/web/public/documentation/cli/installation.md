## Installation

Get ZardUI up and running in your Angular project with these simple steps.

### Step 1: Initialize your project

Run the init command to set up ZardUI in your Angular project. This will configure Tailwind CSS, install dependencies, and create necessary utility files.

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

The init command will guide you through an interactive setup:

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

### Step 2: Add components

Start adding components to your project. You can add individual components, multiple components at once, or all available components.

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

Expected output:

```bash
✔ Ready to install 5 component(s) and 0 dependencies. Proceed? … yes
✔ Added button
✔ Added core
✔ Added icon
✔ Added card
✔ Added dialog

Done!
```

### Step 3: Import and use

Import the components in your Angular modules or standalone components and start using them in your templates.

```typescript title="app.component.ts" copyButton
import { ButtonComponent } from '@/shared/components/button';

@Component({
  selector: 'app-root',
  imports: [ButtonComponent],
  template: `
    <z-button>Click me</z-button>
  `,
})
export class AppComponent {}
```
