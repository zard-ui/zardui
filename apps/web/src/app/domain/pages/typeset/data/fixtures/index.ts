import { ARTICLE_FIXTURE } from './article.fixture';
import { CHANGELOG_FIXTURE } from './changelog.fixture';
import { CHAT_FIXTURE } from './chat.fixture';
import { DOCS_FIXTURE } from './docs.fixture';
import { ELEMENTS_FIXTURE } from './elements.fixture';
import { NOTES_FIXTURE } from './notes.fixture';
import type { TypesetFixture } from '../../models/typeset.model';

/**
 * The samples, in the order the switcher offers them.
 *
 * The first five are the genres a typeset actually has to survive, and their
 * shape is the upstream shadcn fixture — the preset that reads well here reads
 * well on the page it was copied from. The prose and the code are written for
 * Angular, since that is the framework this port documents. `elements` closes
 * the list: it is the visual test, not a genre.
 *
 * Every `pre` carries `tabindex="0"`: typeset gives a code block
 * `overflow-x: auto`, and a scrollable region no key can reach is an
 * accessibility failure the e2e suite catches.
 */
export const TYPESET_FIXTURES: readonly TypesetFixture[] = [
  {
    id: 'docs',
    label: 'Docs',
    description: 'A technical page: prose, code blocks, a reference table and math.',
    html: DOCS_FIXTURE,
  },
  {
    id: 'chat',
    label: 'Chat',
    description: 'An assistant answer, the way it arrives after a question.',
    html: CHAT_FIXTURE,
  },
  {
    id: 'article',
    label: 'Article',
    description: 'Long-form reading with images, where the measure and the leading matter most.',
    html: ARTICLE_FIXTURE,
  },
  {
    id: 'changelog',
    label: 'Changelog',
    description: 'Dated releases and dense one-line entries under repeated headings.',
    html: CHANGELOG_FIXTURE,
  },
  {
    id: 'notes',
    label: 'Notes',
    description: 'Meeting notes: decisions, a task list and lists nested three deep.',
    html: NOTES_FIXTURE,
  },
  {
    id: 'elements',
    label: 'Elements',
    description: 'Every element the stylesheet touches, on one page.',
    html: ELEMENTS_FIXTURE,
  },
];

export function findFixture(id: string | null | undefined): TypesetFixture | undefined {
  if (!id) return undefined;
  return TYPESET_FIXTURES.find(fixture => fixture.id === id);
}
