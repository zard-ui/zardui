# Blocks Library

This library contains pre-built, production-ready UI blocks for ZardUI. Each block is a complete Angular component that demonstrates common design patterns and implementations.

## Overview

Blocks are full-page components that showcase real-world use cases, combining multiple ZardUI components into cohesive layouts. They can be used as starting points for building common application pages like dashboards, authentication flows, e-commerce catalogs, and more.

## Available Blocks

- **authentication-01**: Modern login page with form validation, social login, and forgot password functionality

## Block Structure

Each block follows a standardized directory structure:

```
libs/blocks/src/lib/[block-name]/
├── block.ts                        # Block metadata and configuration (REQUIRED)
├── [block-name].component.ts       # Angular component
└── [block-name].component.html     # Component template
```

## Adding a New Block

Follow this step-by-step guide to add a new block to the project:

### 1. Create Directory Structure

```bash
mkdir -p libs/blocks/src/lib/my-block
mkdir -p apps/web/public/blocks/my-block
```

### 2. Create the Angular Component

Create your Angular component with the `.component.ts` extension. Use Angular's `ReactiveFormsModule` for form handling and ZardUI form components for validation:

```typescript
// libs/blocks/src/lib/authentication-01/authentication-01.component.ts
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardComponent } from '@zard/components/card/card.component';
import { ZardCheckboxComponent } from '@zard/components/checkbox/checkbox.component';
import { ZardInputDirective } from '@zard/components/input/input.directive';
import {
  ZardFormFieldComponent,
  ZardFormLabelComponent,
  ZardFormControlComponent,
} from '@zard/components/form/form.component';

@Component({
  selector: 'z-authentication-01',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ZardButtonComponent,
    ZardCardComponent,
    ZardCheckboxComponent,
    ZardInputDirective,
    ZardFormFieldComponent,
    ZardFormLabelComponent,
    ZardFormControlComponent,
  ],
  templateUrl: './authentication-01.component.html',
})
export class Authentication01Component {
  protected readonly isLoading = signal(false);

  protected readonly loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    rememberMe: new FormControl(false),
  });

  protected get emailError(): string {
    const control = this.loginForm.get('email');
    if (control?.hasError('required') && control?.touched) {
      return 'Email is required';
    }
    if (control?.hasError('email') && control?.touched) {
      return 'Please enter a valid email address';
    }
    return '';
  }

  protected get passwordError(): string {
    const control = this.loginForm.get('password');
    if (control?.hasError('required') && control?.touched) {
      return 'Password is required';
    }
    if (control?.hasError('minlength') && control?.touched) {
      return 'Password must be at least 6 characters';
    }
    return '';
  }

  protected onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      // Handle login logic here
      console.log('Login submitted:', this.loginForm.value);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }
}
```

### 3. Create the Template

Use ZardUI form components for proper validation and error handling:

```html
<!-- libs/blocks/src/lib/authentication-01/authentication-01.component.html -->
<div class="flex min-h-screen flex-col lg:flex-row">
  <div class="bg-background flex flex-1 items-center justify-center p-4 sm:p-8">
    <div class="w-full max-w-md space-y-6">
      <z-card class="p-4 sm:p-6 lg:p-8">
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <!-- Email Field with Validation -->
          <z-form-field>
            <z-form-label [zRequired]="true">Email</z-form-label>
            <z-form-control [errorMessage]="emailError()">
              <input z-input type="email" formControlName="email" placeholder="name@example.com" class="w-full" />
            </z-form-control>
          </z-form-field>

          <!-- Password Field with Validation -->
          <z-form-field>
            <div class="flex items-center justify-between">
              <z-form-label [zRequired]="true">Password</z-form-label>
              <a href="#" class="text-primary text-sm hover:underline">Forgot password?</a>
            </div>
            <z-form-control [errorMessage]="passwordError()">
              <input z-input type="password" formControlName="password" placeholder="••••••••" class="w-full" />
            </z-form-control>
          </z-form-field>

          <!-- Remember Me Checkbox -->
          <div class="flex items-center gap-2">
            <z-checkbox id="remember" formControlName="rememberMe"></z-checkbox>
            <label for="remember" class="text-sm">Remember me</label>
          </div>

          <!-- Submit Button with Loading State -->
          <z-button type="submit" class="w-full" [disabled]="isLoading()">
            @if (isLoading()) { Signing in... } @else { Sign in }
          </z-button>
        </form>
      </z-card>
    </div>
  </div>
</div>
```

### 4. Create the Block Metadata File

This is the most important file - it defines how the block appears in the documentation:

```typescript
// libs/blocks/src/lib/my-block/block.ts
import type { Block } from '../../../../apps/web/src/app/domain/components/block-container/block-container.component';
import { MyBlockComponent } from './my-block.component';

export const myBlock: Block = {
  id: 'my-block-01', // Unique block identifier
  title: 'My Block Title',
  description: 'A detailed description of what this block does and when to use it',
  component: MyBlockComponent,
  category: 'dashboard', // Block category
  image: {
    light: '/blocks/my-block-01/light.png',
    dark: '/blocks/my-block-01/dark.png',
  },
  files: [
    {
      name: 'my-block.component.ts',
      path: 'src/components/my-block/my-block.component.ts',
      content: `import { Component } from '@angular/core';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardComponent } from '@zard/components/card/card.component';

@Component({
  selector: 'z-my-block',
  standalone: true,
  imports: [ZardButtonComponent, ZardCardComponent],
  templateUrl: './my-block.component.html',
})
export class MyBlockComponent {}`,
      language: 'typescript',
    },
    {
      name: 'my-block.component.html',
      path: 'src/components/my-block/my-block.component.html',
      content: `<div class="min-h-screen bg-background p-6">
  <z-card>
    <h1 class="text-2xl font-bold">My Block Title</h1>
    <p class="text-muted-foreground mt-2">Block description goes here.</p>
    <z-button class="mt-4">Get Started</z-button>
  </z-card>
</div>`,
      language: 'html',
    },
  ],
};
```

### 5. Export the Block

Add exports to the library's index file:

```typescript
// libs/blocks/src/index.ts
export * from './lib/my-block/my-block.component';
export * from './lib/my-block/block';
```

### 6. Register in Blocks Registry

Import and add the block to the appropriate category:

```typescript
// apps/web/src/app/domain/config/blocks-registry.ts
import { myBlock } from '@blocks/my-block/block';

export const BLOCKS_REGISTRY: Record<BlockCategory, Block[]> = {
  featured: [dashboard01Block],
  dashboard: [myBlock], // Add to appropriate category
  sidebar: [],
  login: [],
  signup: [],
  otp: [],
  calendar: [],
};
```

### 7. Add Preview Images

Capture screenshots of your block for the documentation:

#### Screenshot Guidelines

1. **Light Theme** (`light.png`):
   - Set the application to light mode
   - Navigate to the block in full screen
   - Capture a high-quality screenshot
   - Save as `apps/web/public/blocks/my-block-01/light.png`

2. **Dark Theme** (`dark.png`):
   - Switch to dark mode using the theme toggle
   - Navigate to the block in full screen
   - Capture a high-quality screenshot
   - Save as `apps/web/public/blocks/my-block-01/dark.png`

#### Image Specifications

- **Format**: PNG for best quality
- **Resolution**: Recommended 1920x1080 or higher
- **Content**: Capture the complete block with all elements visible
- **Consistency**: Maintain the same viewport size and angle for all blocks

## Block Categories

Available categories for organizing blocks:

- **featured** - Highlighted blocks on the main page
- **dashboard** - Dashboard and analytics layouts
- **sidebar** - Sidebar navigation patterns
- **login** - Login page designs
- **signup** - Registration and signup flows
- **otp** - OTP verification screens
- **calendar** - Calendar and scheduling interfaces

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

All viewports display the live, interactive component - no static images in the preview panel.

## Files Array Structure

The `files` array in the block metadata should include all necessary code files for implementing the block:

```typescript
files: [
  {
    name: 'component.ts', // Display name
    path: 'src/path/to/file.ts', // Logical path for organization
    content: '...', // Complete file content
    language: 'typescript', // For syntax highlighting
  },
  // Add more files as needed (HTML, CSS, etc.)
];
```

Supported languages for syntax highlighting:

- `typescript`
- `html`
- `css`
- `json`

## Best Practices

1. **Unique IDs**: Ensure each block has a unique identifier
2. **Multiple Categories**: Blocks can appear in multiple categories if relevant
3. **Complete Code**: Include all necessary files in the `files` array
4. **Standalone Components**: Always use standalone components with explicit imports
5. **Responsive Design**: Ensure blocks work well across all viewport sizes
6. **Accessibility**: Follow ARIA guidelines and semantic HTML
7. **Documentation**: Provide clear descriptions and use cases

## Example Reference

See the `authentication-01` block at `libs/blocks/src/lib/authentication-01/` for a complete, production-ready example that demonstrates:

- Form validation with Angular Reactive Forms
- ZardUI form components (FormField, FormLabel, FormControl)
- Responsive design patterns for mobile, tablet, and desktop
- Loading states and user feedback
- Social login integration
- Error handling and validation messages
- Proper file structure and component organization

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
