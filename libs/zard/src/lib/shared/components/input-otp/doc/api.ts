import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const INPUT_OTP_API: ApiSection[] = [
  {
    selector: 'z-input-otp',
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
        description:
          "Per-character regex pattern used to validate typed and pasted input. Ready-made patterns — REGEXP_ONLY_DIGITS, REGEXP_ONLY_CHARS, REGEXP_ONLY_DIGITS_AND_CHARS — are exported from `input-otp.utils`, mirroring the `input-otp` library's constants of the same name",
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
        name: '[zInvalid]',
        description: 'Marks every slot as invalid; cascades to projected slots',
        type: 'boolean',
        default: 'false',
      },
      {
        name: '[zSize]',
        description: 'Size variant; cascades to projected slots and separators',
        type: "'sm' | 'default' | 'lg'",
        default: "'default'",
      },
      {
        name: '(zValueChange)',
        description: 'Emitted whenever the value changes',
        type: 'EventEmitter<string>',
        default: '-',
      },
      {
        name: '(zComplete)',
        description: 'Emitted when every slot is filled',
        type: 'EventEmitter<string>',
        default: '-',
      },
    ],
  },
  {
    selector: 'z-input-otp-signal',
    description:
      "Drop-in alternative to z-input-otp that implements the signal forms FormValueControl<string> contract. Use it when binding through [formField] from '@angular/forms/signals'. Inherits every input and output from z-input-otp.",
    props: [
      {
        name: '[value]',
        description: 'Current value',
        type: 'string',
        default: "''",
      },
      {
        name: '[(value)]',
        description: 'Current value; two-way bound by [formField]',
        type: 'string',
        default: "''",
      },
      {
        name: '[disabled]',
        description: "Disabled state; mirrors the field's disabled state",
        type: 'boolean',
        default: 'false',
      },
      {
        name: '[(disabled)]',
        description: 'Disabled state; two-way bound by [formField]',
        type: 'boolean',
        default: 'false',
      },
    ],
  },
  {
    selector: 'z-input-otp-slot',
    description:
      'Individual character slot. Displays the character, the active state, and the blinking fake caret while focused.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      { name: '[zIndex]', description: 'Zero-based position of the slot', type: 'number', default: 'required' },
      {
        name: '[zInvalid]',
        description: 'Marks this slot as invalid; also inherited from the parent z-input-otp',
        type: 'boolean',
        default: 'false',
      },
    ],
  },
  {
    selector: 'z-input-otp-group',
    description: 'Groups slots together so they render as a single connected block.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-input-otp-separator',
    description: 'Visual separator rendered between slot groups. Marked aria-hidden.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
];
