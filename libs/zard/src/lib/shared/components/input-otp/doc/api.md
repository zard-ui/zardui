# API Reference

## ZardInputOtpComponent

The main OTP input container component.

### Inputs

| Property     | Type               | Default        | Description                        |
| ------------ | ------------------ | -------------- | ---------------------------------- |
| `zId`        | `string`           | auto-generated | The ID of the input element        |
| `zMaxLength` | `number`           | `6`            | Maximum number of characters       |
| `zPattern`   | `string \| RegExp` | `'[0-9]*'`     | Regex pattern for input validation |
| `zClass`     | `ClassValue`       | `''`           | Additional CSS classes             |
| `readonly`   | `boolean`          | `false`        | Makes the input readonly           |

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

## ZardInputOtpSlotComponent

Individual slot component for each character.

### Inputs

| Property | Type         | Default      | Description            |
| -------- | ------------ | ------------ | ---------------------- |
| `zIndex` | `number`     | **required** | The index of this slot |
| `zClass` | `ClassValue` | `''`         | Additional CSS classes |

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
| `zClass` | `ClassValue` | `''`    | Additional CSS classes |

## ZardInputOtpSeparatorComponent

Visual separator component between groups.

### Inputs

| Property | Type         | Default | Description            |
| -------- | ------------ | ------- | ---------------------- |
| `zClass` | `ClassValue` | `''`    | Additional CSS classes |

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

All components use CVA (Class Variance Authority) for styling and can be customized via the `zClass` input:

```html
<z-input-otp zClass="gap-4">
  <z-input-otp-group zClass="gap-1">
    <z-input-otp-slot [zIndex]="0" zClass="h-12 w-12 text-lg" />
    <!-- more slots -->
  </z-input-otp-group>
</z-input-otp>
```

## Accessibility

The component follows WAI-ARIA best practices:

- Proper `role` attributes
- Keyboard navigation support
- Focus management
- Screen reader support
- Disabled state handling
