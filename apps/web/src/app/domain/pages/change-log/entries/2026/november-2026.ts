import { type ChangelogEntry } from '../changelog-entry.interface';

export const NOVEMBER_2026: ChangelogEntry = {
  meta: {
    month: 'November 2026',
    year: 2026,
    monthNumber: 11,
    date: new Date(2026, 10, 1),
    id: '11-2026',
  },

  overview:
    'Our biggest month for new components yet. We added Data Table, Color Picker, Menubar, Native Select and Questionnaire, plus Code Block, Message Scroller and Trace for chat and agent interfaces, an interactive Map, and the AI Elements patterns built on top of them.',

  highlights: [
    {
      title: 'AI Elements',
      description:
        'A new docs section with 21 ready-made patterns for chat and agent interfaces, such as reasoning, tool calls, plans, sources and the prompt input. Each one is composed from Zard components and lists the ones it needs.',
      icon: 'code',
    },
    {
      title: 'Map',
      description:
        'An interactive MapLibre map with markers, popups, routes, clusters and heatmaps, whose basemap follows your light or dark theme. It needs a short setup for the MapLibre assets, covered on its page.',
      icon: 'package',
      code: 'npx zard-cli@latest add map',
    },
  ],

  loadExamples: () => import('./november-2026.examples').then(m => m.NOVEMBER_2026_EXAMPLES),
};
