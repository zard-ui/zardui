import { type ChangelogEntry } from '../changelog-entry.interface';

export const NOVEMBER_2026_CREATE: ChangelogEntry = {
  meta: {
    month: 'November 2026',
    year: 2026,
    monthNumber: 11,
    date: new Date(2026, 10, 23),
    id: '11-2026-create',
    slug: '2026-11-create',
    title: 'Create',
  },

  overview:
    'Design how your app looks on the create page, then start it with one command. `zard-cli create` builds a new Angular, Nx or Analog app that already has your theme, fonts, icons and radius, so the first screen you open looks like yours and not like a template.',

  release: {
    label: 'zard/ui create',
    title: 'Same app. Stronger.',
    summary:
      'Pick a style, one of the base colors or your own, shuffle until it looks like yours, then take it home with one command.',
    video: '/video/create-video.webm',
  },

  highlights: [
    {
      title: 'Design it on the create page',
      description:
        'Pick one of eight styles, a base color out of seven (Mauve, Olive, Mist and Taupe are new), the theme and chart colors, fonts, one of five icon libraries, the radius and the menu look, and watch real screens follow each change. Get Code gives you a short preset code and the command for your template and package manager.',
    },
    {
      title: 'Start a project with create',
      description:
        '`zard-cli create` runs the framework’s own generator, applies the preset and installs a button so you can see it working. Run it with no arguments and it asks for the name, the template and the design; paste the command from the create page and it asks nothing. The installation guides now start here.',
      code: 'npx zard-cli@latest create',
    },
    {
      title: 'Bring the design to an existing project',
      description:
        '`init` still sets up a project you already have. On its own it installs the default design and asks only for the theme color; pass `--preset` and it uses the one you built instead.',
      code: 'npx zard-cli@latest init --preset <code>',
    },
    {
      title: 'Restyle with apply',
      description:
        '`zard-cli apply` swaps the theme, fonts and icons of a project that is already set up. It rewrites only the parts the CLI manages, so your own CSS stays, and `--only theme` or `--only font` narrows it down further.',
      code: 'npx zard-cli@latest apply --preset <code>',
    },
    {
      title: 'Built to be run by agents',
      description:
        'Every command takes `--no-interactive`, so an AI agent or a CI job can pass everything up front and never stop at a question. The MCP server has six new tools that build these commands for the assistant: `get-design-options`, `get-create-command`, `get-init-command`, `get-apply-command`, `get-add-command` and `get-audit-checklist`.',
      code: 'npx zard-cli@latest create my-app --template angular --preset <code> --no-interactive',
    },
  ],
};
