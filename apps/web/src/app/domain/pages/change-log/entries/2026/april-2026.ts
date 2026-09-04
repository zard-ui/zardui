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
        '`zSize` on `z-avatar` now only accepts `sm | default | md | lg | xl` — the `number` option is gone. Replace a numeric size with the closest named variant (sm=32, default=40, md=48, lg=56, xl=64) or a `size-*` class. The exported types also renamed: `ZardAvatarVariants` → `ZardAvatarSizeVariants`, `ZardImageVariants` → `ZardAvatarShapeVariants`, `ZardAvatarGroupVariants` → `ZardAvatarGroupOrientationVariants`.',
      icon: 'shield',
      code: '<z-avatar zSize="sm" />',
    },
    {
      title: 'Select follows dynamic option lists',
      description:
        '`z-select` now wires its projected `z-select-item`s through an effect on `contentChildren` instead of `ngAfterContentInit`, so options added later from a signal or reactive collection become selectable, the current value survives additions, and removing the selected item falls back to the raw value. No input or output changed.',
      icon: 'code',
    },
  ],
};
