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
| `zClass`        | `ClassValue`                  | `''`        | Additional CSS classes                                            |

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

### With Forms

```typescript
// Reactive Forms
form = new FormGroup({
  otp: new FormControl('', [Validators.required, Validators.minLength(6)]),
});
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

- Each slot input ships with `aria-label="One-time password digit N of M"`.
- Slot inputs declare `autocomplete="one-time-code"` and `inputmode="numeric"` (or `"text"` when `zIntegerOnly` is `false`).
- The separator is marked `aria-hidden="true"`.
- The host element exposes `data-disabled` while the form control is disabled.
- Arrow keys move focus across slots, `Backspace` jumps back when a slot is empty, and `Tab` is never trapped.
