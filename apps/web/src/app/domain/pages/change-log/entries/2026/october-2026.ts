import { type ChangelogEntry } from '../changelog-entry.interface';

export const OCTOBER_2026: ChangelogEntry = {
  meta: {
    month: 'October 2026',
    year: 2026,
    monthNumber: 10,
    date: new Date(2026, 9, 1),
    id: '10-2026',
  },

  overview:
    'We made every component read right to left, so Arabic, Hebrew and Persian apps get the same library as everyone else. Turn it on when you run zard-cli init, or set dir="rtl" on your html tag, and see the RTL guide for fonts and migration. The CLI also learned to design: zard-cli create starts a project already styled from a preset, and zard-cli apply restyles one you already have.',

  highlights: [
    {
      title: 'Start a styled project with one command',
      description:
        '`zard-cli create` scaffolds an Angular, Nx or Analog.js application and configures it from a design preset, with a button already installed. Run it with no arguments to answer the questions, or paste the command the create page gives you.',
      icon: 'terminal',
      code: 'npx zard-cli@latest create my-app --template angular',
    },
    {
      title: 'Design your look on the create page',
      description:
        'Pick one of eight styles, a base color out of nine (Mauve, Olive, Mist and Taupe are new), the theme and chart colors, fonts, one of five icon libraries, the radius and the menu look, with a live preview. The preset code it produces works in `create`, `init --preset` and `apply`.',
      icon: 'settings',
    },
    {
      title: 'Restyle an existing project',
      description:
        '`zard-cli apply --preset` swaps the theme, fonts and icons of a project that is already initialized. It only rewrites the regions the CLI manages, so your own CSS survives, and it prints the commands to re-add the components you want to follow the new look.',
      icon: 'package',
      code: 'npx zard-cli@latest apply --preset <code>',
    },
  ],

  examplesTitle: 'Right to left',
  loadExamples: () => import('./october-2026.examples').then(m => m.OCTOBER_2026_EXAMPLES),
};
