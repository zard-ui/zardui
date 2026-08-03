import { type ChangelogEntry } from '../changelog-entry.interface';

export const AUGUST_2025: ChangelogEntry = {
  meta: {
    month: 'August 2025',
    year: 2025,
    monthNumber: 8,
    date: new Date(2025, 7, 1),
    id: '08-2025',
  },

  overview:
    'Enhanced navigation and display components. New Avatar component with fallback support, Divider for content separation, and Breadcrumb for hierarchical navigation.',

  loadExamples: () => import('./august-2025.examples').then(m => m.AUGUST_2025_EXAMPLES),
};
