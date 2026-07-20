---
title: CLI
description: Use the ZardUI CLI to add beautiful, accessible components to your Angular project with a single command.
---

# CLI

Use the ZardUI CLI to add beautiful, accessible components to your Angular project with a single command.

## Installation

Get ZardUI up and running in your Angular project with these simple steps.

### Step 1: Initialize your project

Run the init command to set up ZardUI in your Angular project. This will configure Tailwind CSS, install dependencies, and create necessary utility files.

```
npx zard-cli init
```

The init command will guide you through an interactive setup:

terminal

```
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

```
npx zard-cli add button card dialog
```

Expected output:

```
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

app.component.ts

```
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

## Commands

Initialize your project and install dependencies for ZardUI components.

**Usage:**

```
npx zard-cli init
```

**Options:**

`-y, --yes` - Skip confirmation prompts

**Interactive Setup:**

When you run the init command, you'll be guided through the following prompts:

```
✔ Choose a theme for your components: › Neutral (Default)
✔ Where is your global CSS file? … src/styles.css
✔ Configure the import alias for components: … src/app/shared/components
✔ Configure the import alias for utils: … src/app/shared/utils
✔ Write configuration to components.json? … yes
```

After answering the prompts, the CLI will:

```
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

```
npx zard-cli add [components...]
```

**Options:**

`-y, --yes` - Skip confirmation prompts
`-o, --overwrite` - Overwrite existing files
`-a, --all` - Add all available components

**Examples:**

```
npx zard-cli add button
```

Add multiple components:

```
npx zard-cli add button card dialog
```

Add all available components:

```
npx zard-cli add --all
```

Interactive component selection:

```
npx zard-cli add
```

## Update

Update components in your project while preserving your customizations.

Coming Soon

The ZardUI team is actively working on an intelligent update system that will automatically update your components without compromising the custom rules and modifications you've implemented. This is an extremely complex solution that requires careful design to ensure your customizations remain intact. We appreciate your patience as we develop this feature to provide the best possible experience.

### Planned Features

- 🔄Smart detection of component changes Automatically identify which components have updates available
- 🛡️Preservation of user customizations Keep your custom modifications safe during updates
- 📊Conflict resolution with clear options Visual diff and merge tools to handle conflicts intelligently
- 🎯Selective component updates Choose which components to update and which to skip
- 📝Detailed changelog for each update See exactly what changed in each component version

### What to Expect

When the update command becomes available, it will intelligently analyze your components, detect differences from the latest versions, and offer safe update options that respect your modifications. The system will provide clear visual diffs and allow you to review changes before applying them.

Stay updated:

- [Changelog](/docs/changelog)
- [GitHub Repository](https://github.com/zard-ui/zardui)

## Configuration

The CLI stores configuration in `components.json` in your project root. This file is created automatically when you run `npx zard-cli init` .

### Default Configuration

components.json

```
{
  "style": "css",
  "packageManager": "npm",
  "tailwind": {
    "css": "src/styles.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "src/app/shared/components",
    "utils": "src/app/shared/utils"
  }
}
```

### TypeScript Path Mappings

The CLI automatically configures TypeScript path mappings in your `tsconfig.json` :

tsconfig.json

```
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/shared/*": ["src/app/shared/*"]
    }
  }
}
```

This allows you to import components and utilities using clean paths:

example.component.ts

```
import { ButtonComponent } from '@/shared/components/button';
import { mergeClasses } from '@/shared/utils/merge-classes';
```
