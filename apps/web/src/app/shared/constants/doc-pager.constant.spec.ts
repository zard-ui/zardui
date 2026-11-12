import { buildDocSequence, DOC_SEQUENCE, findDocNeighbours, normalizeDocPath } from './doc-pager.constant';
import { type NavSection, SECTIONS } from './routes.constant';

describe('doc pager', () => {
  const shortcuts: NavSection = {
    title: 'Sections',
    data: [
      { name: 'Introduction', path: '/docs/introduction', available: true },
      { name: 'Installation', path: '/docs/installation', available: true },
    ],
  };
  const components: NavSection = {
    title: 'Components',
    data: [
      { name: 'Tooltip', path: '/docs/components/tooltip', available: true },
      { name: 'Typography', path: '/docs/typeset', available: true },
      { name: 'Soon', path: '/docs/components/soon', available: false },
    ],
  };
  const gettingStarted: NavSection = {
    title: 'Get Started',
    data: [
      { name: 'Installation', path: '/docs/installation', available: true },
      { name: 'Typeset', path: '/docs/typeset', available: true },
      { name: 'llms.txt', path: '/llms.txt', available: true, external: true },
      { name: 'Roadmap', path: '/docs/roadmap', available: true },
    ],
  };
  const sequence = buildDocSequence([shortcuts, components, gettingStarted], shortcuts);
  const paths = sequence.map(item => item.path);

  it('follows the sidebar, opening with the pages only the shortcuts list', () => {
    expect(paths).toEqual([
      '/docs/introduction',
      '/docs/components/tooltip',
      '/docs/typeset',
      '/docs/installation',
      '/docs/roadmap',
    ]);
  });

  it('skips llms.txt, so the page before it links straight to the one after it', () => {
    expect(findDocNeighbours('/docs/installation', sequence).next?.path).toBe('/docs/roadmap');
    expect(findDocNeighbours('/docs/roadmap', sequence).previous?.path).toBe('/docs/installation');
  });

  it('goes from Tooltip to Typography and back', () => {
    expect(findDocNeighbours('/docs/components/tooltip', sequence).next?.name).toBe('Typography');
    expect(findDocNeighbours('/docs/typeset', sequence).previous?.name).toBe('Tooltip');
  });

  it('has no previous on the first page and no next on the last one', () => {
    expect(findDocNeighbours('/docs/introduction', sequence).previous).toBeNull();
    expect(findDocNeighbours('/docs/roadmap', sequence).next).toBeNull();
  });

  it('ignores the query, the fragment and a trailing slash', () => {
    expect(normalizeDocPath('/docs/components/tooltip/?tab=api#usage')).toBe('/docs/components/tooltip');
    expect(findDocNeighbours('/docs/typeset#overview', sequence).next?.path).toBe('/docs/installation');
  });

  it('shows nothing on a page outside the docs sequence', () => {
    expect(findDocNeighbours('/blocks', sequence)).toEqual({ previous: null, next: null });
  });

  describe('the real sidebar', () => {
    const realPaths = DOC_SEQUENCE.map(item => item.path);

    it('lists every page once and never llms.txt', () => {
      expect(new Set(realPaths).size).toBe(realPaths.length);
      expect(realPaths).not.toContain('/llms.txt');
      expect(DOC_SEQUENCE.every(item => item.available && !item.external)).toBe(true);
    });

    it('starts at the introduction and keeps every shortcut reachable', () => {
      expect(realPaths[0]).toBe('/docs/introduction');
      SECTIONS.data.forEach(item => expect(realPaths).toContain(item.path));
    });

    it('steps over llms.txt in Get Started', () => {
      expect(findDocNeighbours('/docs/figma').next?.path).toBe('/docs/pre-processors');
      expect(findDocNeighbours('/docs/pre-processors').previous?.path).toBe('/docs/figma');
    });
  });
});
