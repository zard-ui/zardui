# @zard/cli

A command line interface for adding ZardUI components to your Angular projects.

## Installation

```bash
npm install -g @zard/cli
```

## Usage

Use the `zard` command to add components to your Angular project:

```bash
# Initialize your project
zard init

# Add components to your project
zard add button
zard add button card dialog

# Add all components
zard add --all
```

## Commands

### `init`

Initialize your project and install dependencies for ZardUI components.

```bash
zard init
```

This will:
- Install required dependencies (Tailwind CSS v4, class-variance-authority, etc.)
- Create `.postcssrc.json` for Tailwind CSS PostCSS plugin
- Set up `src/styles.css` with Tailwind configuration and design tokens
- Configure TypeScript path mappings in `tsconfig.json`
- Create utility functions in `src/app/shared/utils/`

**Options:**
- `-y, --yes` - Skip confirmation prompts
- `-c, --cwd <path>` - Specify working directory

### `add`

Add components to your project.

```bash
zard add [components...]
```

**Examples:**
```bash
# Add a single component
zard add button

# Add multiple components
zard add button card badge

# Add all components
zard add --all

# Interactive selection
zard add
```

**Options:**
- `-y, --yes` - Skip confirmation prompts
- `-o, --overwrite` - Overwrite existing files
- `-c, --cwd <path>` - Specify working directory
- `-a, --all` - Add all available components
- `-p, --path <path>` - Custom path for components

## Available Components

- `accordion` - Collapsible content panels
- `alert` - Alert messages with variants
- `avatar` - User profile pictures with fallbacks
- `badge` - Small status indicators
- `breadcrumb` - Navigation breadcrumbs
- `button` - Interactive buttons with variants
- `card` - Content containers
- `checkbox` - Form checkboxes
- `dialog` - Modal dialogs
- `divider` - Visual separators
- `dropdown` - Dropdown menus
- `input` - Form inputs
- `loader` - Loading indicators
- `progress-bar` - Progress indicators
- `radio` - Radio button inputs
- `select` - Select dropdowns
- `slider` - Range sliders
- `switch` - Toggle switches
- `tabs` - Tabbed interfaces
- `toggle` - Toggle buttons
- `tooltip` - Hover tooltips

## Configuration

The CLI stores configuration in `zard.config.json`:

```json
{
  "style": "css",
  "tsx": false,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/styles.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "src/app/shared/components",
    "utils": "src/app/shared/utils"
  }
}
```

## Requirements

- Angular 17+ 
- Node.js 20 or 22
- TypeScript project

## Path Mappings

The CLI automatically configures TypeScript path mappings in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@shared/*": ["src/app/shared/*"]
    }
  }
}
```

This allows you to import components and utilities using clean paths:

```typescript
import { ZardButtonComponent } from '@shared/components/button';
import { mergeClasses } from '@shared/utils/merge-classes';
```

## Tailwind CSS v4 Support

ZardUI CLI is built specifically for Tailwind CSS v4, using the new inline configuration approach:

- No `tailwind.config.js` needed
- Configuration via `.postcssrc.json`
- Design tokens defined in CSS with `@theme`
- Plugin configuration with `@plugin`

## Troubleshooting

### "Configuration not found"
Run `zard init` first to initialize your project.

### "Not an Angular project"
Make sure you're in the root directory of an Angular project with a `package.json` that includes `@angular/core`.

### Rate limiting from GitHub
The CLI fetches components from GitHub. If you encounter rate limiting, wait a few minutes before retrying.

## Contributing

This CLI is part of the [ZardUI](https://github.com/zard-ui/zardui) project. Please refer to the main repository for contribution guidelines.

## License

MIT © ZardUI