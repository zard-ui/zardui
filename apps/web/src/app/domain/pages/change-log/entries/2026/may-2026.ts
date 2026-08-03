import { type ChangelogEntry } from '../changelog-entry.interface';

export const MAY_2026: ChangelogEntry = {
  meta: {
    month: 'May 2026',
    year: 2026,
    monthNumber: 5,
    date: new Date(2026, 4, 1),
    id: '05-2026',
  },

  overview:
    'A quieter month focused on form correctness. We taught the input directive to speak numbers, and we changed one dialog default that had been surprising people.',

  highlights: [
    {
      title: 'Numeric inputs keep their type',
      description:
        'The input directive now reads and writes real numbers for `type="number"` and `type="range"`, so a signal or reactive form typed as `number` stays a number instead of being turned into a string. An empty field resolves to `null`.',
      icon: 'code',
    },
    {
      title: 'Alert Dialog no longer closes on the backdrop',
      description:
        '`zMaskClosable` now defaults to `false` on Alert Dialog. A confirmation is meant to be answered, not dismissed by a stray click. If you relied on the old behaviour, opt back in explicitly.',
      icon: 'shield',
      code: 'zMaskClosable: true',
    },
  ],
};
