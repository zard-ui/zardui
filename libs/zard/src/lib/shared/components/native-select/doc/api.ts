import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const NATIVE_SELECT_API: ApiSection[] = [
  {
    selector: 'select[z-native-select]',
    description:
      'A directive that styles a native `<select>` element. It adds no `ControlValueAccessor` and no wrapper, so `formControl`, `formControlName`, `ngModel` and every native attribute (`disabled`, `required`, `multiple`, `name`, `aria-invalid`, ...) keep working as-is. Options and groups are plain `<option>` and `<optgroup>` elements. Use Native Select for the native OS picker, built-in keyboard and form support, and zero overlay; use Select for custom styling, animations, rich items or complex interactions.',
    props: [
      {
        name: '[zSize]',
        description: 'Size variant. `default` lines up with the height of `z-input` and `z-select`',
        type: "'sm' | 'default' | 'lg'",
        default: "'default'",
      },
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
];
