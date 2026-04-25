# API Reference

## ZardInputOtpComponent

The main OTP input container component.

### Inputs

| Property        | Type                          | Default     | Description                                                       |
| --------------- | ----------------------------- | ----------- | ----------------------------------------------------------------- |
| `zMaxLength`    | `number`                      | `undefined` | Maximum number of characters. Auto-detected from slot count.      |
| `zPattern`      | `string`                      | `'[0-9]'`   | Per-character regex pattern for input validation                  |
| `zReadonly`     | `boolean`                     | `false`     | Makes the input readonly                                          |
| `zIntegerOnly`  | `boolean`                     | `true`      | Restricts inputmode to numeric and limits keyboard input          |
| `zSize`         | `'sm' \| 'default' \| 'lg'`   | `'default'` | Size variant; cascades to projected slots and separators          |
| `class`         | `ClassValue`                  | `''`        | Additional CSS classes                                            |

### Outputs

| Event          | Type     | Description                       |
| -------------- | -------- | --------------------------------- |
| `zValueChange` | `string` | Emitted when the value changes    |
| `zComplete`    | `string` | Emitted when all slots are filled |

### Methods

| Method              | Parameters                 | Return | Description                           |
| ------------------- | -------------------------- | ------ | ------------------------------------- |
| `writeValue`        | `value: string`            | `void` | Sets the value (ControlValueAccessor) |
| `registerOnChange`  | `fn: (value: any) => void` | `void` | Registers change callback             |
| `registerOnTouched` | `fn: () => void`           | `void` | Registers touched callback            |
| `setDisabledState`  | `isDisabled: boolean`      | `void` | Sets disabled state                   |

## ZardInputOtpSignalComponent

A drop-in alternative to `ZardInputOtpComponent` that implements Angular signal forms' `FormValueControl<string>` contract. Use this variant when binding via `[formField]` from `@angular/forms/signals`.

Inherits all inputs and outputs from `ZardInputOtpComponent` and adds:

| Property   | Type                    | Default | Description                                                            |
| ---------- | ----------------------- | ------- | ---------------------------------------------------------------------- |
| `value`    | `ModelSignal<string>`   | `''`    | Two-way bound by `[formField]`; reflects the field value.              |
| `disabled` | `ModelSignal<boolean>`  | `false` | Two-way bound by `[formField]`; mirrors the field's disabled state.    |

## ZardInputOtpSlotComponent

Individual slot component for each character.

### Inputs

| Property | Type         | Default      | Description            |
| -------- | ------------ | ------------ | ---------------------- |
| `zIndex` | `number`     | **required** | The index of this slot |
| `class`  | `ClassValue` | `''`         | Additional CSS classes |

### State

The slot component maintains internal state for:

- `char`: The current character in this slot
- `isActive`: Whether this slot is currently focused
- `hasFakeCaret`: Whether to show the blinking caret

## ZardInputOtpGroupComponent

Container component for grouping slots together.

### Inputs

| Property | Type         | Default | Description            |
| -------- | ------------ | ------- | ---------------------- |
| `class`  | `ClassValue` | `''`    | Additional CSS classes |

## ZardInputOtpSeparatorComponent

Visual separator component between groups.

### Inputs

| Property | Type         | Default | Description            |
| -------- | ------------ | ------- | ---------------------- |
| `class`  | `ClassValue` | `''`    | Additional CSS classes |

## Usage Examples

### Basic Usage

```html
<z-input-otp [zMaxLength]="6">
  <z-input-otp-group>
    <z-input-otp-slot [zIndex]="0" />
    <z-input-otp-slot [zIndex]="1" />
    <z-input-otp-slot [zIndex]="2" />
    <z-input-otp-slot [zIndex]="3" />
    <z-input-otp-slot [zIndex]="4" />
    <z-input-otp-slot [zIndex]="5" />
  </z-input-otp-group>
</z-input-otp>
```

### With Separators

```html
<z-input-otp [zMaxLength]="6">
  <z-input-otp-group>
    <z-input-otp-slot [zIndex]="0" />
    <z-input-otp-slot [zIndex]="1" />
  </z-input-otp-group>
  <z-input-otp-separator />
  <z-input-otp-group>
    <z-input-otp-slot [zIndex]="2" />
    <z-input-otp-slot [zIndex]="3" />
  </z-input-otp-group>
  <z-input-otp-separator />
  <z-input-otp-group>
    <z-input-otp-slot [zIndex]="4" />
    <z-input-otp-slot [zIndex]="5" />
  </z-input-otp-group>
</z-input-otp>
```

### With Pattern Validation

```html
<z-input-otp [zMaxLength]="6" [zPattern]="REGEXP_ONLY_DIGITS">
  <z-input-otp-group>
    <!-- slots -->
  </z-input-otp-group>
</z-input-otp>
```

### Common Patterns

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

```html
<form [formGroup]="form">
  <z-input-otp [zMaxLength]="6" formControlName="otp">
    <!-- slots -->
  </z-input-otp>
</form>
```

### With Event Handlers

```html
<z-input-otp [zMaxLength]="6" (zValueChange)="onValueChange($event)" (zComplete)="onComplete($event)">
  <!-- slots -->
</z-input-otp>
```

```typescript
onValueChange(value: string): void {
  console.log('Value changed:', value);
}

onComplete(value: string): void {
  console.log('OTP completed:', value);
  // Auto-submit or validate
}
```

## Styling

All components use CVA (Class Variance Authority) for styling. The main component accepts `zClass`; subcomponents accept the native `class` attribute:

```html
<z-input-otp zClass="gap-4" zSize="lg">
  <z-input-otp-group class="gap-1">
    <z-input-otp-slot [zIndex]="0" class="h-12 w-12 text-lg" />
    <!-- more slots -->
  </z-input-otp-group>
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
