import { type ChangelogEntry } from '../changelog-entry.interface';

export const APRIL_2025: ChangelogEntry = {
  meta: {
    month: 'April 2025',
    year: 2025,
    monthNumber: 4,
    date: new Date(2025, 3, 1),
    id: '04-2025',
  },

  overview:
    'Form foundations and CLI launch! New Input and Form components with validation support. Official CLI tool released for easy project initialization and component installation.',

  loadExamples: () => import('./april-2025.examples').then(m => m.APRIL_2025_EXAMPLES),
};
