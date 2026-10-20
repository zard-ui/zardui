import { type ChangelogEntry } from '../changelog-entry.interface';

export const APRIL_2026: ChangelogEntry = {
  meta: {
    month: 'April 2026',
    year: 2026,
    monthNumber: 4,
    date: new Date(2026, 3, 1),
    id: '04-2026',
  },

  overview:
    'A thin month — two releases, no new components. One quietly narrows the Avatar `zSize` API to named sizes only; the other makes Select track option lists that keep changing after render.',

  highlights: [
    {
      title: 'Avatar drops numeric sizes',
      description:
        '`zSize` on `z-avatar` only takes `sm`, `default`, `md`, `lg` and `xl` now: the numeric option is gone. Swap a number for the closest name (32, 40, 48, 56 and 64 px) or for a `size-*` class. Its exported types were renamed too.',
      icon: 'shield',
      code: '<z-avatar zSize="sm" />',
      renames: [
        { from: 'ZardAvatarVariants', to: ['ZardAvatarSizeVariants'] },
        { from: 'ZardImageVariants', to: ['ZardAvatarShapeVariants'] },
        { from: 'ZardAvatarGroupVariants', to: ['ZardAvatarGroupOrientationVariants'] },
      ],
    },
    {
      title: 'Select follows dynamic option lists',
      description:
        'Options added to a `z-select` after it renders, from a signal or a reactive list, are now selectable. The current value survives new options, and removing the selected one falls back to the raw value. No input or output changed.',
      icon: 'code',
    },
  ],
};
