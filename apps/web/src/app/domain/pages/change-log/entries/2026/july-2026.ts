import { type ChangelogEntry } from '../changelog-entry.interface';

export const JULY_2026: ChangelogEntry = {
  meta: {
    month: 'July 2026',
    year: 2026,
    monthNumber: 7,
    date: new Date(2026, 6, 1),
    id: '07-2026',
  },

  overview:
    'Four new components this month — Field, Item, Textarea, and Sonner — and a reorganisation that moved every demo and API doc next to the component it documents.',

  highlights: [
    {
      title: 'Toast is now Sonner',
      description:
        'The `toast` component has been replaced by `sonner`. Swap `z-toast` / `z-toaster` for `z-sonner`, import `ZardSonnerService` instead of the toast service, and reinstall under the new name. The old component no longer ships.',
      icon: 'package',
      code: 'npx zard-cli@latest add sonner',
    },
    {
      title: 'Demos and docs live with the components',
      description:
        'Every demo, API reference, and overview moved from the documentation site into `libs/zard/.../components/<name>/`. Nothing changes for you as a consumer — the CLI and the registry are unaffected — but contributing a component is now a single folder.',
      icon: 'code',
    },
  ],

  loadExamples: () => import('./july-2026.examples').then(m => m.JULY_2026_EXAMPLES),
};
