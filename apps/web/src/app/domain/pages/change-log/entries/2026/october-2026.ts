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
    'We made every component read right to left, so Arabic, Hebrew and Persian apps get the same library as everyone else. Turn it on when you run zard-cli init, or set dir="rtl" on your html tag, and see the RTL guide for fonts and migration.',

  examplesTitle: 'Right to left',
  loadExamples: () => import('./october-2026.examples').then(m => m.OCTOBER_2026_EXAMPLES),
};
