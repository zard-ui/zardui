import { type ChangelogEntry } from '../changelog-entry.interface';

export const OCTOBER_2026: ChangelogEntry = {
  meta: {
    month: 'October 2026',
    year: 2026,
    monthNumber: 10,
    date: new Date(2026, 9, 1),
    id: '10-2026',
  },

  overview:
    'We made every component read right to left, so Arabic, Hebrew and Persian apps get the same library as everyone else.',

  highlights: [
    {
      title: 'First-class RTL support',
      description:
        'Every component now works in right-to-left layouts: logical styles, overlays that open on the right side, mirrored arrow keys and flipped directional icons. The files you install are the same in LTR and RTL, so set dir="rtl" on your html tag, or let init do it, and you are done. Each component page has an RTL example, and the RTL guide covers fonts, animations and migrating existing components.',
      icon: 'zap',
      code: 'npx zard-cli@latest init --rtl',
    },
  ],
};
