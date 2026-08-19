import { ARTICLE_FIXTURE } from './article.fixture';
import { CHANGELOG_FIXTURE } from './changelog.fixture';
import { CHAT_FIXTURE } from './chat.fixture';
import { DOCS_FIXTURE } from './docs.fixture';
import { ELEMENTS_FIXTURE } from './elements.fixture';
import { NOTES_FIXTURE } from './notes.fixture';
import type { TypesetFixture } from '../../models/typeset.model';

export const TYPESET_FIXTURES: readonly TypesetFixture[] = [
  {
    id: 'docs',
    label: 'Docs',
    description: 'Reference prose: steps, options and the occasional warning.',
    html: DOCS_FIXTURE,
  },
  {
    id: 'chat',
    label: 'Chat',
    description: 'A single assistant turn, the way it arrives in a bubble.',
    html: CHAT_FIXTURE,
  },
  {
    id: 'article',
    label: 'Article',
    description: 'Long-form reading, where the measure and the leading matter most.',
    html: ARTICLE_FIXTURE,
  },
  {
    id: 'changelog',
    label: 'Changelog',
    description: 'Dense nested lists under repeated headings.',
    html: CHANGELOG_FIXTURE,
  },
  {
    id: 'elements',
    label: 'Elements',
    description: 'Every element the stylesheet touches, on one page.',
    html: ELEMENTS_FIXTURE,
  },
  {
    id: 'notes',
    label: 'Notes',
    description: 'Short sections, task lists and a disclosure.',
    html: NOTES_FIXTURE,
  },
];

export function findFixture(id: string | null | undefined): TypesetFixture | undefined {
  if (!id) return undefined;
  return TYPESET_FIXTURES.find(fixture => fixture.id === id);
}
