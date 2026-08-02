import { type ChangelogEntry } from '../changelog-entry.interface';

export const MAY_2025: ChangelogEntry = {
  meta: {
    month: 'May 2025',
    year: 2025,
    monthNumber: 5,
    date: new Date(2025, 4, 1),
    id: '05-2025',
  },

  overview:
    'Comprehensive form controls release! New Select, Checkbox, Radio, Switch, and Slider components with full Angular Reactive Forms integration and ControlValueAccessor support.',

  loadExamples: () => import('./may-2025.examples').then(m => m.MAY_2025_EXAMPLES),
};
