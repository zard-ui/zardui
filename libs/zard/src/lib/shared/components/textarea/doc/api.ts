import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const TEXTAREA_API: ApiSection[] = [
  {
    selector: 'textarea[z-textarea]',
    description:
      'A directive that styles a native `<textarea>` element. All native HTML textarea attributes (`rows`, `placeholder`, `disabled`, `required`, `readonly`, `maxlength`, `aria-invalid`, etc.) keep working as-is; the control grows with its content via CSS `field-sizing: content`, with no dedicated auto-resize input and no built-in character-count display.',
    props: [
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      { name: '[value]', description: 'Textarea value, two-way bindable', type: 'string', default: "''" },
      { name: '[(value)]', description: 'Textarea value (two-way binding)', type: 'string', default: "''" },
    ],
  },
];
