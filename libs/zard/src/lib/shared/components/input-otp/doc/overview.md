# Input OTP

Accessible one-time password component with copy-paste functionality.

## Features

- ✅ Fully accessible with ARIA attributes
- ✅ Copy/paste support
- ✅ Keyboard navigation (Arrow keys, Backspace, Delete)
- ✅ Pattern validation (digits only, alphanumeric, custom regex)
- ✅ Auto-focus management
- ✅ Disabled and readonly states
- ✅ Form integration with Angular Forms (Template-driven, Reactive, and Signal Forms)
- ✅ Slot grouping with customizable separators
- ✅ Fake caret animation on active slot
- ✅ `zComplete` event when all slots are filled

## Installation

### CLI

```bash
npx @ngzard/ui add input-otp
```

### Manual

Create the component directory structure and add the following files to your project:

- `input-otp.component.ts`
- `input-otp-signal.component.ts`
- `input-otp-slot.component.ts`
- `input-otp-group.component.ts`
- `input-otp-separator.component.ts`
- `input-otp.tokens.ts`
- `input-otp.variants.ts`

## Usage

```typescript
import { Component } from '@angular/core';
import {
  ZardInputOtpComponent,
  ZardInputOtpSlotComponent,
  ZardInputOtpGroupComponent,
  ZardInputOtpSeparatorComponent,
} from '@ngzard/ui';

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
export const REGEXP_ONLY_DIGITS = '[0-9]';

// Only letters (a-z, A-Z)
export const REGEXP_ONLY_CHARS = '[a-zA-Z]';

// Letters and numbers
export const REGEXP_ONLY_DIGITS_AND_CHARS = '[a-zA-Z0-9]';

// Uppercase letters and numbers
export const REGEXP_ONLY_UPPERCASE_AND_DIGITS = '[A-Z0-9]';
```

```html
<z-input-otp [zMaxLength]="6" [zPattern]="REGEXP_ONLY_DIGITS">
  <!-- slots -->
</z-input-otp>
```

> **Note:** Patterns are matched per character, not against the full string. Use `[0-9]` not `^[0-9]+$`.

## Form Integration

### Reactive Forms

```typescript
import { FormControl, FormGroup, Validators } from '@angular/forms';

form = new FormGroup({
  pin: new FormControl('', [Validators.required, Validators.minLength(6)]),
});
```

```html
<form [formGroup]="form">
  <z-input-otp [zMaxLength]="6" formControlName="pin">
    <z-input-otp-group>
      <z-input-otp-slot [zIndex]="0" />
      <z-input-otp-slot [zIndex]="1" />
      <z-input-otp-slot [zIndex]="2" />
      <z-input-otp-slot [zIndex]="3" />
      <z-input-otp-slot [zIndex]="4" />
      <z-input-otp-slot [zIndex]="5" />
    </z-input-otp-group>
  </z-input-otp>
</form>
```

### Template-driven Forms

```html
<z-input-otp [(ngModel)]="otp" [zMaxLength]="6">
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
```

### Signal Forms

For Angular's signal forms (`@angular/forms/signals`), use the `ZardInputOtpSignalComponent` variant. It implements `FormValueControl<string>` and binds via `[formField]`.

```typescript
import { Component, signal } from '@angular/core';
import { form, minLength, required, FormField } from '@angular/forms/signals';
import {
  ZardInputOtpSignalComponent,
  ZardInputOtpSlotComponent,
  ZardInputOtpGroupComponent,
} from '@ngzard/ui';

@Component({
  imports: [
    ZardInputOtpSignalComponent,
    ZardInputOtpSlotComponent,
    ZardInputOtpGroupComponent,
    FormField,
  ],
  template: `
    <z-input-otp-signal [formField]="otpForm.pin">
      <z-input-otp-group>
        <z-input-otp-slot [zIndex]="0" />
        <z-input-otp-slot [zIndex]="1" />
        <z-input-otp-slot [zIndex]="2" />
        <z-input-otp-slot [zIndex]="3" />
        <z-input-otp-slot [zIndex]="4" />
        <z-input-otp-slot [zIndex]="5" />
      </z-input-otp-group>
    </z-input-otp-signal>
  `,
})
export class Example {
  private model = signal({ pin: '' });
  protected otpForm = form(this.model, otp => {
    required(otp.pin);
    minLength(otp.pin, 6);
  });
}
```

## Event Handling

```typescript
export class ExampleComponent {
  onValueChange(value: string): void {
    console.log('Current value:', value);
  }

  onComplete(value: string): void {
    console.log('OTP complete:', value);
    // auto-submit or trigger verification
  }
}
```

```html
<z-input-otp [zMaxLength]="6" (zValueChange)="onValueChange($event)" (zComplete)="onComplete($event)">
  <!-- slots -->
</z-input-otp>
```

## Accessibility

Each slot input is rendered as a real `<input>` with:

- `aria-label="One-time password digit N of M"` for screen readers
- `autocomplete="one-time-code"` so password managers and SMS autofill recognize the field
- `inputmode="numeric"` (or `"text"` when `zIntegerOnly` is `false`) for the right mobile keyboard

The separator carries `aria-hidden="true"` so it isn't announced, and the host exposes `data-disabled` when the form control is disabled.

Keyboard support:

- **Arrow Left / Right**: navigate between slots
- **Backspace**: delete the current character or move to the previous slot
- **Delete**: clear the current slot
- **Tab**: standard focus navigation (no keyboard trap)
- **Paste**: fills the remaining slots from the clipboard, filtered by `zPattern`
