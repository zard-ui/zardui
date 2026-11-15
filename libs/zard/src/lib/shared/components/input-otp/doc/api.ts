import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const INPUT_OTP_API: ApiSection[] = [
  {
    selector: 'z-input-otp',
    description: 'One-time code input; slots and arrow keys follow the text direction.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '[zMaxLength]',
        description: 'Max characters; falls back to the slot count, or 6',
        type: 'number',
        default: 'undefined',
      },
      {
        name: '[zPattern]',
        description: 'Per-character regex; presets in `input-otp.utils`',
        type: 'string',
        default: "'[0-9]'",
      },
      { name: '[zReadonly]', description: 'Makes every slot readonly', type: 'boolean', default: 'false' },
      { name: '[zIntegerOnly]', description: 'Numeric keyboard, digits only', type: 'boolean', default: 'true' },
      { name: '[zInvalid]', description: 'Marks every slot as invalid', type: 'boolean', default: 'false' },
      {
        name: '[zSize]',
        description: 'Size of the slots and separators',
        type: "'sm' | 'default' | 'lg'",
        default: "'default'",
      },
      {
        name: '(zValueChange)',
        description: 'Emitted when the value changes',
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
    description: '`z-input-otp` for signal forms (`[formField]`).',
    props: [
      { name: '[value]', description: 'Current value', type: 'string', default: "''" },
      { name: '[(value)]', description: 'Current value', type: 'string', default: "''" },
      { name: '[disabled]', description: 'Disabled state', type: 'boolean', default: 'false' },
      { name: '[(disabled)]', description: 'Disabled state', type: 'boolean', default: 'false' },
    ],
  },
  {
    selector: 'z-input-otp-slot',
    description: 'A single character slot.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      { name: '[zIndex]', description: 'Zero-based slot position', type: 'number', default: 'required' },
      { name: '[zInvalid]', description: 'Marks this slot as invalid', type: 'boolean', default: 'false' },
    ],
  },
  {
    selector: 'z-input-otp-group',
    description: 'Joins slots into one connected block.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-input-otp-separator',
    description: 'Separator between slot groups.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
];
