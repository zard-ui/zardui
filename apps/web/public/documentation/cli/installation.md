## Installation

Get ZardUI up and running in your Angular project with these simple steps.

### Step 1: Initialize your project

Run the init command to set up ZardUI in your Angular project. This will configure Tailwind CSS, install dependencies, and create necessary utility files.

```bash tab="npm" copyButton
npx @ngzard/ui init
```

```bash tab="pnpm" copyButton
pnpm dlx @ngzard/ui init
```

```bash tab="yarn" copyButton
yarn @ngzard/ui init
```

```bash tab="bun" copyButton
bunx @ngzard/ui init
```

The init command will guide you through an interactive setup:

```bash title="terminal"
✔ Choose a theme for your components: › Neutral (Default)
✔ Where is your global CSS file? src/styles.css
✔ Configure the import alias for components: src/app/shared/components
✔ Configure the import alias for utils: src/app/shared/utils
✔ Write configuration to components.json? yes
✔ Writing configuration...
✔ Installing dependencies...
✔ Setting up Tailwind CSS...
✔ Creating utils...
✔ Updating tsconfig.json...

ZardUI has been initialized successfully!

You can now add components using:
  npx @ngzard/ui add [component]
```

### Step 2: Add components

Start adding components to your project. You can add individual components, multiple components at once, or all available components.

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

Expected output:

```bash
✓ Ready to install 3 component(s) and 0 dependencies. Proceed? … yes
✓ Installing dependencies...
✓ Added button
✓ Added card
✓ Added dialog
✓ Done!
```

### Step 3: Import and use

Import the components in your Angular modules or standalone components and start using them in your templates.

```typescript title="app.component.ts" copyButton
import { ButtonComponent } from '@shared/components/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ButtonComponent],
  template: `<z-button>Click me</z-button>`,
})
export class AppComponent {}
```
