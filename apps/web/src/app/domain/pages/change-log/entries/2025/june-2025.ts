import { type ChangelogEntry } from '../changelog-entry.interface';

export const JUNE_2025: ChangelogEntry = {
  meta: {
    month: 'June 2025',
    year: 2025,
    monthNumber: 6,
    date: new Date(2025, 5, 1),
    id: '06-2025',
  },

  overview:
    'Overlay components release! New Dialog, Popover, Alert Dialog, and Dropdown Menu components. CVA integration for type-safe styling variants across all components.',

  loadExamples: () => import('./june-2025.examples').then(m => m.JUNE_2025_EXAMPLES),
};
