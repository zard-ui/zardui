import { type ChangelogEntry } from '../changelog-entry.interface';

export const SEPTEMBER_2025: ChangelogEntry = {
  meta: {
    month: 'September 2025',
    year: 2025,
    monthNumber: 9,
    date: new Date(2025, 8, 1),
    id: '09-2025',
  },

  overview:
    'Focus on loading and feedback components this month. New Progress, Skeleton, and Loader components for better perceived performance and user feedback during async operations.',

  loadExamples: () => import('./september-2025.examples').then(m => m.SEPTEMBER_2025_EXAMPLES),
};
