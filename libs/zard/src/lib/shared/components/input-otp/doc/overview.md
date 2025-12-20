# Input OTP

Accessible one-time password component with copy paste functionality.

## Features

- ✅ Fully accessible with ARIA attributes
- ✅ Copy/paste support
- ✅ Keyboard navigation (Arrow keys, Backspace, Delete)
- ✅ Pattern validation (digits only, alphanumeric, custom regex)
- ✅ Auto-focus management
- ✅ Disabled and readonly states
- ✅ Form integration with Angular Forms
- ✅ Customizable separators
- ✅ Complete event when all slots are filled

## Installation

### CLI

```bash
npx @ngzard/ui add input-otp
```

### Manual

Create the component directory structure and add the following files to your project:

- `input-otp.component.ts`
- `input-otp-slot.component.ts`
- `input-otp-group.component.ts`
- `input-otp-separator.component.ts`
- `input-otp.variants.ts`

## Usage

```typescript
import { Component } from '@angular/core';
import { ZardInputOtpComponent } from '@shared/components/input-otp/input-otp.component';
import { ZardInputOtpSlotComponent } from '@shared/components/input-otp/input-otp-slot.component';
import { ZardInputOtpGroupComponent } from '@shared/components/input-otp/input-otp-group.component';
import { ZardInputOtpSeparatorComponent } from '@shared/components/input-otp/input-otp-separator.component';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [
    ZardInputOtpComponent,
    ZardInputOtpSlotComponent,
    ZardInputOtpGroupComponent,
    ZardInputOtpSeparatorComponent,
  ],
  template: `
    <z-input-otp [zMaxLength]="6">
      <z-input-otp-group>
        <z-input-otp-slot [zIndex]="0" />
        <z-input-otp-slot [zIndex]="1" />
        <z-input-otp-slot [zIndex]="2" />
      </z-input-otp-group>
      <z-input-otp-separator />
      <z-input-otp-group>
        <z-input-otp-slot [zIndex]="3" />
        <z-input-otp-slot [zIndex]="4" />
        <z-input-otp-slot [zIndex]="5" />
      </z-input-otp-group>
    </z-input-otp>
  `,
})
export class ExampleComponent {}
```

## Common Patterns

You can use predefined patterns or create your own:

```typescript
// Only digits (0-9)
export const REGEXP_ONLY_DIGITS = '^[0-9]+$';

// Only letters (a-z, A-Z)
export const REGEXP_ONLY_CHARS = '^[a-zA-Z]+$';

// Letters and numbers
export const REGEXP_ONLY_DIGITS_AND_CHARS = '^[a-zA-Z0-9]+$';

// Use in template
<z-input-otp [zMaxLength]="6" [zPattern]="REGEXP_ONLY_DIGITS">
  <!-- slots -->
</z-input-otp>
```

## Form Integration

The component works seamlessly with Angular Forms (both Template-driven and Reactive):

```typescript
import { FormControl, FormGroup, Validators } from '@angular/forms';

form = new FormGroup({
  pin: new FormControl('', [Validators.required, Validators.minLength(6)]),
});
```

```html
<z-input-otp [zMaxLength]="6" formControlName="pin">
  <!-- slots -->
</z-input-otp>
```

## Accessibility

The component includes proper ARIA attributes and keyboard navigation:

- **Arrow Keys**: Navigate between slots
- **Backspace**: Delete the last character
- **Delete**: Clear all characters
- **Paste**: Automatically fills all slots from clipboard
- **Tab**: Standard focus navigation
