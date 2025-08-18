## Installation

Get ZardUI up and running in your Angular project with these simple steps.

### Step 1: Initialize your project

Run the init command to set up ZardUI in your Angular project. This will configure Tailwind CSS, install dependencies, and create necessary utility files.

```bash title="Terminal" copyButton
npx @ngzard/ui init
```

Expected output:
```
✓ Writing configuration...
✓ Installing dependencies...
✓ Setting up Tailwind CSS...
✓ Creating utils...
✓ Updating tsconfig.json...
✓ ZardUI has been initialized successfully!
```

### Step 2: Add components

Start adding components to your project. You can add individual components, multiple components at once, or all available components.

```bash title="Terminal" copyButton
npx @ngzard/ui add button card dialog
```

Expected output:
```
✓ Ready to install 3 component(s) and 2 dependencies. Proceed? … yes
✓ Installing dependencies...
✓ Added button
✓ Added card
✓ Added dialog
✓ Done!
```

### Step 3: Import and use

Import the components in your Angular modules or standalone components and start using them in your templates.

```typescript title="app.component.ts" copyButton
import { ZardButtonComponent } from '@shared/components/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ZardButtonComponent],
  template: `<z-button>Click me</z-button>`,
})
export class AppComponent {}
```