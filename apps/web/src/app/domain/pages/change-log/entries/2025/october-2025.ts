import { type ChangelogEntry } from '../changelog-entry.interface';

export const OCTOBER_2025: ChangelogEntry = {
  meta: {
    month: 'October 2025',
    year: 2025,
    monthNumber: 10,
    date: new Date(2025, 9, 1),
    id: '10-2025',
  },

  overview:
    'Breaking changes with icons migration from lucide-static to lucide-angular for better performance. New layout components including Sheet and Empty state component for better UX.',

  loadExamples: () => import('./october-2025.examples').then(m => m.OCTOBER_2025_EXAMPLES),
};
