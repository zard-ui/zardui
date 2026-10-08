import { ZARD_VERSION } from '../../constants/zard-version.constant';
import { type ChangelogEntry } from '../changelog-entry.interface';

/**
 * The v1.0.0 release month. Carries only `release` — no highlights, no examples —
 * because the announcement above the timeline is the point; this entry exists so
 * the month still has a place in the chronological record.
 */
export const SEPTEMBER_2026: ChangelogEntry = {
  meta: {
    month: 'September 2026',
    year: 2026,
    monthNumber: 9,
    date: new Date(2026, 8, 1),
    id: '09-2026',
  },

  overview: 'The month v1.0.0 ships — see the announcement above for what a stable 1.0 means.',

  highlights: [
    {
      title: 'Dialog, sheet and alert dialog in the template',
      description:
        'The three overlays gain the declarative form the drawer already had: compose z-dialog, z-sheet or z-alert-dialog with [(zVisible)] and header, title, description and footer children, or keep opening the same panel from code through the service. Every example on their pages now shows both.',
      icon: 'code',
    },
  ],

  release: {
    version: ZARD_VERSION,
    title: 'Zard UI v1.0 is here',
    summary:
      'Alpha, Beta, and Release Candidate converge into a stable 1.0: the component API, the CLI, and the registry format are now covered by semantic versioning, and breaking changes only ship behind a major bump from here on.',
    video: '/video/release-1.0.mp4',
  },
};
