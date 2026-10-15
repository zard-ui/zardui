import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const COLOR_PICKER_API: ApiSection[] = [
  {
    selector: 'z-color-picker',
    description:
      'A swatch button that opens a panel in a popover: a saturation/brightness area, a hue slider, an optional alpha slider, a text field and optional presets. The value is a plain CSS color string in `zFormat`, and it works with `formControl` / `ngModel` through a ControlValueAccessor. Any hex, `rgb()`, `hsl()` or named CSS color is accepted as input.',
    props: [
      {
        name: '[class]',
        description: 'Additional CSS classes on the host. Also where the trigger width is overridden with `zShowValue`',
        type: 'ClassValue',
        default: "''",
      },
      {
        name: '[zId]',
        description: 'Applied to the trigger button, so a `<label for="…">` points at something focusable',
        type: 'string',
        default: "''",
      },
      {
        name: '[value]',
        description: 'Selected color, written in `zFormat`. `null` while nothing is picked',
        type: 'string | null',
        default: 'null',
      },
      {
        name: '[zFormat]',
        description: 'Format of the emitted value and of the text field',
        type: "'hex' | 'rgb' | 'hsl'",
        default: "'hex'",
      },
      {
        name: '[zAlpha]',
        description: 'Shows the alpha slider and includes alpha in the value when the color is not opaque',
        type: 'boolean',
        default: 'false',
      },
      {
        name: '[zPresets]',
        description: 'Preset swatches shown below the panel. Invalid colors are skipped',
        type: 'string[]',
        default: '[]',
      },
      {
        name: '[zSize]',
        description: 'Trigger size, on the same scale as `z-button` and `z-input`',
        type: "'sm' | 'default' | 'lg'",
        default: "'default'",
      },
      {
        name: '[zShowValue]',
        description: 'Shows the value next to the swatch, turning the square trigger into a full-width field',
        type: 'boolean',
        default: 'false',
      },
      { name: '[disabled]', description: 'Whether the color picker is disabled', type: 'boolean', default: 'false' },
      {
        name: '(zColorChange)',
        description: 'Emitted with the new value whenever the user changes the color',
        type: 'EventEmitter<string>',
        default: '-',
      },
    ],
  },
];
