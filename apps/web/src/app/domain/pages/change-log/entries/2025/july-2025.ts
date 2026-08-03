import { type ChangelogEntry } from '../changelog-entry.interface';

export const JULY_2025: ChangelogEntry = {
  meta: {
    month: 'July 2025',
    year: 2025,
    monthNumber: 7,
    date: new Date(2025, 6, 1),
    id: '07-2025',
  },

  overview:
    'Major release of navigation and content organization components. New Tabs for multi-view interfaces, Accordion for collapsible content, and Tooltip for contextual information. Theming system improvements with new color palettes.',

  loadExamples: () => import('./july-2025.examples').then(m => m.JULY_2025_EXAMPLES),
};
