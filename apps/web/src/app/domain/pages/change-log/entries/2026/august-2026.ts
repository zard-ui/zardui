import { type ChangelogEntry } from '../changelog-entry.interface';

export const AUGUST_2026: ChangelogEntry = {
  meta: {
    month: 'August 2026',
    year: 2026,
    monthNumber: 8,
    date: new Date(2026, 7, 1),
    id: '08-2026',
  },

  overview:
    'One-time passwords land this month. We added the Input OTP component, with grouped slots, separators, pattern validation, and paste support out of the box.',

  loadExamples: () => import('./august-2026.examples').then(m => m.AUGUST_2026_EXAMPLES),
};
