import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const MARKER_API: ApiSection[] = [
  {
    selector: 'z-marker, [z-marker]',
    description:
      'Root of an inline conversation marker. Content projected without a `z-marker-content` child gets the content surface for free, so `<z-marker zIcon="lucideSearch">Explored 4 files</z-marker>` is a complete row. Use the attribute selector on an `a` or `button` to make the whole marker interactive, and set `role="status"` for streaming or in-progress markers.',
    props: [
      {
        name: '[zVariant]',
        description:
          'Layout of the marker: inline row, bordered row, or a centered label with divider lines on each side.',
        type: 'default | border | separator',
        default: 'default',
      },
      {
        name: '[zIcon]',
        description:
          'Icon rendered in the decorative icon slot. A string is the `@ng-icons` name to render — register it with `provideIcons` — and a template is rendered as is. Ignored when a `z-marker-icon` is projected.',
        type: 'string | TemplateRef<void>',
        default: '-',
      },
      { name: '[class]', description: 'Override or extend default classes.', type: 'ClassValue', default: '-' },
    ],
  },
  {
    selector: 'z-marker-icon, [z-marker-icon]',
    description:
      'Decorative icon slot, hidden from assistive tech with `aria-hidden`. Project it when the icon is a component such as `z-spinner`; otherwise `zIcon` on the root is enough.',
    props: [{ name: '[class]', description: 'Override or extend default classes.', type: 'ClassValue', default: '-' }],
  },
  {
    selector: 'z-marker-content, [z-marker-content]',
    description:
      'Text content of the marker. Optional — the root wraps bare projected content in this surface. Project it to add classes such as `shimmer`, an animated streaming-text effect that is disabled automatically when the user prefers reduced motion.',
    props: [{ name: '[class]', description: 'Override or extend default classes.', type: 'ClassValue', default: '-' }],
  },
];
