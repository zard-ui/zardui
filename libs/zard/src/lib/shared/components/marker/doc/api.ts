import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const MARKER_API: ApiSection[] = [
  {
    selector: 'z-marker, [z-marker]',
    description:
      'Root of an inline conversation marker. Use the attribute selector on an `a` or `button` to make the whole marker interactive, and set `role="status"` for streaming or in-progress markers.',
    props: [
      {
        name: '[zVariant]',
        description:
          'Layout of the marker: inline row, bordered row, or a centered label with divider lines on each side.',
        type: 'default | border | separator',
        default: 'default',
      },
      { name: '[class]', description: 'Override or extend default classes.', type: 'ClassValue', default: '-' },
    ],
  },
  {
    selector: 'z-marker-icon, [z-marker-icon]',
    description: 'Decorative icon slot, hidden from assistive tech with `aria-hidden`.',
    props: [{ name: '[class]', description: 'Override or extend default classes.', type: 'ClassValue', default: '-' }],
  },
  {
    selector: 'z-marker-content, [z-marker-content]',
    description:
      'Text content of the marker. Add the `shimmer` class for an animated streaming-text effect, which is disabled automatically when the user prefers reduced motion.',
    props: [{ name: '[class]', description: 'Override or extend default classes.', type: 'ClassValue', default: '-' }],
  },
];
