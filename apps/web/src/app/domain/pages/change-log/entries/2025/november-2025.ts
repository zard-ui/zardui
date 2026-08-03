import { type ChangelogEntry } from '../changelog-entry.interface';

export const NOVEMBER_2025: ChangelogEntry = {
  meta: {
    month: 'November 2025',
    year: 2025,
    monthNumber: 11,
    date: new Date(2025, 10, 1),
    id: '11-2025',
  },

  overview:
    'Major updates this month with new interactive components including Carousel, Button Group, Input Group, and Kbd components. Enhanced user experience with better form controls and keyboard navigation support.',

  loadExamples: () => import('./november-2025.examples').then(m => m.NOVEMBER_2025_EXAMPLES),
};
