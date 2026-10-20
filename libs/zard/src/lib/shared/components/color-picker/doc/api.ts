import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const COLOR_PICKER_API: ApiSection[] = [
  {
    selector: 'z-color-picker',
    description:
      'A swatch button that opens a panel in a popover: a saturation/brightness area, a hue slider, an optional alpha slider, a text field and optional presets. The value is a plain CSS color string in `zFormat`, and it works with `formControl` / `ngModel` through a ControlValueAccessor. Any hex, `rgb()`, `hsl()`, `oklch()` or named CSS color is accepted as input; an `oklch()` color outside sRGB is brought into gamut by lowering its chroma, as browsers do. A value written from outside is shown as is and only normalized to `zFormat` (and stripped of alpha without `zAlpha`) on the next pick. Where the browser supports the EyeDropper API (Chromium), the panel also offers a button to pick a color from the screen.',
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
        description:
          'Format of the emitted value and of the text field. `oklch` is written like Tailwind CSS v4 tokens (`oklch(0.628 0.25768 29.23)`), with enough decimals to read back as the same color',
        type: "'hex' | 'rgb' | 'hsl' | 'oklch'",
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
      {
        name: '[zPlaceholder]',
        description: 'Text shown in the trigger while no color is picked',
        type: 'string',
        default: "'Pick a color'",
      },
      {
        name: '[zAlign]',
        description: 'Alignment of the panel relative to the trigger',
        type: "'start' | 'center' | 'end'",
        default: "'start'",
      },
      {
        name: '[zShowFormatToggle]',
        description:
          'Shows HEX / RGB / HSL / OKLCH tabs above the text field. Only the text changes: the value is still emitted in `zFormat`',
        type: 'boolean',
        default: 'true',
      },
      { name: '[disabled]', description: 'Whether the color picker is disabled', type: 'boolean', default: 'false' },
      {
        name: '(zColorChange)',
        description: 'Emitted with the new value whenever the user changes the color, including every frame of a drag',
        type: 'EventEmitter<string>',
        default: '-',
      },
      {
        name: '(zColorCommit)',
        description:
          'Emitted once the change settles: when a drag ends, on each key press, and when a preset, the text field or the eyedropper sets the color. Use it to save or call an API without debouncing',
        type: 'EventEmitter<string>',
        default: '-',
      },
    ],
  },
];
