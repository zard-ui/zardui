import { COMPONENTS_PATH } from '@doc/shared/constants/routes.constant';

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

  release: {
    version: ZARD_VERSION,
    title: 'Zard UI v1.0 is here',
    summary:
      'Alpha, Beta, and Release Candidate converge into a stable 1.0: the component API, the CLI, and the registry format are now covered by semantic versioning, and breaking changes only ship behind a major bump from here on.',
    facts: [
      {
        label: 'Components',
        value: `${COMPONENTS_PATH.data.length}+ accessible, production-ready components`,
      },
      {
        label: 'CLI',
        value:
          'zard-cli sets up an existing Angular, Nx or Analog project and installs components and blocks on demand',
      },
      {
        label: 'Registry',
        value: 'A versioned JSON registry — the CLI and MCP server read the same source',
      },
      {
        label: 'MCP Server',
        value: 'zard-mcp on npm, so AI assistants read and generate against the real components',
      },
      {
        label: 'Skills',
        value: 'Two agent skills, zard and zard-migration, teach assistants the conventions and the upgrade path',
      },
      {
        label: 'Stability',
        value: 'Semantic versioning, starting now — no more surprise breaks between betas',
      },
    ],
    cta: {
      label: 'Get started',
      link: '/docs/installation',
    },
  },
};
