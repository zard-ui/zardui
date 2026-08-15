# Blocks Library

This library contains pre-built, production-ready UI blocks for ZardUI. Each block is a complete Angular component that demonstrates common design patterns and implementations.

## Overview

Blocks are full-page components that showcase real-world use cases, combining multiple ZardUI components into cohesive layouts. They can be used as starting points for building common application pages like dashboards, authentication flows, e-commerce catalogs, and more.

## Available Blocks

### Login

- **login-01**: A simple login form.
- **login-02**: A two column login page with a cover image.
- **login-03**: A login page with a muted background color.
- **login-04**: A login page with form and image.
- **login-05**: A simple email-only login page.

### Signup

- **signup-01**: A simple signup form.
- **signup-02**: A two column signup page with a cover image.
- **signup-03**: A signup page with a muted background color.
- **signup-04**: A signup page with form and image.
- **signup-05**: A simple signup form with social providers.

## Block Structure

Each block follows a standardized directory structure:

```
libs/blocks/src/lib/[block-name]/
├── block.ts                        # Block metadata and configuration (REQUIRED)
├── [block-name].component.ts       # Angular component
└── [block-name].component.html     # Component template
```

## Adding a New Block

The fastest path is the Nx generator, which creates the three files, exports them in
`libs/blocks/src/index.ts` and registers the block in `BLOCKS_REGISTRY`:

```bash
npx nx generate @zardui/generators:block \
  --name=login-06 \
  --description="Split login screen with a testimonial panel" \
  --category=login \
  --label=Login \
  --title="Login with testimonial"
```

The steps below describe what the generator produces and what you still have to fill in by hand.

### 1. Create Directory Structure

```bash
mkdir -p libs/blocks/src/lib/my-block
mkdir -p apps/web/public/blocks/my-block
```

### 2. Create the Angular Component

Use standalone components with `ChangeDetectionStrategy.OnPush`, signals for local state and Angular's
`ReactiveFormsModule` for form handling:

```typescript
// libs/blocks/src/lib/login-01/login-01.component.ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';

@Component({
  selector: 'lib-login-01',
  standalone: true,
  imports: [ReactiveFormsModule, ZardButtonComponent, ZardInputComponent, ...ZardCardImports, ...ZardFieldImports],
  templateUrl: './login-01.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login01Component {
  protected readonly isLoading = signal(false);

  protected readonly loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  protected onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
  }
}
```

### 3. Create the Template

Compose the block with the ZardUI `field` primitives — `z-field-group`, `z-field`, `z-field-label`,
`z-field-description` and `z-field-separator`. `z-card-title` and `z-card-description` take their text
through the `zTitle` / `zDescription` inputs (they have no `ng-content`):

```html
<!-- libs/blocks/src/lib/login-01/login-01.component.html -->
<div class="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
  <div class="w-full max-w-sm">
    <div class="flex flex-col gap-6">
      <z-card>
        <div z-card-header>
          <z-card-title zTitle="Login to your account" />
          <z-card-description zDescription="Enter your email below to login to your account" />
        </div>
        <div z-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div z-field-group>
              <div z-field>
                <label z-field-label for="email">Email</label>
                <input z-input id="email" type="email" placeholder="m@example.com" formControlName="email" required />
              </div>
              <div z-field>
                <div class="flex items-center">
                  <label z-field-label for="password">Password</label>
                  <a href="#" class="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <input z-input id="password" type="password" formControlName="password" required />
              </div>
              <div z-field>
                <button z-button type="submit" [zLoading]="isLoading()" [zDisabled]="isLoading()">Login</button>
                <button z-button zType="outline" type="button">Login with Google</button>
                <p z-field-description class="text-center">
                  Don't have an account?
                  <a href="#">Sign up</a>
                </p>
              </div>
            </div>
          </form>
        </div>
      </z-card>
    </div>
  </div>
</div>
```

### 4. Create the Block Metadata File

This is the most important file — it defines how the block appears in the documentation. Leave `files: []`
empty: it is generated by `npm run sync:blocks` from the sibling component files and must never be edited by hand.

```typescript
// libs/blocks/src/lib/login-01/block.ts
import type { Block } from '@doc/domain/components/block-container/block-container.component';

import { Login01Component } from './login-01.component';

export const login01Block: Block = {
  id: 'login-01', // Unique block identifier (matches the folder name)
  title: 'Login form',
  description: 'A simple login form.',
  component: Login01Component,
  category: 'Login', // Display label shown on the card
  image: {
    light: '/blocks/login-01/light.png',
    dark: '/blocks/login-01/dark.png',
  },
  // Generated by `npm run sync:blocks` from the sibling component files — do not edit by hand.
  files: [],
};
```

### 5. Export the Block

Add exports to the library's index file:

```typescript
// libs/blocks/src/index.ts
export * from './lib/login-01/login-01.component';
export * from './lib/login-01/block';
```

### 6. Register in Blocks Registry

Import and add the block to the appropriate category. `featured` is the bucket `/blocks` opens on, so it
must never be empty:

```typescript
// apps/web/src/app/domain/config/blocks-registry.ts
import { login01Block, signup01Block } from '@blocks';

export const BLOCKS_REGISTRY: Record<BlockCategory, any[]> = {
  featured: [login01Block, signup01Block],
  sidebar: [],
  login: [login01Block], // Add to the matching category
  signup: [signup01Block],
  otp: [],
  calendar: [],
};
```

### 7. Sync the Files Array

```bash
npm run sync:blocks   # fills files[] in every block.ts
npm run build:registry # regenerates apps/web/public/r/blocks/*.json for the CLI and MCP
```

### 8. Add Preview Images

Capture screenshots of your block for the documentation:

#### Screenshot Guidelines

1. **Light Theme** (`light.png`):
   - Set the application to light mode
   - Open `/blocks/preview/<block-id>` in full screen
   - Capture a high-quality screenshot
   - Save as `apps/web/public/blocks/<block-id>/light.png`

2. **Dark Theme** (`dark.png`):
   - Switch to dark mode using the theme toggle
   - Open `/blocks/preview/<block-id>` in full screen
   - Capture a high-quality screenshot
   - Save as `apps/web/public/blocks/<block-id>/dark.png`

#### Image Specifications

- **Format**: PNG for best quality
- **Resolution**: 1440x900 or higher (the card declares that intrinsic size)
- **Content**: Capture the complete block with all elements visible
- **Consistency**: Maintain the same viewport size for all blocks

Without these two files the card on `/blocks` renders a broken image on the mobile breakpoint.

## Block Categories

Available categories for organizing blocks:

- **featured** - Highlighted blocks on the main page
- **sidebar** - Sidebar navigation patterns
- **login** - Login page designs
- **signup** - Registration and signup flows
- **otp** - OTP verification screens
- **calendar** - Calendar and scheduling interfaces

Adding a new category means adding the key to `BlockCategory` in
`apps/web/src/app/domain/services/blocks.service.ts` **and** to `BLOCKS_REGISTRY` — the generator fails otherwise.

## Theme Integration

The blocks system is fully integrated with the `DarkModeService`:

- **Automatic theme detection**: Blocks automatically adapt to the current theme
- **Dynamic image switching**: Preview images update when theme changes
- **Live component preview**: All viewport sizes show the live, interactive component

## Viewport Previews

The block preview system supports three viewport sizes:

- **Desktop** (100% width): Full-width responsive view
- **Tablet** (768px): Medium screen layout
- **Mobile** (375px): Mobile-first view

All viewports display the live, interactive component - no static images in the preview panel. The preview
is rendered inside an `<iframe>` pointing at `/blocks/preview/<block-id>`, so the block's root container
should use `min-h-svh` to fill the page.

## Files Array Structure

The `files` array in the block metadata is generated by `npm run sync:blocks` from the component files that
sit next to `block.ts`. Each entry looks like this:

```typescript
files: [
  {
    name: 'login-01.component.ts', // Display name
    path: 'src/components/login-01/login-01.component.ts', // Logical path for organization
    content: '...', // Complete file content
    language: 'typescript', // For syntax highlighting
  },
  // One entry per .ts / .html file in the block folder
];
```

Supported languages for syntax highlighting:

- `typescript`
- `html`
- `css`
- `json`

## Best Practices

1. **Unique IDs**: Ensure each block has a unique identifier matching its folder name
2. **No new primitives**: Blocks only compose components that already exist in `libs/zard`
3. **Generated `files[]`**: Never edit it by hand — run `npm run sync:blocks`
4. **Standalone Components**: Always use standalone components with explicit imports and `OnPush`
5. **Responsive Design**: Ensure blocks work well across all viewport sizes
6. **Accessibility**: Follow ARIA guidelines and semantic HTML
7. **Documentation**: Provide clear descriptions and use cases

## Example Reference

See the `login-01` block at `libs/blocks/src/lib/login-01/` for a complete, production-ready example that
demonstrates:

- Form handling with Angular Reactive Forms and signals
- ZardUI field primitives (`z-field-group`, `z-field`, `z-field-label`, `z-field-description`)
- Card composition with `zTitle` / `zDescription`
- Responsive design patterns for mobile, tablet, and desktop
- Loading states and user feedback
- Proper file structure and component organization

For richer layouts, `login-04` and `signup-04` show a two-column card with a cover image, and `login-03`
shows social provider buttons with inline brand SVGs.

## Testing

Run tests for the blocks library:

```bash
nx test blocks
```

Run tests in watch mode:

```bash
nx test blocks --watch
```

## Technologies

- **Angular**: Component framework
- **TailwindCSS**: Styling and design system
- **ZardUI Components**: Base component library
- **DarkModeService**: Theme management
- **Nx**: Monorepo tooling

## Contributing

When contributing new blocks:

1. Follow the structure outlined in this guide
2. Ensure code quality and proper formatting
3. Test across all viewport sizes
4. Capture high-quality preview images
5. Provide comprehensive code examples
6. Document any external dependencies

## Support

For issues or questions:

- Check existing blocks for reference implementations
- Review the ZardUI component documentation
- Open an issue in the project repository
