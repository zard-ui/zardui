import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const RESIZABLE_API: ApiSection[] = [
  {
    selector: 'z-resizable',
    description:
      "The panel group that lays out its `z-resizable-panel` children along `zLayout` and manages their sizes. Add `#ref=\"zResizable\"` on the element to call its public methods. `ZardResizeEvent` is `{ sizes: number[]; layout: 'horizontal' | 'vertical' }`, where `sizes` is the current size of every panel as a percentage (0-100) of the group, in panel order.",
    props: [
      {
        name: '[zLayout]',
        description: 'Layout direction of the panels',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
      },
      {
        name: '[zLazy]',
        description: 'If true, panels only update after resize ends instead of on every drag/keyboard step',
        type: 'boolean',
        default: 'false',
      },
      { name: '[class]', description: 'Additional CSS classes to apply', type: 'ClassValue', default: "''" },
      {
        name: '(zResizeStart)',
        description: 'Emitted once when a drag or keyboard resize starts, with the sizes at that moment',
        type: 'EventEmitter<ZardResizeEvent>',
        default: '-',
      },
      {
        name: '(zResize)',
        description: 'Emitted with the updated sizes on every resize step (drag move, arrow key, or collapse toggle)',
        type: 'EventEmitter<ZardResizeEvent>',
        default: '-',
      },
      {
        name: '(zResizeEnd)',
        description: 'Emitted once when a drag or keyboard resize ends, with the final sizes',
        type: 'EventEmitter<ZardResizeEvent>',
        default: '-',
      },
      {
        name: 'collapsePanel(index)',
        description:
          'Public method that toggles the panel at `index` between 0 and its `zDefaultSize` (or an even share of the group). No-ops unless that panel has `zCollapsible` set — it is what a handle\'s Enter/Space keydown calls internally, and what a consumer calls to drive an external "collapse sidebar" control.',
        type: '(index: number) => void',
        default: '-',
      },
    ],
  },
  {
    selector: 'z-resizable-panel',
    description:
      'A single panel inside a `z-resizable` group. Sizes are percentages of the group along its resize axis (0-100), not pixels: pass a bare number/numeric string for a percentage, an explicit `"50%"` string, or a `"300px"` string, which is converted to a percentage of the group\'s current container size once, at layout time. The `zDefaultSize`s of the panels in one group should add up to 100 — a panel that omits it gets an even share of the remaining space.',
    props: [
      {
        name: '[zDefaultSize]',
        description: 'Initial size of the panel (see the selector description for the unit)',
        type: 'number | string | undefined',
        default: 'undefined',
      },
      {
        name: '[zMin]',
        description: 'Minimum size the panel can be resized to, in the same unit as `zDefaultSize`',
        type: 'number | string',
        default: '0',
      },
      {
        name: '[zMax]',
        description: 'Maximum size the panel can be resized to, in the same unit as `zDefaultSize`',
        type: 'number | string',
        default: '100',
      },
      {
        name: '[zCollapsible]',
        description: 'Whether the neighboring handle may collapse this panel to 0 (Enter/Space, or `collapsePanel`)',
        type: 'boolean',
        default: 'false',
      },
      {
        name: '[zResizable]',
        description: 'Whether the handles on either side of this panel are allowed to resize it',
        type: 'boolean',
        default: 'true',
      },
      { name: '[class]', description: 'Additional CSS classes to apply', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: 'z-resizable-handle',
    description:
      'The draggable divider between two `z-resizable-panel`s. Renders `role="separator"` with `aria-orientation` (perpendicular to the group\'s `zLayout`) and is keyboard-operable: arrow keys resize by 1% (10% with Shift) in the axis matching the layout, Home/End jump the adjacent panels to their min/max, and Enter/Space toggles collapse when either neighboring panel is `zCollapsible`.',
    props: [
      {
        name: '[zWithHandle]',
        description: 'Shows a visual grip indicator inside the divider',
        type: 'boolean',
        default: 'false',
      },
      {
        name: '[zDisabled]',
        description: 'Disables dragging, keyboard resize, and collapse',
        type: 'boolean',
        default: 'false',
      },
      {
        name: '[zHandleIndex]',
        description:
          'Position of the handle among its panel siblings — the handle at index `i` resizes the panel at `i` and the panel at `i + 1`. Must be set explicitly when a group has more than one handle; it is not computed automatically',
        type: 'number',
        default: '0',
      },
      { name: '[class]', description: 'Additional CSS classes to apply', type: 'ClassValue', default: "''" },
    ],
  },
];
