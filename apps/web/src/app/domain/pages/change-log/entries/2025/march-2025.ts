import { type ChangelogEntry } from '../changelog-entry.interface';

export const MARCH_2025: ChangelogEntry = {
  meta: {
    month: 'March 2025',
    year: 2025,
    monthNumber: 3,
    date: new Date(2025, 2, 1),
    id: '03-2025',
  },

  overview:
    '🎉 Initial release of ZardUI! An Angular component library built with TailwindCSS v4, featuring standalone components, signal-based reactivity, and modern Angular architecture. Core components including Button, Card, Badge, Alert, and Table.',

  loadExamples: () => import('./march-2025.examples').then(m => m.MARCH_2025_EXAMPLES),
};
