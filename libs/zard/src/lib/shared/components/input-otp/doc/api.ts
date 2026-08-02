import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const INPUT_OTP_API: ApiSection[] = [
  {
    selector: 'z-input-otp, [z-input-otp]',
    description:
      'Container for a one-time password input. Renders its own slots when none are projected and integrates with Angular forms through ControlValueAccessor.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '[zMaxLength]',
        description: 'Maximum number of characters. Falls back to the projected slot count, or 6 when there are none',
        type: 'number',
        default: 'undefined',
      },
      {
        name: '[zPattern]',
        description: 'Per-character regex pattern used to validate typed and pasted input',
        type: 'string',
        default: "'[0-9]'",
      },
      { name: '[zReadonly]', description: 'Makes every slot readonly', type: 'boolean', default: 'false' },
      {
        name: '[zIntegerOnly]',
        description: 'Sets inputmode to numeric and restricts keyboard input to digits',
        type: 'boolean',
        default: 'true',
      },
      {
        name: '[zSize]',
        description: 'Size variant; cascades to projected slots and separators',
        type: "'sm' | 'default' | 'lg'",
        default: "'default'",
      },
      { name: '(zValueChange)', description: 'Emitted whenever the value changes', type: 'string', default: '-' },
      { name: '(zComplete)', description: 'Emitted when every slot is filled', type: 'string', default: '-' },
    ],
  },
  {
    selector: 'z-input-otp-signal, [z-input-otp-signal]',
    description:
      "Drop-in alternative to z-input-otp that implements the signal forms FormValueControl<string> contract. Use it when binding through [formField] from '@angular/forms/signals'. Inherits every input and output from z-input-otp.",
    props: [
      {
        name: '[(value)]',
        description: 'Current value; two-way bound by [formField]',
        type: 'string',
        default: "''",
      },
      {
        name: '[(disabled)]',
        description: "Disabled state; two-way bound by [formField] and mirrors the field's disabled state",
        type: 'boolean',
        default: 'false',
      },
    ],
  },
  {
    selector: 'z-input-otp-slot, [z-input-otp-slot]',
    description:
      'Individual character slot. Displays the character, the active state, and the blinking fake caret while focused.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      { name: '[zIndex]', description: 'Zero-based position of the slot', type: 'number', default: 'required' },
    ],
  },
  {
    selector: 'z-input-otp-group, [z-input-otp-group]',
    description: 'Groups slots together so they render as a single connected block.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-input-otp-separator, [z-input-otp-separator]',
    description: 'Visual separator rendered between slot groups. Marked aria-hidden.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
];
